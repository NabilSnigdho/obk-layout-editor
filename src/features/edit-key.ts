export const editKeysUtilities = {
  // https://github.com/lodash/lodash/blob/master/.internal/baseGet.js
  getLastParent: (obj: any, path: string) => {
    const pathArray = path.split('.')

    let index = 0
    const length = pathArray.length - 1

    while (obj != null && index < length) {
      obj = obj[pathArray[index++]]
    }
    return index == length ? obj : undefined
  },

  getLastSegment: (path: string) => path.substring(path.lastIndexOf('.') + 1),

  getLabel: (path: string) => {
    const x = path.split('.').slice(1).join(' ')
    return x.charAt(0).toUpperCase() + x.substring(1)
  },

  getEditKeyVariants: (editKeys: string) => {
    const [normalKey, shiftKey] = editKeys.split(' ')
    return [
      ['Normal', `Key_${normalKey}_Normal`],
      ['Shift', `Key_${shiftKey}_Normal`],
      ['AltGr', `Key_${normalKey}_AltGr`],
      ['Shift + AltGr', `Key_${shiftKey}_AltGr`],
    ]
  },
}
