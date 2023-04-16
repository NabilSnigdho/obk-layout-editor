import { initialLayout, isValidKey } from '@/layout'
import type { mainStore } from '@/store'
import { SVG, Svg, Text } from '@svgdotjs/svg.js'
import Alpine from 'alpinejs'

export const initDraw = (layoutSvg: string) => {
  const SVGContainer = document.querySelector('div#kb-layout')!
  SVGContainer.innerHTML = layoutSvg

  const draw = SVG(SVGContainer.querySelector<SVGSVGElement>('svg')!)
  const store = Alpine.store('main') as typeof mainStore

  draw
    .find('#editable-keys rect')
    .forEach((key) =>
      key.click(
        () =>
          (store.editKeys =
            store.editKeys !== key.data('keys') ? key.data('keys') : '')
      )
    )
  draw
    .find('rect#alt-gr-key')
    .forEach((key) =>
      key.click(
        () =>
          (store.previewMode =
            store.previewMode === 'Normal' ? 'AltGr' : 'Normal')
      )
    )

  return draw
}

const joiners = new Map([
    ['\u{200D}', 'J'],
    ['\u{200C}', 'NJ'],
  ]),
  twoPartKars = new Set(['\u{09CB}', '\u{09CC}'])

export const drawLayout = (
  draw: Svg,
  layout: typeof initialLayout.layout,
  mode: 'Normal' | 'AltGr' = 'Normal'
) =>
  draw[mode === 'AltGr' ? 'addClass' : 'removeClass']('alt-gr-mode')
    .find('#key-labels text')
    .forEach((label) => {
      if (!(label instanceof Text)) return
      const key = `Key_${label.data('key')}_${mode}`
      if (!isValidKey(key)) return
      const ch = layout[key]
      if (joiners.has(ch)) label.tspan(joiners.get(ch)!).addClass('joiner')
      else if (twoPartKars.has(ch)) label.tspan(ch).dx(-2)
      else label.plain(ch === initialLayout.layout[key] ? '' : ch)
    })

export const drawActiveKeys = (draw: Svg, keys: string) =>
  draw
    .find('#editable-keys rect')
    .forEach((key) =>
      key[key.data('keys') === keys ? 'addClass' : 'removeClass']('active')
    )
