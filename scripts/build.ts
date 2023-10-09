import { rm } from 'node:fs/promises'
import { resolve } from 'node:path'
import { cwd as getCwd } from 'node:process'
import RollupReplace from '@rollup/plugin-replace'
import RollupSucrase from '@rollup/plugin-sucrase'
import RollupTerser from '@rollup/plugin-terser'
import { glob } from '@unshared/fs'
import { toPascalCase } from '@unshared/string'
import { RollupOptions, rollup } from 'rollup'
import RollupDts from 'rollup-plugin-dts'
import { TSCONFIG_PATH } from './constants'

/**
 * Build a single package in the current working directory. This will generate
 * CommonJS, ESM, IIFE, UMD, and Typescript declaration files. The IIFE and UMD
 * bundles will be named after the package name.
 */
async function build() {
  const cwd = getCwd()
  const packageName = cwd.split('/').pop()!
  const globalName = toPascalCase('Unshared', packageName)
  const outDirectory = resolve(cwd, './dist')

  // --- Clean the output directory.
  await rm(outDirectory, { recursive: true, force: true })

  /** Base configuration. */
  const baseConfig = {
    input: await glob(['./*.ts', './utils/index.ts'], { cwd, getRelative: true }),
    treeshake: 'recommended',
    external: [
      '@unshared/types',
    ],

    plugins: [
      RollupReplace({
        preventAssignment: true,
        values: { 'import.meta.vitest': 'false' },
      }),
      RollupSucrase({
        production: true,
        transforms: ['typescript'],
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
        dir: outDirectory,
        format: 'esm',
        sourcemap: true,
        entryFileNames: '[name].js',
        assetFileNames: 'assets/[name].js',
        chunkFileNames: 'chunks/[hash].js',
      },
      {
        dir: outDirectory,
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
    input: './index.ts',
    output: [
      {
        dir: outDirectory,
        format: 'iife',
        name: globalName,
        entryFileNames: '[name].iife.js',
      },
      {
        dir: outDirectory,
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
      dir: outDirectory,
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

await build()
