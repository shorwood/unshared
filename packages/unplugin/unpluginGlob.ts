/* eslint-disable sonarjs/cognitive-complexity */
import { relative } from 'node:path'
import { filename } from '@unshared/string/filename'
import { ImportKind, Plugin } from 'esbuild'
import glob from 'fast-glob'

const PLUGIN_FILTER = /\*/
const PLUGIN_NAME = 'esbuild:glob-specifier'

export interface ESBuildGlobOptions {
  /**
   * When exporting a glob specifier, use the `as` keyword to namespace the export.
   * This allows for a more structured hierarchy the exported modules but reduces
   * the tree-shaking capabilities of the next bundler.
   *
   * This is due to the fact that the next bundler will not be able to tree-shake
   * the modules if they are exported as an object.
   *
   * @example
   * // build.ts
   * build({
   *  entryPoints: ['src/index.ts'],
   *  plugins: [ESBuildGlobSpecifier({ namespacedExports: true })],
   *  outdir: 'dist',
   * })
   *
   * // src/index.ts
   * export * from './*.ts'
   *
   * // dist/index.js
   * export { * as foo } from './foo.js'
   * export { * as bar } from './bar.js'
   */
  namespacedExports?: boolean
  /**
   * When `namespacedExports` is `true`, the function to use to convert the file
   * name to a valid variable name.
   *
   * @example
   * // build.ts
   * build({
   *   entryPoints: ['src/index.ts'],
   *   plugins: [ESBuildGlobSpecifier({
   *     namespacedExports: true,
   *     namespacedName: (name) => name.toUpperCase(),
   *   })],
   *   outdir: 'dist',
   * })
   *
   * // src/index.ts
   * export * from './*.ts'
   *
   * // dist/index.js
   * export { * as FOO } from './foo.js'
   * export { * as BAR } from './bar.js'
   */
  namespacedName?: (name: string) => string
}

export interface ESBuildGlobPluginData {
  kind: ImportKind
  resolveDir: string
  resolvePaths: string[]
  sourcePaths: string[]
}

/**
 * Create a plugin to resolve glob specifiers in ESBuild. This plugin will
 * resolve the glob specifier and export all the resolved files.
 *
 * It will also watch the resolved files for changes and re-run the build
 * when a file changes. This allows for a more dynamic build process.
 *
 * ### Notes:
 *
 * This plugin breaks TypeScript's declaration generation. It is recommended
 *
 * @param options The plugin options.
 * @returns The ESBuild plugin.
 */
export function ESBuildGlob(options: ESBuildGlobOptions = {}): Plugin {
  const {
    namespacedExports = false,
    namespacedName = (name: string) => name,
  } = options

  return {
    name: PLUGIN_NAME,
    setup({ onResolve, onLoad }) {
      onResolve({ filter: PLUGIN_FILTER }, ({ resolveDir, path }) => {
        // --- Resolve the glob specifier.
        const resolvePaths = glob
          .sync(path, { cwd: resolveDir, onlyFiles: true, absolute: true })
          .map(path => `./${relative(resolveDir, path)}`)

        // --- Store the resolved paths in the plugin data.
        return {
          path,
          watchFiles: resolvePaths,
          namespace: PLUGIN_NAME,
          pluginData: {
            resolveDir,
            resolvePaths,
          },
        }
      })

      onLoad({ filter: PLUGIN_FILTER, namespace: PLUGIN_NAME }, ({ pluginData }) => {
        const { resolvePaths, resolveDir } = pluginData as ESBuildGlobPluginData
        const contents = namespacedExports
          ? resolvePaths.map(path => `export * as ${namespacedName(filename(path))} from '${path.replace(/\.\w+$/, '')}'\n`).join('')
          : resolvePaths.map(path => `export * from '${path.replace(/\.\w+$/, '')}'\n`).join('')
        return { resolveDir, contents, watchDirs: resolvePaths }
      })
    },
  }
}

export default ESBuildGlob
