use tauri::Manager;
use tauri::{CustomMenuItem, Menu, MenuItem, Submenu, WindowMenuEvent};

pub fn init() -> Menu {
    let menu = Menu::new().add_submenu(Submenu::new(
        "File",
        Menu::new()
            .add_item(CustomMenuItem::new("new", "New blank"))
            .add_submenu(Submenu::new(
                "New from examples",
                Menu::new()
                    .add_item(CustomMenuItem::new("Avro_Easy", "Avro Easy"))
                    .add_item(CustomMenuItem::new("Borno", "Borno"))
                    .add_item(CustomMenuItem::new("Munir_Optima", "Munir Optima"))
                    .add_item(CustomMenuItem::new("National_Jatiya", "National (Jatiya)"))
                    .add_item(CustomMenuItem::new("Probhat", "Probhat")),
            ))
            .add_item(CustomMenuItem::new("open", "Open"))
            .add_native_item(MenuItem::Separator)
            .add_item(CustomMenuItem::new("save-as", "Save as..."))
            .add_native_item(MenuItem::Separator)
            .add_native_item(MenuItem::Quit),
    ));
    menu
}

#[derive(Clone, serde::Serialize)]
struct Payload {
    message: String,
}

pub fn event_handler(event: WindowMenuEvent) {
    let window = event.window(); // get the window
    window
        .emit_all("menuitem_click", event.menu_item_id())
        .unwrap();
}
