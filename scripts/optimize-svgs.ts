import { readFile, writeFile } from 'node:fs/promises'
import { cwd } from 'node:process'
import { join } from 'pathe'
import tinyglob from 'tiny-glob'
import { optimizeSvg } from '../src/optimizer'

async function optimizeSvgFile(filePath: string) {
  try {
    const data = await readFile(filePath, 'utf8')
    const svg = optimizeSvg(data)
    if (!svg)
      return
    await writeFile(filePath, svg, 'utf8')
    console.log(`Optimized: ${filePath}`)
  }
  catch (error) {
    console.error(`Error processing ${filePath}:`, error)
  }
}

async function processFiles() {
  const files = await tinyglob('src/svgs/*/*.svg')
  return Promise.all(files.map(file => optimizeSvgFile(join(cwd(), file))))
}

processFiles().then(() => console.log('SVG optimization complete'))
