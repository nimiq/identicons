import { presetRemToPx } from '@unocss/preset-rem-to-px'
import { presetNimiq } from 'nimiq-css'
import { defineConfig, presetAttributify, presetIcons, presetUno } from 'unocss'

export default defineConfig({
  // ...UnoCSS options
  presets: [
    presetUno(),
    presetAttributify(),
    presetNimiq({
      attributifyUtilities: true,
      utilities: true,
      staticContent: true,
    }),
    presetRemToPx({ baseFontSize: 4 }),
    presetIcons(),
  ],
})
