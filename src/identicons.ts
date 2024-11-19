import type { IdenticonFormat, IdenticonParams } from './types'
import { colorsToRgb } from './colors'
import { makeHash } from './hash'
import { sectionsToSvg } from './sections'

/**
 * Generates the parameters needed to create an identicon
 * @param input - The string to generate the identicon parameters from
 * @returns Promise containing the sections and colors for the identicon
 */
export async function getIdenticonsParams(input: string): Promise<IdenticonParams> {
  const hash = makeHash(input)
  const main = Number(hash[0])
  const background = Number(hash[2])
  const accent = Number(hash[11])
  const face = Number(hash[3] + hash[4])
  const top = Number(hash[5] + hash[6])
  const sides = Number(hash[7] + hash[8])
  const bottom = Number(hash[9] + hash[10])

  const sections = await sectionsToSvg({ face, top, sides, bottom })
  const colors = colorsToRgb({ accent, background, main })

  return { sections, colors }
}

/**
 * Assembles an SVG string from the provided identicon parameters
 * @param params - Object containing colors and sections for the identicon
 * @param params.colors - RGB colors for accent, background, and main elements
 * @param params.sections - SVG path strings for bottom, face, sides, and top elements
 * @returns Complete SVG string of the assembled identicon
 */
export function ensambleSvg({ colors: { accent, background, main }, sections: { bottom, face, sides, top }, innerShadow, backgroundShape, circleShape }: IdenticonParams): string {
  innerShadow ||= '<path fill="#010101" d="M119.21 80a39.46 39.46 0 0 1-67.13 28.13c10.36 2.33 36 3 49.82-14.28 10.39-12.47 8.31-33.23 4.16-43.26A39.35 39.35 0 0 1 119.21 80" opacity=".1"/>'
  backgroundShape ||= `<path d="m125.8 16.67 31.765 55.015a15.99 15.99 0 0 1 0 16L125.8 142.7c-2.85 4.95-8.135 8-13.85 8H48.415c-5.715 0-11-3.05-13.85-8L2.8 87.685a16.04 16.04 0 0 1 0-16L34.57 16.67a16 16 0 0 1 13.85-8h63.53c5.715 0 11 3.05 13.85 8"/>`
  circleShape ||= `<circle cx="80" cy="80" r="40" fill="${main}"/>`
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160"><defs><clipPath id="a">${backgroundShape}</clipPath></defs><g fill="${accent}" clip-path="url(#a)" color="${main}"><path fill="${background}" d="M0 0h160v160H0z"/>${circleShape}${innerShadow}${top}${sides}${face}${bottom}</g></svg>`
}

/**
 * Formats the SVG string into the requested output format
 * @param svg - The SVG string to format
 * @param options - Object containing format and size options
 * @param options.format - The desired output format. See {@link IdenticonFormat}
 * @returns Promise containing the formatted identicon string
 */
export async function formatIdenticon(svg: string, { format }: Required<CreateIdenticonOptions>): Promise<string> {
  switch (format) {
    case 'image/svg+xml': {
      const base64String = typeof window !== 'undefined'
        ? btoa(svg)
        : (await import('node:buffer')).Buffer.from(svg).toString('base64')

      return `data:image/svg+xml;base64,${base64String}`
    }
    case 'svg':
    default:
      return svg
  }
}

interface CreateIdenticonOptions {
  /**
   * The format of the encoded image
   * @default 'svg'
   */
  format?: IdenticonFormat
}

/**
 * Generate an identicon from a string
 *
 * @param input The string to generate the identicon from
 * @param options The options for the identicon
 * @returns The identicon as a string
 */
export async function createIdenticon(input: string, options: CreateIdenticonOptions = {}): Promise<string> {
  const { format = 'svg' } = options
  const params = await getIdenticonsParams(input)
  const svg = ensambleSvg(params)
  const formatted = await formatIdenticon(svg, { format })
  return formatted
}

export const identiconPlaceholder = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none" viewBox="0 -4 64 64"><path fill="url(#a)" d="M62.3 25.4 49.2 2.6A5.3 5.3 0 0 0 44.6 0H18.4c-1.9 0-3.6 1-4.6 2.6L.7 25.4c-1 1.6-1 3.6 0 5.2l13.1 22.8c1 1.6 2.7 2.6 4.6 2.6h26.2c1.9 0 3.6-1 4.6-2.6l13-22.8c1-1.6 1-3.6.1-5.2z" opacity=".1"/><defs><radialGradient id="a" cx="0" cy="0" r="1" gradientTransform="matrix(-63.0033 0 0 -56 63 56)" gradientUnits="userSpaceOnUse"><stop stop-color="#260133"/><stop offset="1" stop-color="#1F2348"/></radialGradient></defs></svg>`
