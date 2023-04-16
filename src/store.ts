import { Layout, initialLayout } from '@/layout'

export const mainStore = {
  content: structuredClone(initialLayout) as Layout,
  editKeys: '',
  previewMode: 'Normal' as 'Normal' | 'AltGr',
}
