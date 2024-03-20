import { createRequire } from 'node:module'
import { resolve } from 'node:path'
import { cwd } from 'node:process'
import { tries } from '@unshared/functions/tries'

/**
 * Resolve the absolute path of a relative or package module. This function
 * will try to resolve as a package module first, then as an absolute or
 * relative module from the current working directory.
 *
 * @param specifier The import specifier to resolve.
 * @param from If the `moduleId` is a relative import, the path to resolve it from.
 * @returns If the import was found, returns it's absolute path, otherwise `undefined`.
 * @example
 * // Resolve an absolute import.
 * resolveImport('/home/user/project/src/utils') // '/home/user/project/src/utils.ts'
 *
 * // Resolve a relative import.
 * resolveImport('./utils', __dirname) // '/home/user/project/src/utils.ts'
 *
 * // Resolve a package import.
 * resolveImport('lodash') // '/home/user/project/node_modules/lodash/index.js'
 */
export function resolveImport(specifier: string, from: string = cwd()): string | undefined {
  return tries<string | undefined>(
    () => createRequire(from).resolve(specifier, { paths: [from] }),
    () => createRequire(from).resolve(resolve(from, specifier)),
  )
}

/** c8 ignore next */
if (import.meta.vitest) {
  const { vol } = await import('memfs')

  it('should resolve a relative import', () => {
    vol.fromJSON({
      '/src/index.ts': '',
      '/src/utils.ts': '',
    })
    const result = resolveImport('./utils', '/src')
    expect(result).toEqual('/src/utils.ts')
  })

  it('should resolve the index of a relative import', () => {
    vol.fromJSON({
      '/src/index.ts': '',
      '/src/utils/index.ts': '',
    })
    const result = resolveImport('./utils', '/src')
    expect(result).toEqual('/src/utils/index.ts')
  })

  it('should resolve an absolute import', () => {
    vol.fromJSON({
      '/src/index.ts': '',
      '/src/utils.ts': '',
    })
    const result = resolveImport('/src/utils')
    expect(result).toEqual('/src/utils.ts')
  })
}
