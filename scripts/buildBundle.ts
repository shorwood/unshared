import RollupEsbuild from 'rollup-plugin-esbuild'
import RollupDts from 'rollup-plugin-dts'
import { defineConfig } from 'rollup'
import { getPackageMetadata } from './utils'
import { PackageName, TSCONFIG_PATH } from './constants'
import { glob } from '../packages/fs/glob'

/**
 * Build a single package in the current working directory. This will generate
 * CommonJS, ESM, IIFE, UMD, and Typescript declaration files. The IIFE and UMD
 * bundles will be named after the package name.
 *
 * @param packageName The name of the package to build. If not specified, all packages will be built.
 * @example node scripts/build.ts string
 * @returns A promise that resolves when the build is complete.
 */
export async function buildBundle(packageName: PackageName) {
  const { outputDirectory, packageDependencies, packagePath } = await getPackageMetadata(packageName)

  // --- Get the input files and external dependencies.
  const inputPaths = await glob('*.ts', { cwd: packagePath, exclude: ['*.d.ts'] })
  const externalExps = Object.keys(packageDependencies).map(dep => new RegExp(`^${dep}`))
  const external = [...externalExps, /^node:/]

  // --- Base Rollup configuration.
  const rollupConfig = defineConfig({
    external,
    input: inputPaths,
    treeshake: false,
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
        define: { 'import.meta.vitest': 'false' },
        minifySyntax: true,
        platform: 'node',
        sourceMap: true,
        target: 'esnext',
        treeShaking: true,
        tsconfig: TSCONFIG_PATH,
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
        tsconfig: TSCONFIG_PATH,
      }),
    ],
  })

  // --- Return the configuration.
  return [rollupConfig, rollupConfigDts]
}
