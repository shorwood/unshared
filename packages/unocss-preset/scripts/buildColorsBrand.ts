import { dirname } from 'node:path'
import { mkdir, writeFile } from 'node:fs/promises'
import { mapValues } from '@unshared/collection/mapValues'

const OUT_PATH = new URL('../constants/colorsBrand.ts', import.meta.url).pathname
const OUT_DIR = dirname(OUT_PATH)

async function main() {
  const response = await fetch('https://raw.githubusercontent.com/mahmutoz/brand-colors/master/src/brands.json')
  const brands = await response.json() as Record<string, { colors: string[]; slug: string }>

  // --- Map colors to a list of entries.
  const contentEntries = Object.values(brands)
    .filter(brand => brand.colors.length > 0)
    .map((brand) => {
      const slug = brand.slug
      const colors = brand.colors

      // --- If there is only one color, return a single color.
      if (colors.length === 1) return [slug, `#${colors[0]}`]

      // --- Otherwise, return a color palette mapped by index.
      return [slug, mapValues(colors, color => `#${color}`)]
    })

  // --- Write to file.
  const contentObject = Object.fromEntries(contentEntries) as Record<string, Record<string, string> | string>
  const contentJSON = JSON.stringify(contentObject, undefined, 2)
  const content = `export const colorsBrand = ${contentJSON}\n`
  await mkdir(OUT_DIR, { recursive: true })
  await writeFile(OUT_PATH, content)
}

await main()
