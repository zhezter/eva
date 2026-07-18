#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;
use tauri::Emitter;

#[tauri::command]
fn set_mini_mode(app: tauri::AppHandle, mini: bool) -> Result<(), String> {
    let window = app.get_webview_window("main").ok_or("main window not found")?;

    if mini {
        window.set_decorations(false).map_err(|e| e.to_string())?;
        window.set_always_on_top(true).map_err(|e| e.to_string())?;
        window.set_size(tauri::LogicalSize::new(280.0, 40.0)).map_err(|e| e.to_string())?;
        window.set_resizable(false).map_err(|e| e.to_string())?;
    } else {
        window.set_decorations(true).map_err(|e| e.to_string())?;
        window.set_always_on_top(false).map_err(|e| e.to_string())?;
        window.set_size(tauri::LogicalSize::new(900.0, 700.0)).map_err(|e| e.to_string())?;
        window.set_resizable(true).map_err(|e| e.to_string())?;
        window.center().map_err(|e| e.to_string())?;
    }

    app.emit("mini-mode-changed", mini).map_err(|e| e.to_string())?;
    Ok(())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![set_mini_mode])
        .run(tauri::generate_context!())
        .expect("error al iniciar la aplicación");
}
