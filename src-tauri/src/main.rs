#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod service;
fn main() {
    tauri::Builder::default()
        .manage(service::Runtime::default())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .invoke_handler(tauri::generate_handler![
            service::status,
            service::launch,
            service::hardware,
            service::choose_folder,
            service::choose_executable,
            service::save_settings,
            service::models,
            service::pull_model,
            service::cancel_job,
            service::chat,
            service::open_official,
            service::open_link,
            service::open_studio,
            service::check_update,
            service::apply_update,
            service::install_ollama,
            service::migrate_library
        ])
        .build(tauri::generate_context!())
        .expect("Unable to start Soma Desktop")
        .run(|app, event| {
            if let tauri::RunEvent::Exit = event {
                use tauri::Manager;
                app.state::<service::Runtime>().stop();
            }
        });
}
