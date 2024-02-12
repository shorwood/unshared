import { rm } from 'node:fs/promises'
import { RollupOptions, rollup } from 'rollup'
import RollupDts from 'rollup-plugin-dts'
import RollupEsbuild from 'rollup-plugin-esbuild'
import { glob } from '../packages/fs/glob'
import { TSCONFIG_PATH } from './constants'
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
export async function buildBundle(packageName: string) {
  const { packagePath, outputPath } = await getPackageMetadata(packageName)

  // --- Skip the `eslint-config` package since it does not need to be built.
  if (packageName === 'eslint-config') return

  // --- Clean the output directory.
  await rm(outputPath, { recursive: true, force: true })

  // --- Find the input files.
  const inputPaths = await glob(['./**/index.ts', './*.ts'], { cwd: packagePath })

  // --- Base Rollup configuration.
  const baseConfig = {
    input: inputPaths,
    external: [
      /^node:.*/,
      /^@unshared\/.*/,
    ],

    plugins: [
      RollupEsbuild({
        target: 'esnext',
        platform: 'node',
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

  // --- Rollup configuration for `.d.ts` files.
  const dtsConfig = {
    ...baseConfig,
    plugins: [
      RollupDts({
        tsconfig: TSCONFIG_PATH,
        respectExternal: true,
        compilerOptions: {
          strict: true,
        },
      }),
    ],

    output: [{
      dir: outputPath,
      format: 'esm',
      entryFileNames: '[name].d.ts',
      chunkFileNames: 'chunks/[hash].d.ts',
      assetFileNames: 'assets/[name].d.ts',
    }],
  } satisfies RollupOptions

  // --- Since the `types` package only contains type definitions, we only
  // --- generate the `.d.ts` files for this package.
  const configs = packageName === 'types'
    ? [dtsConfig]
    : [baseConfig, dtsConfig]

  // --- Generate the bundles and write them to disk.
  for (const config of configs) {
    const bundle = await rollup(config)
    for (const output of config.output)
      await bundle.write(output)
    await bundle.close()
  }

  // --- Log the generated files.
  const files = await glob(['./**/*.{cjs,js}', './**/*.d.ts'], { cwd: outputPath })
  const filesRelative = files.map(file => file.replace(outputPath, ''))
  console.log(`Generated bundle for ${packageName}`)
  console.log(filesRelative.map(file => `  - ${file}`).join('\n'))

  // --- Wait 5 seconds for the file system to catch up.
  console.log('Waiting for the file system to catch up...')
  await new Promise(resolve => setTimeout(resolve, 10000))
}
