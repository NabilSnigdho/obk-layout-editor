import Avro_Easy from '@/assets/layouts/Avro_Easy.json'
import Borno from '@/assets/layouts/Borno.json'
import Munir_Optima from '@/assets/layouts/Munir_Optima.json'
import National_Jatiya from '@/assets/layouts/National_Jatiya.json'
import Probhat from '@/assets/layouts/Probhat.json'
import { initialLayout } from '@/layout'
import { draw } from '@/main'
import { convert_svg } from '@/rust-functions'
import { mainStore } from '@/store'
import { open, save } from '@tauri-apps/api/dialog'
import { listen } from '@tauri-apps/api/event'
import { readTextFile, writeTextFile } from '@tauri-apps/api/fs'
import { dataDir } from '@tauri-apps/api/path'
import Alpine from 'alpinejs'
import stringify from 'json-stable-stringify'
import { drawLayout } from './preview-layout'

const exampleLayouts = {
  Avro_Easy,
  Borno,
  Munir_Optima,
  National_Jatiya,
  Probhat,
}

export const initFileManagement = () => {
  const store = Alpine.store('main') as typeof mainStore
  listen<string>('menuitem_click', async (event) => {
    switch (event.payload) {
      case 'new':
        store.content = structuredClone(initialLayout)
        break
      case 'Avro_Easy':
      case 'Borno':
      case 'Munir_Optima':
      case 'National_Jatiya':
      case 'Probhat':
        store.content = structuredClone(exampleLayouts[event.payload])
        break
      case 'open':
        const selected = await open({
          defaultPath: (await dataDir()) + '/openbangla-keyboard/layouts',
          filters: [
            {
              name: 'OpenBangla Keyboard Layout (v2)',
              extensions: ['json'],
            },
          ],
        })
        if (typeof selected === 'string') {
          store.content = JSON.parse(await readTextFile(selected))
        }
        break
      case 'save-as':
        const filePath = await save({
          defaultPath: (await dataDir()) + '/openbangla-keyboard/layouts',
          filters: [
            {
              name: 'OpenBangla Keyboard Layout (v2)',
              extensions: ['json'],
            },
          ],
        })
        if (filePath) {
          const content = structuredClone(
            Alpine.raw(store.content)
          ) as typeof store.content
          draw.removeClass('interactive-mode')
          drawLayout(draw, content.layout, 'Normal')
          content.info.layout.image0 = await convert_svg(draw.svg(true))
          drawLayout(draw, content.layout, 'AltGr')
          content.info.layout.image1 = await convert_svg(draw.svg(true))
          draw.addClass('interactive-mode')
          await writeTextFile(filePath, stringify(content, { space: '  ' }))
        }
    }
  })
}
