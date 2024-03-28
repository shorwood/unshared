import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { capitalize } from '../../../packages/shared'
import metadata from './metadata.json'

const generateItemLines = (name: string, items: any) => {
  const lines = items.map(x => `- [${x.name}](${x.sourceFile}) - ${x.description?.split('\n').shift() ?? 'N/A'}`)
  return `## ${capitalize(name)}\n${lines.join('\n')}`
}

const generatePage = (documentation: typeof metadata[number]) => {
  let sections: any

  // --- If submodules are present.
  if (documentation.length > 1) {
    sections = documentation
      .map(x => generateItemLines(x.module, [...x.functions, ...x.constants]))
      .sort()
  }

  // --- If not, split by aknowledged type.
  else {
    const functions = [
      ...documentation.flatMap(x => x.functions),
      ...documentation.flatMap(x => x.constants),
    ]

    const composables = functions.filter(x => x.name.startsWith('use'))
    const utilities = functions.filter(x => !x.name.startsWith('use') && !/^[A-Z].+/.test(x.name))
    const components = functions.filter(x => /^[A-Z].+/.test(x.name))
    sections = [
      composables.length > 0 && generateItemLines('composables', composables),
      components.length > 0 && generateItemLines('components', components),
      utilities.length > 0 && generateItemLines('utilities', utilities),
    ]
  }

  const types = [
    ...documentation.flatMap(x => x.interfaces),
    ...documentation.flatMap(x => x.types),
  ]

  // --- Build markdown.
  return [
    `# ${capitalize(documentation[0].name)}`,
    documentation[0].description,
    sections,
    types.length > 0 && generateItemLines('types', types),
  ]
    .flat()
    .filter(Boolean)
    .join('\n\n')
}

// --- Generate markdowns and write.
metadata.forEach((documentation) => {
  const file = generatePage(documentation)
  const filePath = join(__dirname, `../../api/${documentation[0].name}.md`)
  mkdirSync(dirname(filePath), { recursive: true })
  writeFileSync(filePath, file)
})
