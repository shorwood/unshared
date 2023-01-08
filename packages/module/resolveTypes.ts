
import { PackageJSON } from 'types-pkg-json'
import { tries } from '@unshared-dev/function/tries'
import { loadObject } from './loadObject'
import { resolveAncestor } from './resolveAncestor'
import { resolveImport } from './resolveImport'
import { resolveModule } from './resolveModule'

/**
 * Resolve the absolute path of the type definition of an import.
 * @param path The module id to analyze.
 * @returns The path of the type definition.
 */
export const resolveTypes = async(path: string, from?: string): Promise<string> => {
  const { dirname, resolve } = await import('node:path')
  const { cwd } = await import('node:process')
  // @ts-expect-error: `isBuiltIn` is not in `@types/node` yet.
  const { isBuiltin } = await import('node:module')
  if (!from) from = cwd()

  // --- If the path is a builtin module, return types from `@types/node`.
  if (isBuiltin(path)) return resolveTypes('@types/node')

  const result = await tries(
    async() => {
      // --- Find and import the `package.json` as an object.
      const absolutePath = resolveImport(<string>path)
      const packageJsonPath = await resolveAncestor('package.json', absolutePath)
      const packageJson = await loadObject<PackageJSON>(packageJsonPath)

      // --- Get the path of the type definitions.
      const typesRelativePath = packageJson.types || packageJson.typings
      if (!typesRelativePath) throw new Error(`Missing "types" or "typings" field in "${packageJsonPath}".`)

      const rootDirectory = dirname(packageJsonPath)
      return resolve(rootDirectory, typesRelativePath)
    },

    async() => {
      // --- Fall back to the DefinitelyTyped repository.
      const packageName = path.startsWith('@types/') ? path : `@types/${path.replace('/', '__')}`
      if (!packageName) throw new Error('Package name is missing.')

      // --- Find
      const packageDirectory = await resolveModule(packageName)
      const packageJsonPath = resolve(packageDirectory, 'package.json')
      const packageJson = await loadObject<PackageJSON>(packageJsonPath)
      if (!packageJson) throw new Error(`"${packageJsonPath}" does not exist.`)

      // --- Get the path of the type definitions.
      const typesRelativePath = packageJson.types || packageJson.typings
      if (!typesRelativePath) throw new Error(`Missing "types" or "typings" field in "${packageJsonPath}".`)

      const rootDirectory = dirname(packageJsonPath)
      return resolve(rootDirectory, typesRelativePath)
    },
  )

  // --- Throw if the type definition was not found.
  if (!result) throw new Error(`Could not resolve types for "${path}".`)

  // --- Return the absolute path.
  return result
}
