import { cwd } from 'node:process'
import { resolve } from 'node:path'
import { tries } from '@unshared/functions/tries'
import { vol } from 'memfs'

/**
 * Resolve the absolute path of a relative or package module.
 *
 * @param moduleId The import path.
 * @param path The base path.
 * @returns If the import was found, returns it's absolute path.
 * @throws If the import was not found.
 */
export const resolveImport = (moduleId: string, path: string = cwd()): string => {
  // --- Try to resolve import's absolute path.
  // --- If the path is a package import.
  // --- If the path is a relative import.
  const resolvedPath = tries(
    () => require.resolve(moduleId, { paths: [path] }),
    () => require.resolve(resolve(path, moduleId)),
  )

  // --- Throw if the import was not found.
  if (!resolvedPath) throw new Error(`Could not resolve import "${moduleId}" from "${path}".`)

  // --- Return the absolute path.
  return resolvedPath
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should resolve a relative import', () => {
    vol.fromJSON({
      '/src/index.ts': '',
      '/src/utils.ts': '',
    })
    const result = resolveImport('./utils', '/src')
    expect(result).toEqual('/src/utils.ts')
  })
}
