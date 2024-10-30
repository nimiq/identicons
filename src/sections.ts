import type { Section, Sections } from './types'

export const identiconFeatures: Record<string, string> = {
  ...import.meta.glob('/src/svgs/bottom/*.svg', { eager: true, query: '?raw', import: 'default' }),
  ...import.meta.glob('/src/svgs/top/*.svg', { eager: true, query: '?raw', import: 'default' }),
  ...import.meta.glob('/src/svgs/face/*.svg', { eager: true, query: '?raw', import: 'default' }),
  ...import.meta.glob('/src/svgs/sides/*.svg', { eager: true, query: '?raw', import: 'default' }),
}

export function sectionToSvg(section: Section, index: number): string {
  const numIndex = (Number(index) % 21) + 1
  const assetIndex = numIndex < 10 ? `0${numIndex}` : `${numIndex}`
  const selector = `${section}_${assetIndex}`
  const svgFile = `/src/svgs/${section}/${selector}.svg`
  const svg = identiconFeatures[svgFile]
  if (!svg)
    throw new Error(`SVG file not found for ${section} with index ${index}/${index}. Path ${svgFile}`)
  return svg
}

export async function sectionsToSvg(sectionsIndexes: Record<Section, number>): Promise<Sections> {
  const [bottom, face, sides, top] = await Promise.all(
    (['bottom', 'face', 'sides', 'top'] as Section[]).map(s => sectionToSvg(s, sectionsIndexes[s])),
  )
  return { bottom, top, sides, face }
}
