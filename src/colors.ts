import type { Colors, ColorType } from './types'

export const colors = [
  '#FC8702',
  '#D94432',
  '#E9B213',
  '#1A5493',
  '#0582CA',
  '#5961A8',
  '#21BCA5',
  '#FA7268',
  '#88B04B',
  '#795548',
] as const

export const backgroundColors = [
  '#FC8702',
  '#D94432',
  '#E9B213',
  '#1F2348',
  '#0582CA',
  '#5F4B8B',
  '#21BCA5',
  '#FA7268',
  '#88B04B',
  '#795548',
] as const

export function colorsToRgb({ main, background, accent }: Record<ColorType, number>): Colors {
  const adjustIndex = (index: number): number => ((index + 1) % 10) as number

  if (main === background)
    main = adjustIndex(main)
  while (accent === main || accent === background) accent = adjustIndex(accent)

  return {
    main: colors[main],
    background: backgroundColors[background],
    accent: colors[accent],
  }
}
