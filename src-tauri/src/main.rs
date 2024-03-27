// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use rdev::{listen, EventType};
use tauri::{Manager, Runtime};
use window_vibrancy::{apply_blur, apply_vibrancy, NSVisualEffectMaterial};

#[derive(Clone, serde::Serialize)]
struct Payload {
    key: String,
}

#[tauri::command]
async fn blur_display_background<R: Runtime>(
    app: tauri::AppHandle<R>,
    window: tauri::Window<R>,
    window_label: String,
) -> Result<(), String> {
    let window = app.get_window(&window_label).unwrap();
    #[cfg(target_os = "macos")]
    apply_vibrancy(&window, NSVisualEffectMaterial::HudWindow, None, None)
        .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");

    #[cfg(target_os = "windows")]
    apply_blur(&window, Some((18, 18, 18, 125)))
        .expect("Unsupported platform! 'apply_blur' is only supported on Windows");

    Ok(())
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .invoke_handler(tauri::generate_handler![blur_display_background])
        .setup(|app| {
            // let window = app.get_window("main").unwrap();
            // window.set_title("Tauri App");

            let app_handle = app.app_handle();
            tauri::async_runtime::spawn(async {
                if let Err(error) = listen(move |event| match event.event_type {
                    EventType::KeyPress(key) => {
                        app_handle
                            .emit_all(
                                "keypress",
                                Payload {
                                    key: format!("{:?}", key),
                                },
                            )
                            .unwrap();
                    }
                    _ => (),
                }) {
                    eprintln!("Error: {:?}", error);
                }
            });
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
