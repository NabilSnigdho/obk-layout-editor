use base91::codemap::XmlFriendly;
use base91::iter::EncodeGenericIterator;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn convert_svg(handle: tauri::AppHandle, svg: &str) -> Result<String, String> {
    let mut fontdb = usvg::fontdb::Database::new();
    let font_path = handle
        .path_resolver()
        .resolve_resource("../public/fonts/kalpurush.ttf")
        .expect("error while importing font");
    fontdb.load_font_file(&font_path).unwrap();
    let opt = usvg::Options {
        fontdb,
        ..usvg::Options::default()
    };
    let rtree = match usvg::Tree::from_str(&svg, &opt.to_ref()) {
        Ok(rtree) => rtree,
        Err(_) => return Err("error while parsing svg".into()),
    };

    let pixmap_size = rtree.svg_node().size.to_screen_size();
    let mut pixmap = tiny_skia::Pixmap::new(pixmap_size.width(), pixmap_size.height()).unwrap();
    resvg::render(
        &rtree,
        usvg::FitTo::Original,
        tiny_skia::Transform::default(),
        pixmap.as_mut(),
    )
    .unwrap();

    let img = pixmap.encode_png().unwrap();
    let img = zstd::bulk::compress(&img, 20).unwrap();
    let img: Vec<u8> = EncodeGenericIterator::<XmlFriendly, _>::new(img.iter().copied()).collect();

    // pixmap.save_png("../public/output.png").unwrap();
    Ok(String::from_utf8(img).unwrap())
}

pub fn get_handlers() -> Box<dyn Fn(tauri::Invoke<tauri::Wry>) + Send + Sync> {
    Box::new(tauri::generate_handler![convert_svg])
}
