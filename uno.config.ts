import { defineConfig, presetUno } from 'unocss'

export default defineConfig({
  extendTheme: (theme) => {
    if (theme.fontFamily?.serif) {
      theme.fontFamily.serif = 'Kalpurush, ' + theme.fontFamily.serif
    }
    return theme
  },
  shortcuts: {
    'text-input':
      'border-1 block w-full appearance-none border-gray-300 bg-transparent px-2.5 pb-2.5 pt-4 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500',
    'floating-label':
      'absolute left-1 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-white px-2 text-sm text-gray-500 duration-300 peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:px-2 peer-focus:text-blue-600 dark:bg-gray-900 dark:text-gray-400 peer-focus:dark:text-blue-500 pointer-events-none',
  },
  presets: [presetUno()],
  preflights: [
    {
      getCSS: () => `
        [x-cloak] {
          display: none !important;
        }
        .last-2-child-col-span-full > div:nth-last-child(-n + 2) {
          grid-column: 1/-1;
        }
      `,
    },
  ],
})
