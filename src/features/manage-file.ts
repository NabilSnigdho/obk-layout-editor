import Avro_Easy from '@/assets/layouts/Avro_Easy.json'
import Borno from '@/assets/layouts/Borno.json'
import Munir_Optima from '@/assets/layouts/Munir_Optima.json'
import National_Jatiya from '@/assets/layouts/National_Jatiya.json'
import Probhat from '@/assets/layouts/Probhat.json'
import { initialLayout } from '@/layout'
import { draw } from '@/main'
import { convert_svg } from '@/rust-functions'
import { mainStore } from '@/store'
import { message, open, save } from '@tauri-apps/api/dialog'
import { listen } from '@tauri-apps/api/event'
import { readTextFile, writeTextFile } from '@tauri-apps/api/fs'
import { dataDir, join } from '@tauri-apps/api/path'
import Alpine from 'alpinejs'
import hotkeys from 'hotkeys-js'
import stringify from 'json-stable-stringify'
import { drawLayout } from './preview-layout'

const exampleLayouts = {
  Avro_Easy,
  Borno,
  Munir_Optima,
  National_Jatiya,
  Probhat,
}

export const saveJSONFile = async ({
  content: storeContent,
  previewMode,
}: typeof mainStore) => {
  const filePath = await save({
    title: 'Save JSON file',
    defaultPath: await join(
      await dataDir(),
      'openbangla-keyboard',
      'layouts',
      `${storeContent.info.layout.name || 'Untitled'}.json`
    ),
    filters: [
      {
        name: 'OpenBangla Keyboard Layout',
        extensions: ['json'],
      },
    ],
  })
  if (filePath) {
    if (!filePath.endsWith('.json')) {
      await message('Filename must end with .json', {
        title: 'Save JSON file',
        type: 'error',
      })
      saveJSONFile(Alpine.store('main') as typeof mainStore)
      return
    }

    const content = structuredClone(
      Alpine.raw(storeContent)
    ) as typeof storeContent

    draw.removeClass('interactive-mode')
    drawLayout(draw, content.layout, 'Normal')
    content.info.layout.image0 = await convert_svg(draw.svg(true))
    drawLayout(draw, content.layout, 'AltGr')
    content.info.layout.image1 = await convert_svg(draw.svg(true))
    draw.addClass('interactive-mode')
    drawLayout(draw, content.layout, previewMode)

    await writeTextFile(filePath, stringify(content, { space: '  ' }))
  }
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
          defaultPath: await join(
            await dataDir(),
            'openbangla-keyboard',
            'layouts'
          ),
          filters: [
            {
              name: 'OpenBangla Keyboard Layout',
              extensions: ['json'],
            },
          ],
        })
        if (typeof selected === 'string') {
          store.content = JSON.parse(await readTextFile(selected))
        }
        break
      case 'save-as':
        saveJSONFile(store)
    }
  })
  hotkeys('ctrl+s', function (event) {
    event.preventDefault()
    saveJSONFile(store)
  })
}
