import { RollupOptions, rollup } from 'rollup'
import RollupDts from 'rollup-plugin-dts'
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
export async function buildDts(packageName: string) {
  const { packagePath, outputPath } = await getPackageMetadata(packageName)
  const inputPaths = await glob(['./**/index.ts', './*.ts'], { cwd: packagePath })

  // --- Rollup configuration for `.d.ts` files.
  const rollupConfig = {
    input: inputPaths,
    external: [
      /^node:.*/,
      /^@unshared\/.*/,
    ],

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

  const bundle = await rollup(rollupConfig)
  for (const output of rollupConfig.output) await bundle.write(output)
  await bundle.close()
}
