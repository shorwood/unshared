import { rm } from 'node:fs/promises'
import { resolve } from 'node:path'
import { argv } from 'node:process'
import RollupTerser from '@rollup/plugin-terser'
import { glob } from '@unshared/fs'
import { toPascalCase } from '@unshared/string/toPascalCase'
import { RollupOptions, rollup } from 'rollup'
import RollupDts from 'rollup-plugin-dts'
import RollupEsbuild from 'rollup-plugin-esbuild'
import { ROOT_PATH, TSCONFIG_PATH } from './constants'

/**
 * Build a single package in the current working directory. This will generate
 * CommonJS, ESM, IIFE, UMD, and Typescript declaration files. The IIFE and UMD
 * bundles will be named after the package name.
 *
 * @param packageName The name of the package to build. If not specified, all packages will be built.
 * @example node scripts/build.ts string
 * @returns A promise that resolves when the build is complete.
 */
async function build(packageName: string) {
  const globalName = toPascalCase('Unshared', packageName)
  const inputDirectory = resolve(ROOT_PATH, 'packages', packageName)
  const outputDirectory = resolve(ROOT_PATH, 'packages', packageName, 'dist')
  const inputPaths = await glob(['./**/index.ts', './*.ts'], { cwd: inputDirectory })
  const inputIife = inputPaths.find(path => path.endsWith(`/${packageName}/index.ts`))

  // --- Clean the output directory.
  await rm(outputDirectory, { recursive: true, force: true })

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
  } satisfies RollupOptions

  /** IIFE and UMD configuration. */
  const iifeConfig = {
    ...baseConfig,
    input: inputIife,
    output: [
      {
        dir: outputDirectory,
        format: 'iife',
        name: globalName,
        entryFileNames: '[name].iife.js',
      },
      {
        dir: outputDirectory,
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
      dir: outputDirectory,
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

// --- Run the build script for each package specified in the command line arguments.
for (const packageName of argv.slice(2))
  await build(packageName)
