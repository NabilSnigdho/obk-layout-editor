const { invoke } = window.__TAURI__.tauri

export async function convert_svg(svg: string) {
  return invoke<string>('convert_svg', { svg })
}
