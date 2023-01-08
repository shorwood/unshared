import { existsSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { defineConfig, Options } from 'tsup'
import { toPascalCase } from './packages/string'

const outExtension = ({ format, options }) => {
  let js = '.js'
  if (format === 'cjs') js = '.cjs'
  if (format === 'esm') js = '.js'
  if (format === 'iife') js = '.global.js'
  return { js }
}

const configs = readdirSync('./packages', { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map((dirent): Options => {

    // --- Define the input and output paths.
    const entry = resolve(__dirname, `./packages/${dirent.name}/*.ts`)
    const outDir = resolve(__dirname, `./packages/${dirent.name}/dist`)
    const globalName = toPascalCase(`Unshared_${dirent.name}`)

    // --- Compute the configuration.
    return <Options>({
      name: 'Unshared',
      format: ['esm', 'cjs'],
      entry: [entry, '!**/*.test.ts','!**/*.test.*.ts'],
      outDir,
      globalName,
      platform: 'node',
      target: [
        'chrome58',
        'firefox57',
      ],
      splitting: true,
      bundle: false,
      external: [/^@unshared-dev\/.*/],
      sourcemap: true,
      clean: true,
      shims: false,
      dts: true,
      outExtension,
      esbuildOptions: (options) => {
        options.chunkNames = 'chunks/[hash]'
      }
    })
  })
    
// --- Export Tsup configuration.
export default defineConfig(configs)
