import { rm } from 'node:fs/promises'
import RollupTerser from '@rollup/plugin-terser'
import { glob } from '@unshared/fs/glob'
import { RollupOptions, rollup } from 'rollup'
import RollupDts from 'rollup-plugin-dts'
import RollupEsbuild from 'rollup-plugin-esbuild'
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
  const { globalName, packagePath, outputPath } = await getPackageMetadata(packageName)

  console.log(`Building ${packageName} bundle...`)
  console.log(`  - Package path: ${packagePath}`)
  console.log(`  - Output path: ${outputPath}`)

  // --- Clean the output directory.
  await rm(outputPath, { recursive: true, force: true })

  // --- Find the input files.
  const inputPaths = await glob(['./**/index.ts', './*.ts'], { cwd: packagePath })
  const inputIife = inputPaths.find(path => path.endsWith(`/${packageName}/index.ts`))

  /** Base configuration. */
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
        // minify: true,
        tsconfig: TSCONFIG_PATH,
        define: { 'import.meta.vitest': 'false' },
      }),
      RollupTerser({
        mangle: false,
        compress: false,
        format: {
          beautify: true,
          indent_level: 2,
        },
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

  /** IIFE and UMD configuration. */
  const iifeConfig = {
    ...baseConfig,
    input: inputIife,
    output: [
      {
        dir: outputPath,
        format: 'iife',
        name: globalName,
        entryFileNames: '[name].iife.js',
      },
      {
        dir: outputPath,
        format: 'umd',
        name: globalName,
        entryFileNames: '[name].umd.js',
      },
    ],
  } satisfies RollupOptions

  /** Typescript declaration configuration. */
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

  // --- Conditionally define the config.
  const configs = packageName === 'types'
    ? [dtsConfig]
    : [baseConfig, iifeConfig, dtsConfig]

  // --- Generate the bundles and write them to disk.
  for (const config of configs) {
    const bundle = await rollup(config)
    for (const output of config.output)
      await bundle.write(output)
  }
}
