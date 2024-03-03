import { RollupOptions, rollup } from 'rollup'
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
  const { packagePath, outputPath } = await getPackageMetadata(packageName)
  const inputPaths = await glob(['./**/index.ts', './*.ts'], { cwd: packagePath })

  // --- Do not build the bundle for theses packages.
  if (packageName === 'types') return
  if (packageName === 'eslint-config') return

  // --- Base Rollup configuration.
  const rollupConfig = {
    input: inputPaths,
    external: [
      /^node:.*/,
      /^@unshared\/.*/,
    ],

    plugins: [
      RollupEsbuild({
        target: 'esnext',
        platform: 'neutral',
        treeShaking: true,
        sourceMap: true,
        tsconfig: TSCONFIG_PATH,
        define: { 'import.meta.vitest': 'false' },
      }),
    ],

    output: [
      {
        dir: outputPath,
        format: 'esm',
        sourcemap: true,
        entryFileNames: '[name].js',
        assetFileNames: 'assets/[name].js',
        chunkFileNames: 'chunks/[hash].js',
      },
      {
        dir: outputPath,
        format: 'cjs',
        sourcemap: true,
        entryFileNames: '[name].cjs',
        assetFileNames: 'assets/[name].cjs',
        chunkFileNames: 'chunks/[hash].cjs',
      },
    ],
  } satisfies RollupOptions

  const bundle = await rollup(rollupConfig)
  for (const output of rollupConfig.output) await bundle.write(output)
  await bundle.close()
}
