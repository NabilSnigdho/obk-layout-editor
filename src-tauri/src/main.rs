#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

mod commands;
mod menu;

fn main() {
    tauri::Builder::default()
        .menu(menu::init())
        .on_menu_event(menu::event_handler)
        .invoke_handler(commands::get_handlers())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
