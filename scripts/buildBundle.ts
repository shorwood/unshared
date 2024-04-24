import { defineConfig } from 'rollup'
import RollupDts from 'rollup-plugin-dts'
import RollupEsbuild from 'rollup-plugin-esbuild'
import { glob } from '../packages/fs/glob'
import { PackageName, TSCONFIG_PATH } from './constants'
import { getPackageMetadata } from './utils'

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
  const { packagePath, outputDirectory: outputDirectory, packageDependencies } = await getPackageMetadata(packageName)

  // --- Get the input files and external dependencies.
  const inputPaths = await glob(['./*/index.ts', './*.ts'], { cwd: packagePath, exclude: ['*.d.ts'] })
  const externalExps = Object.keys(packageDependencies).map(dep => new RegExp(`^${dep}`))
  const external = [...externalExps, /^node:/]

  // --- Base Rollup configuration.
  const rollupConfig = defineConfig({
    input: inputPaths,
    external,
    plugins: [
      RollupEsbuild({
        target: 'esnext',
        platform: 'node',
        tsconfig: TSCONFIG_PATH,
        sourceMap: true,
        treeShaking: true,
        minifySyntax: true,
        define: { 'import.meta.vitest': 'false' },
      }),
    ],
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
  })

  // --- Rollup configuration for `.d.ts` files.
  const rollupConfigDts = defineConfig({
    input: inputPaths,
    external,
    plugins: [
      RollupDts({
        tsconfig: TSCONFIG_PATH,
        respectExternal: true,
        compilerOptions: {
          strict: true,
        },
      }),
    ],
    output: {
      dir: outputDirectory,
      format: 'esm',
      entryFileNames: '[name].d.ts',
      chunkFileNames: 'chunks/[hash].d.ts',
      assetFileNames: 'assets/[name].d.ts',
    },
  })

  // --- Return the configuration.
  if (packageName === 'types') return [rollupConfigDts]
  return [rollupConfig, rollupConfigDts]
}
