use futures_util::StreamExt;
use serde::{Deserialize, Serialize};
use serde_json::{json, Value};
use std::{
    path::{Path, PathBuf},
    process::{Child, Command, Stdio},
    sync::{
        atomic::{AtomicBool, Ordering},
        Arc, Mutex,
    },
    time::Duration,
};
use tauri::{Emitter, Manager, State};

const BASE: &str = "http://127.0.0.1:11435";
#[derive(Default)]
pub struct Runtime {
    child: Mutex<Option<Child>>,
    installer: Mutex<Option<Child>>,
    busy: AtomicBool,
    cancel: Arc<AtomicBool>,
}
impl Runtime {
    pub fn stop(&self) {
        if let Some(mut child) = self.child.lock().unwrap().take() {
            let _ = child.kill();
            let _ = child.wait();
        }
    }
}
struct Busy<'a>(&'a Runtime);
impl Drop for Busy<'_> {
    fn drop(&mut self) {
        self.0.busy.store(false, Ordering::SeqCst);
    }
}
fn lock_job(rt: &Runtime) -> Result<Busy<'_>, String> {
    rt.busy
        .compare_exchange(false, true, Ordering::SeqCst, Ordering::SeqCst)
        .map_err(|_| "Another local operation is still running.".to_string())?;
    rt.cancel.store(false, Ordering::SeqCst);
    Ok(Busy(rt))
}
#[derive(Default, Serialize, Deserialize, Clone)]
pub struct Settings {
    pub executable: Option<String>,
    pub library: Option<String>,
}
fn config_path(app: &tauri::AppHandle) -> Result<PathBuf, String> {
    Ok(app
        .path()
        .app_config_dir()
        .map_err(|e| e.to_string())?
        .join("settings.json"))
}
fn settings(app: &tauri::AppHandle) -> Settings {
    config_path(app)
        .ok()
        .and_then(|p| std::fs::read(p).ok())
        .and_then(|b| serde_json::from_slice(&b).ok())
        .unwrap_or_default()
}
fn persist(app: &tauri::AppHandle, cfg: &Settings) -> Result<(), String> {
    let p = config_path(app)?;
    std::fs::create_dir_all(p.parent().unwrap()).map_err(|e| e.to_string())?;
    std::fs::write(p, serde_json::to_vec_pretty(cfg).unwrap()).map_err(|e| e.to_string())
}
fn hidden(cmd: &mut Command) -> &mut Command {
    #[cfg(windows)]
    {
        use std::os::windows::process::CommandExt;
        cmd.creation_flags(0x08000000);
    }
    cmd.stdin(Stdio::null())
        .stdout(Stdio::null())
        .stderr(Stdio::null());
    cmd
}
fn output(program: &str, args: &[&str]) -> Option<String> {
    let mut c = Command::new(program);
    hidden(&mut c);
    c.args(args).stdout(Stdio::piped());
    c.output()
        .ok()
        .filter(|o| o.status.success())
        .map(|o| String::from_utf8_lossy(&o.stdout).trim().to_string())
}
fn user_env(name: &str) -> Option<String> {
    #[cfg(windows)]
    {
        if let Ok(k) =
            winreg::RegKey::predef(winreg::enums::HKEY_CURRENT_USER).open_subkey("Environment")
        {
            if let Ok(v) = k.get_value::<String, _>(name) {
                if !v.is_empty() {
                    return Some(v);
                }
            }
        }
    }
    std::env::var(name).ok().filter(|s| !s.is_empty())
}
fn library(cfg: &Settings) -> PathBuf {
    cfg.library
        .clone()
        .or_else(|| user_env("OLLAMA_MODELS"))
        .map(PathBuf::from)
        .unwrap_or_else(|| {
            PathBuf::from(std::env::var("USERPROFILE").unwrap_or_default()).join(".ollama/models")
        })
}
fn executable(cfg: &Settings) -> Option<PathBuf> {
    let mut paths = Vec::new();
    if let Some(p) = &cfg.executable {
        paths.push(PathBuf::from(p));
    }
    if let Ok(p) = std::env::var("LOCALAPPDATA") {
        paths.push(PathBuf::from(p).join("Programs/Ollama/ollama.exe"));
    }
    if let Some(p) = output("where.exe", &["ollama.exe"]) {
        paths.extend(p.lines().map(PathBuf::from));
    }
    paths.into_iter().find(|p| p.is_file())
}
fn client(seconds: u64) -> Result<reqwest::Client, String> {
    reqwest::Client::builder()
        .no_proxy()
        .timeout(Duration::from_secs(seconds))
        .build()
        .map_err(|e| e.to_string())
}
async fn version(base: &str) -> Option<String> {
    client(2)
        .ok()?
        .get(format!("{base}/api/version"))
        .send()
        .await
        .ok()?
        .error_for_status()
        .ok()?
        .json::<Value>()
        .await
        .ok()?["version"]
        .as_str()
        .map(str::to_owned)
}
fn owned(rt: &Runtime) -> bool {
    let mut guard = rt.child.lock().unwrap();
    if let Some(c) = guard.as_mut() {
        matches!(c.try_wait(), Ok(None))
    } else {
        false
    }
}
async fn require_server(rt: &Runtime) -> Result<(), String> {
    if !owned(rt) || version(BASE).await.is_none() {
        Err("Start Soma’s local Ollama session first.".into())
    } else {
        Ok(())
    }
}
#[tauri::command]
pub async fn status(app: tauri::AppHandle, rt: State<'_, Runtime>) -> Result<Value, String> {
    let cfg = settings(&app);
    let exe = executable(&cfg);
    let root = library(&cfg);
    let normal = version("http://127.0.0.1:11434").await;
    let own = if owned(&rt) {
        version(BASE).await
    } else {
        None
    };
    let mut candidates = Vec::new();
    for disk in sysinfo::Disks::new_with_refreshed_list().iter() {
        for name in ["OllamaModels", "Ollama_Models", "ollama/models"] {
            let p = disk.mount_point().join(name);
            if p.join("manifests").is_dir() && p.join("blobs").is_dir() && !candidates.contains(&p)
            {
                candidates.push(p);
            }
        }
    }
    let default =
        PathBuf::from(std::env::var("USERPROFILE").unwrap_or_default()).join(".ollama/models");
    if default.join("manifests").is_dir() && !candidates.contains(&default) {
        candidates.push(default);
    }
    Ok(
        json!({"installed":exe.is_some(),"executable":exe,"running":normal.is_some()||own.is_some(),"standardRunning":normal.is_some(),"ready":own.is_some(),"version":own.or(normal),"library":root,"libraryExists":root.is_dir(),"candidates":candidates,"installDefault":std::env::var("LOCALAPPDATA").ok().map(|p|PathBuf::from(p).join("Programs/Ollama")),"librarySource":if cfg.library.is_some(){"Soma preference"}else if user_env("OLLAMA_MODELS").is_some(){"OLLAMA_MODELS configuration"}else{"Ollama default"},"busy":rt.busy.load(Ordering::SeqCst)}),
    )
}
#[tauri::command]
pub async fn launch(app: tauri::AppHandle, rt: State<'_, Runtime>) -> Result<Value, String> {
    let _busy = lock_job(&rt)?;
    if owned(&rt) && version(BASE).await.is_some() {
        return status(app, rt.clone()).await;
    }
    if version(BASE).await.is_some() {
        return Err("Port 11435 is occupied by another server. Close that server or restart Soma; no existing process was stopped.".into());
    }
    rt.stop();
    let cfg = settings(&app);
    let exe = executable(&cfg).ok_or("Ollama was not found. Install it or locate ollama.exe.")?;
    let root = library(&cfg);
    writable(&root).map_err(|e|format!("The model library {} is unavailable or not writable. Open Installation & storage to choose an available drive. {e}",root.display()))?;
    let logdir = app.path().app_log_dir().map_err(|e| e.to_string())?;
    std::fs::create_dir_all(&logdir).map_err(|e| e.to_string())?;
    let log =
        std::fs::File::create(logdir.join("ollama-session.log")).map_err(|e| e.to_string())?;
    let mut cmd = Command::new(exe);
    hidden(&mut cmd);
    cmd.arg("serve")
        .env("OLLAMA_HOST", "127.0.0.1:11435")
        .env("OLLAMA_NO_CLOUD", "1")
        .env("OLLAMA_MODELS", root)
        .env("OLLAMA_CONTEXT_LENGTH", "8192")
        .stdout(log.try_clone().map_err(|e| e.to_string())?)
        .stderr(log);
    *rt.child.lock().unwrap() = Some(
        cmd.spawn()
            .map_err(|e| format!("Could not launch Ollama: {e}"))?,
    );
    for _ in 0..40 {
        if rt.cancel.load(Ordering::SeqCst) {
            rt.stop();
            return Err("Startup cancelled. Other Ollama sessions were left running.".into());
        }
        if !owned(&rt) {
            return Err(
                "Ollama exited during startup. See ollama-session.log in Soma’s logs folder."
                    .into(),
            );
        }
        if version(BASE).await.is_some() {
            return status(app, rt.clone()).await;
        }
        tokio::time::sleep(Duration::from_millis(500)).await;
    }
    Err("Ollama is taking longer than expected. Wait a moment and choose Refresh status.".into())
}
fn writable(path: &Path) -> Result<(), String> {
    if !path.is_absolute() {
        return Err("Choose an absolute folder path.".into());
    }
    std::fs::create_dir_all(path).map_err(|e| e.to_string())?;
    let probe = path.join(format!(".soma-write-check-{}", std::process::id()));
    let f = std::fs::OpenOptions::new()
        .write(true)
        .create_new(true)
        .open(&probe)
        .map_err(|e| format!("Folder is not writable: {e}"))?;
    drop(f);
    std::fs::remove_file(probe).map_err(|e| e.to_string())
}
#[tauri::command]
pub async fn choose_folder() -> Option<String> {
    rfd::AsyncFileDialog::new()
        .pick_folder()
        .await
        .map(|p| p.path().to_string_lossy().into_owned())
}
#[tauri::command]
pub async fn choose_executable() -> Option<String> {
    rfd::AsyncFileDialog::new()
        .add_filter("Windows application", &["exe"])
        .pick_file()
        .await
        .map(|p| p.path().to_string_lossy().into_owned())
}
#[tauri::command]
pub fn save_settings(
    app: tauri::AppHandle,
    rt: State<'_, Runtime>,
    cfg: Settings,
) -> Result<(), String> {
    let _busy = lock_job(&rt)?;
    if let Some(e) = &cfg.executable {
        let p = Path::new(e);
        if !p.is_file()
            || !p
                .file_name()
                .unwrap_or_default()
                .to_string_lossy()
                .eq_ignore_ascii_case("ollama.exe")
        {
            return Err("Select the installed ollama.exe application.".into());
        }
    }
    if let Some(p) = &cfg.library {
        writable(Path::new(p))?;
    }
    persist(&app, &cfg)?;
    rt.stop();
    Ok(())
}
#[tauri::command]
pub async fn hardware() -> Result<Value, String> {
    tauri::async_runtime::spawn_blocking(|| {
    let sys=sysinfo::System::new_all();
    let gpu=output("nvidia-smi", &["--query-gpu=name,memory.total,memory.free", "--format=csv,noheader,nounits"]).unwrap_or_default();
    let gpus:Vec<Value>=gpu.lines().filter_map(|l| {let p:Vec<_>=l.split(',').map(str::trim).collect(); if p.len()!=3{return None;} Some(json!({"name":p[0],"totalMiB":p[1].parse::<u64>().ok(),"freeMiB":p[2].parse::<u64>().ok(),"measured":true}))}).collect();
    let other=if gpus.is_empty(){output("powershell.exe", &["-NoProfile","-NonInteractive","-Command","Get-CimInstance Win32_VideoController | Select-Object -ExpandProperty Name"])}else{None};
    let disks=sysinfo::Disks::new_with_refreshed_list();
    json!({"ramBytes":sys.total_memory(),"availableRamBytes":sys.available_memory(),"cpu":sys.cpus().first().map(|c|c.brand()),"gpus":gpus,"otherGpuNames":other,"disks":disks.iter().map(|d|json!({"mount":d.mount_point(),"freeBytes":d.available_space()})).collect::<Vec<_>>()})
}).await.map_err(|e|e.to_string())
}
fn valid_model(model: &str) -> Result<(), String> {
    if model.is_empty()
        || model.len() > 180
        || !model
            .chars()
            .all(|c| c.is_ascii_alphanumeric() || "-._/:".contains(c))
        || model.to_lowercase().contains("cloud")
    {
        return Err("Choose a local model tag (cloud models are disabled).".into());
    }
    Ok(())
}
async fn response_json(r: reqwest::Response) -> Result<Value, String> {
    let status = r.status();
    let v = r.json::<Value>().await.map_err(|e| e.to_string())?;
    if !status.is_success() || v.get("error").is_some() {
        return Err(v["error"]
            .as_str()
            .unwrap_or("Ollama request failed")
            .to_string());
    }
    Ok(v)
}
#[tauri::command]
pub async fn models(rt: State<'_, Runtime>) -> Result<Value, String> {
    require_server(&rt).await?;
    response_json(
        client(10)?
            .get(format!("{BASE}/api/tags"))
            .send()
            .await
            .map_err(|e| e.to_string())?,
    )
    .await
}
#[tauri::command]
pub fn cancel_job(rt: State<'_, Runtime>) {
    rt.cancel.store(true, Ordering::SeqCst);
}
#[tauri::command]
pub async fn pull_model(
    app: tauri::AppHandle,
    rt: State<'_, Runtime>,
    model: String,
) -> Result<(), String> {
    valid_model(&model)?;
    require_server(&rt).await?;
    let _busy = lock_job(&rt)?;
    let request = client(7200)?
        .post(format!("{BASE}/api/pull"))
        .json(&json!({"model":model,"stream":true}))
        .send();
    tokio::pin!(request);
    let res = loop {
        if rt.cancel.load(Ordering::SeqCst) {
            return Err("Download cancelled.".into());
        }
        tokio::select! {
            result=&mut request=>break result.map_err(|e|e.to_string())?.error_for_status().map_err(|e|e.to_string())?,
            _=tokio::time::sleep(Duration::from_millis(150))=>{}
        }
    };
    let mut stream = res.bytes_stream();
    let mut buf = Vec::new();
    let mut success = false;
    loop {
        if rt.cancel.load(Ordering::SeqCst) {
            return Err("Download cancelled. Existing models were preserved; retry to continue downloading.".into());
        }
        let next = tokio::select! {n=stream.next()=>n,_=tokio::time::sleep(Duration::from_millis(200))=>{continue;}};
        match next {
            None => break,
            Some(Err(e)) => return Err(e.to_string()),
            Some(Ok(bytes)) => buf.extend(bytes),
        }
        while let Some(i) = buf.iter().position(|b| *b == b'\n') {
            let line: Vec<_> = buf.drain(..=i).collect();
            if let Ok(v) = serde_json::from_slice::<Value>(&line) {
                if let Some(e) = v["error"].as_str() {
                    return Err(e.into());
                }
                success |= v["status"] == "success";
                let _ = app.emit("model-progress", v);
            }
        }
        if buf.len() > 1024 * 1024 {
            return Err("Unexpected download response.".into());
        }
    }
    if success {
        Ok(())
    } else {
        Err("Download ended before Ollama confirmed completion. Refresh or retry.".into())
    }
}
#[tauri::command]
pub async fn chat(
    rt: State<'_, Runtime>,
    model: String,
    messages: Vec<Value>,
    format: Option<Value>,
) -> Result<Value, String> {
    valid_model(&model)?;
    require_server(&rt).await?;
    let _busy = lock_job(&rt)?;
    if messages.len() > 30 || serde_json::to_vec(&messages).unwrap().len() > 120000 {
        return Err("Conversation is too large. Start a new conversation.".into());
    }
    for m in &messages {
        if !matches!(m["role"].as_str(), Some("system" | "user" | "assistant"))
            || !m["content"].is_string()
        {
            return Err("Invalid message.".into());
        }
    }
    let c = client(600)?;
    let info = response_json(
        c.post(format!("{BASE}/api/show"))
            .json(&json!({"model":model}))
            .send()
            .await
            .map_err(|e| e.to_string())?,
    )
    .await?;
    if info.get("remote_model").is_some() || info.get("remote_host").is_some() {
        return Err("Remote models cannot be used in local-only mode.".into());
    }
    let mut body = json!({"model":model,"messages":messages,"stream":false,"think":false,"keep_alive":"5m","options":{"num_ctx":8192,"num_predict":4096,"temperature":0.25}});
    if let Some(f) = format {
        body["format"] = f;
    }
    if !info["capabilities"]
        .as_array()
        .map(|a| a.iter().any(|v| v == "thinking"))
        .unwrap_or(false)
    {
        body.as_object_mut().unwrap().remove("think");
    }
    let request = async {
        response_json(
            c.post(format!("{BASE}/api/chat"))
                .json(&body)
                .send()
                .await
                .map_err(|e| e.to_string())?,
        )
        .await
    };
    tokio::pin!(request);
    loop {
        if rt.cancel.load(Ordering::SeqCst) {
            return Err("Request cancelled.".into());
        }
        tokio::select! {r=&mut request=>return r,_=tokio::time::sleep(Duration::from_millis(150))=>{}}
    }
}
#[tauri::command]
pub fn open_official(kind: String) -> Result<(), String> {
    let url = match kind.as_str() {
        "ollama" => "https://ollama.com/download/windows",
        "releases" => {
            "https://github.com/RorriMaesu/Anatomy-Studio-Organs-Cavities-Membranes/releases"
        }
        _ => return Err("Unknown link".into()),
    };
    let mut c = Command::new("explorer.exe");
    hidden(&mut c);
    c.arg(url).spawn().map_err(|e| e.to_string())?;
    Ok(())
}
fn install_space(path: &Path, bytes: u64) -> Result<(), String> {
    let disks = sysinfo::Disks::new_with_refreshed_list();
    let free = disks
        .iter()
        .filter(|d| {
            path.to_string_lossy()
                .to_lowercase()
                .starts_with(&d.mount_point().to_string_lossy().to_lowercase())
        })
        .max_by_key(|d| d.mount_point().as_os_str().len())
        .map(|d| d.available_space());
    if free.is_some_and(|f| f < bytes) {
        return Err(
            "Not enough disk space. Choose another installation drive or free space and retry."
                .into(),
        );
    }
    Ok(())
}
fn approved_link(url: &str) -> bool {
    let Ok(u) = reqwest::Url::parse(url) else {
        return false;
    };
    if u.scheme() != "https"
        || !u.username().is_empty()
        || u.password().is_some()
        || u.port().is_some()
    {
        return false;
    }
    match u.host_str() {
        Some("openstax.org") => u
            .path()
            .starts_with("/books/anatomy-and-physiology-2e/pages/"),
        Some("ollama.com") => u.path().starts_with("/library/") || u.path() == "/download/windows",
        Some("github.com") => u
            .path()
            .starts_with("/RorriMaesu/Anatomy-Studio-Organs-Cavities-Membranes/releases"),
        _ => false,
    }
}
#[tauri::command]
pub async fn check_update(app: tauri::AppHandle) -> Result<Value, String> {
    use tauri_plugin_updater::UpdaterExt;
    let update = app
        .updater_builder()
        .timeout(Duration::from_secs(20))
        .build()
        .map_err(|e| e.to_string())?
        .check()
        .await
        .map_err(|e| {
            format!(
                "Could not check for updates. Check your internet connection and try again. {e}"
            )
        })?;
    Ok(match update {
        Some(u) => json!({"available":true,"version":u.version}),
        None => json!({"available":false,"version":app.package_info().version.to_string()}),
    })
}
#[tauri::command]
pub async fn apply_update(
    app: tauri::AppHandle,
    rt: State<'_, Runtime>,
    version: String,
) -> Result<(), String> {
    use tauri_plugin_updater::UpdaterExt;
    let _busy = lock_job(&rt)?;
    let cleanup_app = app.clone();
    let updater = app
        .updater_builder()
        .timeout(Duration::from_secs(20))
        .on_before_exit(move || {
            cleanup_app.state::<Runtime>().stop();
        })
        .build()
        .map_err(|e| e.to_string())?;
    let mut update = updater
        .check()
        .await
        .map_err(|e| e.to_string())?
        .ok_or("Soma is already up to date.")?;
    if update.version != version {
        return Err("The available update changed. Check again before installing.".into());
    }
    update.timeout = Some(Duration::from_secs(600));
    let mut completed = 0u64;
    let download=update.download(|chunk,total|{completed+=chunk as u64;let _=app.emit("setup-progress",json!({"status":"Downloading a verified Soma update…","completed":completed,"total":total}));},||{});
    tokio::pin!(download);
    let bytes = loop {
        if rt.cancel.load(Ordering::SeqCst) {
            return Err("Update download cancelled. Your current app is unchanged.".into());
        }
        tokio::select! {r=&mut download=>break r.map_err(|e|e.to_string())?,_=tokio::time::sleep(Duration::from_millis(150))=>{}}
    };
    if rt.cancel.load(Ordering::SeqCst) {
        return Err("Update cancelled before installation.".into());
    }
    rt.stop();
    update.install(bytes).map_err(|e| e.to_string())?;
    Ok(())
}
#[tauri::command]
pub async fn open_studio(app: tauri::AppHandle, section: String) -> Result<(), String> {
    let path = match section.as_str() {
        "chapter3" => "chapter3/index.html",
        "atlas" => "index.html",
        _ => return Err("Unknown studio".into()),
    };
    let label = format!("study-{section}");
    if let Some(window) = app.get_webview_window(&label) {
        window.set_focus().map_err(|e| e.to_string())?;
        return Ok(());
    }
    tauri::WebviewWindowBuilder::new(&app, label, tauri::WebviewUrl::App(path.into()))
        .title("Soma · Study studio")
        .inner_size(1280.0, 840.0)
        .build()
        .map_err(|e| e.to_string())?;
    Ok(())
}
#[tauri::command]
pub fn open_link(url: String) -> Result<(), String> {
    if !approved_link(&url) {
        return Err("This link is outside the supported textbook and download sites.".into());
    }
    let mut cmd = Command::new("explorer.exe");
    hidden(&mut cmd)
        .arg(url)
        .spawn()
        .map_err(|e| e.to_string())?;
    Ok(())
}
#[tauri::command]
pub async fn install_ollama(
    app: tauri::AppHandle,
    rt: State<'_, Runtime>,
    destination: Option<String>,
) -> Result<(), String> {
    use std::io::Write;
    let _busy = lock_job(&rt)?;
    if executable(&settings(&app)).is_some() {
        return Ok(());
    }
    {
        let mut installer = rt.installer.lock().unwrap();
        if let Some(child) = installer.as_mut() {
            if child.try_wait().map_err(|e| e.to_string())?.is_none() {
                return Err("The Ollama installer is already open. Finish or close that installer, then choose Check again.".into());
            }
        }
        *installer = None;
    }
    let target = destination.map(PathBuf::from).unwrap_or_else(|| {
        PathBuf::from(std::env::var("LOCALAPPDATA").unwrap_or_default()).join("Programs/Ollama")
    });
    if !target.is_absolute() {
        return Err("Choose an absolute installation folder.".into());
    }
    writable(&target)?;
    install_space(&target, 4 * 1024 * 1024 * 1024)?;
    let cache = app
        .path()
        .app_cache_dir()
        .map_err(|e| e.to_string())?
        .join("installers");
    writable(&cache)?;
    let path = cache.join(format!(
        "OllamaSetup-{}-{}.exe",
        std::process::id(),
        std::time::SystemTime::now()
            .duration_since(std::time::UNIX_EPOCH)
            .unwrap_or_default()
            .as_millis()
    ));
    struct DownloadFile(PathBuf);
    impl Drop for DownloadFile {
        fn drop(&mut self) {
            let _ = std::fs::remove_file(&self.0);
        }
    }
    let _cleanup = DownloadFile(path.clone());
    let c = reqwest::Client::builder()
        .connect_timeout(Duration::from_secs(20))
        .timeout(Duration::from_secs(7200))
        .https_only(true)
        .build()
        .map_err(|e| e.to_string())?;
    let request = c.get("https://ollama.com/download/OllamaSetup.exe").send();
    tokio::pin!(request);
    let response = loop {
        if rt.cancel.load(Ordering::SeqCst) {
            return Err("Download cancelled.".into());
        }
        tokio::select! {r=&mut request=>break r.map_err(|e|format!("Download connection failed: {e}"))?.error_for_status().map_err(|e|e.to_string())?,_ = tokio::time::sleep(Duration::from_millis(150))=>{}}
    };
    let total = response.content_length();
    install_space(
        &cache,
        total.unwrap_or(2 * 1024 * 1024 * 1024) + 200 * 1024 * 1024,
    )?;
    let mut file = std::fs::OpenOptions::new()
        .write(true)
        .create_new(true)
        .open(&path)
        .map_err(|e| e.to_string())?;
    let mut stream = response.bytes_stream();
    let mut completed = 0u64;
    let mut last = std::time::Instant::now() - Duration::from_secs(1);
    loop {
        if rt.cancel.load(Ordering::SeqCst) {
            return Err(
                "Installer download cancelled. Retry to download a fresh verified copy.".into(),
            );
        }
        let next = tokio::select! {r=stream.next()=>r,_=tokio::time::sleep(Duration::from_millis(150))=>continue};
        match next {
            None => break,
            Some(Err(e)) => return Err(format!("Installer download interrupted: {e}")),
            Some(Ok(bytes)) => {
                completed += bytes.len() as u64;
                if completed > 8 * 1024 * 1024 * 1024 {
                    return Err("Unexpected installer download size.".into());
                }
                file.write_all(&bytes).map_err(|e| e.to_string())?;
            }
        }
        if last.elapsed() > Duration::from_millis(250) {
            let _=app.emit("setup-progress",json!({"status":"Downloading official Ollama installer…","total":total,"completed":completed}));
            last = std::time::Instant::now();
        }
    }
    file.sync_all().map_err(|e| e.to_string())?;
    drop(file);
    if total.is_some_and(|t| t != completed) || completed == 0 {
        return Err("Installer download was incomplete. Retry the download.".into());
    }
    let _ = app.emit(
        "setup-progress",
        json!({"status":"Verifying the installer’s publisher…"}),
    );
    let verify_path = path.clone();
    tauri::async_runtime::spawn_blocking(move || {
        let mut check=Command::new("powershell.exe");hidden(&mut check);
        check.env("SOMA_INSTALLER",verify_path).args(["-NoProfile","-NonInteractive","-Command",r#"$s = Get-AuthenticodeSignature -LiteralPath $env:SOMA_INSTALLER; if ($s.Status -ne 'Valid' -or $s.SignerCertificate.Subject -notmatch '(?:^|,\s*)(?:CN|O)="?Ollama(?:,? Inc\.?)?"?(?:,|$)') { exit 1 }"#]);
        if !check.status().map_err(|e|e.to_string())?.success() {return Err("Installer publisher signature could not be verified. The installer was not run.".to_string());}Ok(())
    }).await.map_err(|e|e.to_string())??;
    if rt.cancel.load(Ordering::SeqCst) {
        return Err("Installation cancelled before opening the installer.".into());
    }
    install_space(&target, 4 * 1024 * 1024 * 1024)?;
    // Remember a custom destination so setup can recover even after Soma closes.
    let mut cfg = settings(&app);
    cfg.executable = Some(target.join("ollama.exe").to_string_lossy().into_owned());
    persist(&app, &cfg)?;
    let child = Command::new(&path)
        .arg(format!("/DIR={}", target.display()))
        .spawn()
        .map_err(|e| e.to_string())?;
    *rt.installer.lock().unwrap() = Some(child);
    let _ = app.emit(
        "setup-progress",
        json!({"status":"Finish the Ollama installer. Soma will continue automatically…"}),
    );
    loop {
        if rt.cancel.load(Ordering::SeqCst) {
            return Err("Stopped waiting. The Ollama installer may still be open; finish or cancel it there, then choose Check again.".into());
        }
        let finished = {
            let mut guard = rt.installer.lock().unwrap();
            guard.as_mut().and_then(|c| c.try_wait().ok()).flatten()
        };
        if let Some(exit) = finished {
            *rt.installer.lock().unwrap() = None;
            if !exit.success() {
                return Err(
                    "Ollama installation was cancelled or did not finish. Retry when ready.".into(),
                );
            }
            break;
        }
        tokio::time::sleep(Duration::from_millis(500)).await;
    }
    // Some installers hand off to a child; allow its files to settle before checking.
    for _ in 0..60 {
        if rt.cancel.load(Ordering::SeqCst) {
            return Err("Installation check cancelled. Choose Check again when ready.".into());
        }
        if executable(&settings(&app)).is_some() {
            return Ok(());
        }
        tokio::time::sleep(Duration::from_secs(1)).await;
    }
    Err("The installer finished but Ollama was not detected. Choose Check again or locate your existing installation in Technical details.".into())
}
#[tauri::command]
pub async fn migrate_library(
    app: tauri::AppHandle,
    rt: State<'_, Runtime>,
    destination: String,
) -> Result<String, String> {
    let _busy = lock_job(&rt)?;
    if version("http://127.0.0.1:11434").await.is_some() {
        return Err("Quit the other Ollama app before copying its library, so its files cannot change during verification.".into());
    }
    rt.stop();
    let cfg = settings(&app);
    let old = library(&cfg);
    let dest = PathBuf::from(&destination);
    let cancel = rt.cancel.clone();
    let result =
        tauri::async_runtime::spawn_blocking(move || copy_library(&old, &dest, Some(&cancel)))
            .await
            .map_err(|e| e.to_string())??;
    let mut newcfg = settings(&app);
    newcfg.library = Some(destination);
    persist(&app, &newcfg)?;
    Ok(result)
}
fn copy_library(
    source: &Path,
    destination: &Path,
    cancel: Option<&AtomicBool>,
) -> Result<String, String> {
    use sha2::{Digest, Sha256};
    use std::io::{Read, Write};
    let src = source.canonicalize().map_err(|e| e.to_string())?;
    writable(destination)?;
    let dst = destination.canonicalize().map_err(|e| e.to_string())?;
    if src == dst || dst.starts_with(&src) || src.starts_with(&dst) {
        return Err("Choose a separate folder outside the existing library.".into());
    }
    if std::fs::read_dir(&dst)
        .map_err(|e| e.to_string())?
        .next()
        .is_some()
    {
        return Err("Choose an empty destination. Existing files will not be overwritten.".into());
    }
    fn files(p: &Path, out: &mut Vec<PathBuf>) -> Result<(), String> {
        for entry in std::fs::read_dir(p).map_err(|e| e.to_string())? {
            let e = entry.map_err(|e| e.to_string())?;
            let t = e.file_type().map_err(|e| e.to_string())?;
            #[cfg(windows)]
            {
                use std::os::windows::fs::MetadataExt;
                if e.metadata().map_err(|e| e.to_string())?.file_attributes() & 0x400 != 0 {
                    return Err(
                        "Library contains a junction or link. Use a regular local folder.".into(),
                    );
                }
            }
            if t.is_symlink() {
                return Err("Library contains a link; use a regular local library folder.".into());
            }
            if t.is_dir() {
                files(&e.path(), out)?
            } else if t.is_file() {
                out.push(e.path())
            }
        }
        Ok(())
    }
    fn hash(p: &Path, cancel: Option<&AtomicBool>) -> Result<Vec<u8>, String> {
        let mut f = std::fs::File::open(p).map_err(|e| e.to_string())?;
        let mut h = Sha256::new();
        let mut b = [0u8; 65536];
        loop {
            if cancel.map(|c| c.load(Ordering::SeqCst)).unwrap_or(false) {
                return Err("Copy cancelled. Original files and settings are unchanged; the destination may contain a partial copy.".into());
            }
            let n = f.read(&mut b).map_err(|e| e.to_string())?;
            if n == 0 {
                break;
            }
            h.update(&b[..n]);
        }
        Ok(h.finalize().to_vec())
    }
    let mut list = Vec::new();
    files(&src, &mut list)?;
    let total: u64 = list
        .iter()
        .map(|p| p.metadata().map(|m| m.len()).unwrap_or(0))
        .sum();
    let disks = sysinfo::Disks::new_with_refreshed_list();
    let free = disks
        .iter()
        .filter(|d| {
            destination
                .to_string_lossy()
                .to_lowercase()
                .starts_with(&d.mount_point().to_string_lossy().to_lowercase())
        })
        .max_by_key(|d| d.mount_point().as_os_str().len())
        .map(|d| d.available_space());
    if let Some(f) = free {
        if f < total + 100 * 1024 * 1024 {
            return Err("Not enough free space for a verified copy.".into());
        }
    }
    for p in list {
        if cancel.map(|c| c.load(Ordering::SeqCst)).unwrap_or(false) {
            return Err("Copy cancelled. Original files and settings are unchanged. A partial copy remains in the destination; use an empty folder to retry.".into());
        }
        let target = dst.join(p.strip_prefix(&src).unwrap());
        std::fs::create_dir_all(target.parent().unwrap()).map_err(|e| e.to_string())?;
        let before = hash(&p, cancel)?;
        let mut input = std::fs::File::open(&p).map_err(|e| e.to_string())?;
        let mut out = std::fs::OpenOptions::new()
            .create_new(true)
            .write(true)
            .open(&target)
            .map_err(|e| e.to_string())?;
        let mut buffer = [0u8; 1024 * 1024];
        loop {
            if cancel.map(|c| c.load(Ordering::SeqCst)).unwrap_or(false) {
                return Err("Copy cancelled. Original files and settings are unchanged; the destination may contain a partial copy.".into());
            }
            let n = input.read(&mut buffer).map_err(|e| e.to_string())?;
            if n == 0 {
                break;
            }
            out.write_all(&buffer[..n]).map_err(|e| e.to_string())?;
        }
        out.sync_all().map_err(|e| e.to_string())?;
        drop(out);
        if hash(&target, cancel)? != before || hash(&p, cancel)? != before {
            return Err("Verification failed. The original library and setting are unchanged. Use a fresh empty folder to retry.".into());
        }
    }
    Ok(format!("Copied and hash-verified {total} bytes. Original files are preserved. Start the local session and test a model before removing any old files."))
}

#[cfg(test)]
mod tests {
    use super::*;
    #[test]
    fn rejects_remote_and_shell_model_names() {
        for s in ["", "x;whoami", "a cloud", "qwen:cloud", "../x?x"] {
            assert!(valid_model(s).is_err());
        }
        assert!(valid_model("qwen3.5:9b-q4_K_M").is_ok());
    }
    #[test]
    fn textbook_links_are_constrained_to_known_https_sources() {
        assert!(approved_link(
            "https://openstax.org/books/anatomy-and-physiology-2e/pages/3-1-the-cell-membrane"
        ));
        for url in [
            "http://openstax.org/books/anatomy-and-physiology-2e/pages/a",
            "https://openstax.org.evil.com/books/anatomy-and-physiology-2e/pages/a",
            "https://user@openstax.org/books/anatomy-and-physiology-2e/pages/a",
            "file:///C:/Windows",
            "https://example.com/",
        ] {
            assert!(!approved_link(url));
        }
    }
    #[test]
    fn migration_rejects_nested_and_preserves_source() {
        let root = std::env::temp_dir().join(format!("soma-test-{}", std::process::id()));
        let src = root.join("src");
        std::fs::create_dir_all(&src).unwrap();
        std::fs::write(src.join("blob"), "test").unwrap();
        assert!(copy_library(&src, &src.join("nested"), None).is_err());
        std::fs::remove_dir(src.join("nested")).unwrap();
        let dst = root.join("dst");
        assert!(copy_library(&src, &dst, None).is_ok());
        assert_eq!(
            std::fs::read(src.join("blob")).unwrap(),
            std::fs::read(dst.join("blob")).unwrap()
        );
        assert!(copy_library(&src, &dst, None).is_err());
        std::fs::remove_dir_all(root).unwrap();
    }
}
