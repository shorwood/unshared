import { resolveImport } from './resolveImport'

/**
 * Resolve all dependencies for a given entry point.
 *
 * @param entryPoint The entry point.
 * @returns The resolved dependencies path.
 */
export const resolveDependencies = async(entryPoint: string): Promise<string[]> => {
  const { dirname } = await import('node:path')
  const { constants } = await import('node:fs')
  const { access, readFile } = await import('node:fs/promises')

  const dependencies = [] as string[]
  const toExplore = [resolveImport(entryPoint)]

  // --- Regular expression to find all imports.
  const regexes = [
    /(import|export)\s+(?:(.+?)\s+from\s+)?["'](?<path>.+?)["']/g,
    /(require|import)\s*\(["'](?<path>.+?)["']\)/g,
  ]

  // --- Loop over all the files to explore.
  while (true) {
    const filePath = toExplore.pop()
    if (!filePath) break
    try { await access(filePath, constants.F_OK) }
    catch { continue }

    // --- Read the file.
    const fileContent = await readFile(filePath, 'utf8')

    // --- Loop through all regular expressions.
    for (const regex of regexes) {
      try {
        // --- Find all imports.
        const matches = [...fileContent.matchAll(regex)]
        if (matches.length === 0) continue

        // --- Loop through all imports.
        for (const match of matches) {
          const path = match.groups?.path
          if (!path) continue

          // --- Resolve the absolute path.
          const importDirectory = dirname(filePath)
          const importPath = require.resolve(path, { paths: [importDirectory] })

          // --- Add the import path to the list of dependencies.
          if (!importPath) continue
          if (dependencies.includes(importPath)) continue
          dependencies.push(importPath)
          toExplore.push(importPath)
        }
      }
      catch {}
    }
  }

  // --- Return the dependencies.
  return dependencies
}
