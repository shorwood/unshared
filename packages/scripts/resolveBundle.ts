import type { MaybeArray } from '@unshared/types'
import type { RollupOptions } from 'rollup'
import { findAncestor, glob } from '@unshared/fs'
import { defineConfig } from 'rollup'
import RollupDts from 'rollup-plugin-dts'
import RollupEsbuild from 'rollup-plugin-esbuild'
import { resolvePackage } from './resolvePackage'

export interface ResolveBundleOptions {
  cwd?: string
  tsConfigPath?: string
  entrypoints?: MaybeArray<string>
}

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
    entrypoints = '*.ts',
  } = options

  // --- Check if the tsconfig.json file exists.
  if (!tsConfigPath) throw new Error('Cannot build the package: No tsconfig.json file found.')

  // --- Get the input files and external dependencies.
  const { outputDirectory, packageDependencies, packagePath } = await resolvePackage(packageName, { cwd })
  const inputPaths = await glob(entrypoints, { cwd: packagePath, exclude: ['*.d.ts', '*.test.ts'] })
  if (inputPaths.length === 0) return []

  // --- Resolve and merge the external dependencies.
  const externalExps = Object.keys(packageDependencies).map(dep => new RegExp(`^${dep}`))
  const external = [
    ...externalExps,
    /^node:/,
    'http',
    'stream',
  ]

  // --- Base Rollup configuration.
  const rollupConfig = defineConfig({
    external,
    input: inputPaths,
    treeshake: false,
    onwarn: (warning) => {
      if (warning.code !== 'CIRCULAR_DEPENDENCY') console.error(`(!) ${warning.message}`)
    },
    output: [
      {
        assetFileNames: 'assets/[name].js',
        chunkFileNames: 'chunks/[hash].js',
        dir: outputDirectory,
        entryFileNames: '[name].js',
        format: 'esm',
        sourcemap: true,
      },
      {
        assetFileNames: 'assets/[name].cjs',
        chunkFileNames: 'chunks/[hash].cjs',
        dir: outputDirectory,
        entryFileNames: '[name].cjs',
        format: 'cjs',
        sourcemap: true,
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
    input: inputPaths,
    output: {
      assetFileNames: 'assets/[name].d.ts',
      chunkFileNames: 'chunks/[hash].d.ts',
      dir: outputDirectory,
      entryFileNames: '[name].d.ts',
      format: 'esm',
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
