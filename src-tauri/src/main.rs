// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use rdev::{listen, EventType};
use tauri::Manager;

#[derive(Clone, serde::Serialize)]
struct Payload {
    key: String,
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
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
