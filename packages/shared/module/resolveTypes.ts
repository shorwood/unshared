import { dirname, resolve } from 'node:path'
import { cwd } from 'node:process'
// @ts-expect-error: `isBuiltIn` is not in `@types/node` yet.
import { isBuiltin } from 'node:module'
import { PackageJSON } from 'types-pkg-json'
import { tries } from '../misc/tries'
import { jsonImport } from './jsonImport'
import { resolveAncestor } from './resolveAncestor'
import { resolveImport } from './resolveImport'
import { resolveModule } from './resolveModule'

/**
 * Resolve the absolute path of the type definition of an import.
 * @param path The module id to analyze.
 * @returns The path of the type definition.
 */
export const resolveTypes = (path: string = cwd()): string => {
  // --- If the path is a builtin module, return types from `@types/node`.
  if (isBuiltin(path)) return resolveTypes('@types/node')

  const result = tries(
    () => {
      // --- Find and import the `package.json` as an object.
      const absolutePath = resolveImport(path)
      const packageJsonPath = resolveAncestor('package.json', absolutePath)
      const packageJson = jsonImport<PackageJSON>(packageJsonPath)

      // --- Get the path of the type definitions.
      const typesRelativePath = packageJson.types || packageJson.typings
      if (!typesRelativePath) throw new Error(`Missing "types" or "typings" field in "${packageJsonPath}".`)

      const rootDirectory = dirname(packageJsonPath)
      return resolve(rootDirectory, typesRelativePath)
    },

    () => {
      // --- Fall back to the DefinitelyTyped repository.
      const packageName = path.startsWith('@types/') ? path : `@types/${path.replace('/', '__')}`
      if (!packageName) throw new Error('Package name is missing.')

      // --- Find
      const packageDirectory = resolveModule(packageName)
      const packageJsonPath = resolve(packageDirectory, 'package.json')
      const packageJson = jsonImport<PackageJSON>(packageJsonPath)
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
