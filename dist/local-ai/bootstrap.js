// Installed desktop clients keep their native setup; the website uses direct Ollama.
if(window.__TAURI__?.core?.invoke)await import('./app.js');
else await import('./browser-app.js');
