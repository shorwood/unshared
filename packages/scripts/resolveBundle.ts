import type { MaybeArray } from '@unshared/types'
import type { RollupOptions } from 'rollup'
import { findAncestor, glob } from '@unshared/fs'
import { resolve } from 'node:path'
import { defineConfig } from 'rollup'
import RollupDts from 'rollup-plugin-dts'
import RollupEsbuild from 'rollup-plugin-esbuild'
import { resolvePackage } from './resolvePackage'

export interface ResolveBundleOptions {
  cwd?: string
  tsConfigPath?: string
  entrypoints?: MaybeArray<string>
}

export const EXCLUDE_FROM_EXPORTS = [
  '.*',
  '__*',
  'scripts',
  '*.d.ts',
  '*.test.ts',
  '*.fixtures.ts',
]

/**
 * Build a single package in the current working directory. This will generate
 * CommonJS, ESM, IIFE, UMD, and Typescript declaration files. The IIFE and UMD
 * bundles will be named after the package name.
 *
 * @param packageName The name of the package to build.
 * @param options The build options.
 * @example resolveBundle('my-package', { cwd: '/path/to/project' }) // RollupOptions[]
 * @returns A promise that resolves with an array of Rollup configurations.
 */
export async function resolveBundle(packageName: string, options: ResolveBundleOptions = {}): Promise<RollupOptions[]> {
  const {
    cwd = process.cwd(),
    tsConfigPath = await findAncestor('tsconfig.json', cwd),
    entrypoints = ['./*.ts', './*/index.ts'],
  } = options

  // --- Check if the tsconfig.json file exists.
  if (!tsConfigPath) throw new Error('Cannot build the package: No tsconfig.json file found.')

  // --- Resolve the package information.
  const { outputDirectory, packageDependencies, packagePath } = await resolvePackage(packageName, { cwd })
  const externalExps = Object.keys(packageDependencies).map(dep => new RegExp(`^${dep}`))
  const external = [...externalExps, /^node:/, 'http', 'stream']

  const paths = await glob(entrypoints, { getRelative: true, cwd: packagePath, exclude: EXCLUDE_FROM_EXPORTS })
  if (paths.length === 0) return []

  // --- Map the inputs to their file names. If the input is a nested index file,
  // --- use the directory name as the input name.
  const input: Record<string, string> = {}
  for (const path of paths) {
    const parts = path.split('/')
    const name = parts.at(path.endsWith('index.ts') ? -2 : -1)!.replace(/\.ts$/, '').replace(/^\.$/, 'index')
    input[name] = resolve(packagePath, path)
  }

  // --- Base Rollup configuration.
  const rollupConfig = defineConfig({
    input,
    external,
    treeshake: false,
    onwarn: (warning) => {
      if (warning.code !== 'CIRCULAR_DEPENDENCY') console.error(`(!) ${warning.message}`)
    },
    output: [
      {
        dir: outputDirectory,
        format: 'esm',
        sourcemap: true,
        entryFileNames: '[name].js',
        assetFileNames: 'assets/[name].js',
        chunkFileNames: 'chunks/[hash].js',
      },
      {
        dir: outputDirectory,
        format: 'cjs',
        sourcemap: true,
        entryFileNames: '[name].cjs',
        assetFileNames: 'assets/[name].cjs',
        chunkFileNames: 'chunks/[hash].cjs',
      },
    ],
    plugins: [
      RollupEsbuild({
        minifySyntax: true,
        platform: 'node',
        sourceMap: true,
        target: 'esnext',
        treeShaking: true,
        tsconfig: tsConfigPath,
      }),
    ],
  })

  // --- Rollup configuration for `.d.ts` files.
  const rollupConfigDts = defineConfig({
    external,
    input,
    output: {
      dir: outputDirectory,
      format: 'esm',
      entryFileNames: '[name].d.ts',
      assetFileNames: 'assets/[name].d.ts',
      chunkFileNames: 'chunks/[hash].d.ts',
    },
    plugins: [
      RollupDts({
        compilerOptions: {
          strict: true,
        },
        respectExternal: true,
        tsconfig: tsConfigPath,
      }),
    ],
  })

  // --- Return the configuration.
  return [rollupConfig, rollupConfigDts]
}
