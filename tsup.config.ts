import { readFileSync, readdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { Options, defineConfig } from 'tsup'
import { toPascalCase } from './packages/string'

const outExtension: Options['outExtension'] = ({ format }) => {
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
    const outDirectory = resolve(__dirname, `./packages/${dirent.name}/dist`)
    const globalName = toPascalCase(`Unshared_${dirent.name}`)

    const packageJsonPath = resolve(__dirname, `./packages/${dirent.name}/package.json`)
    const packageJsonUtf8 = readFileSync(packageJsonPath, 'utf8')
    const packageJson = JSON.parse(packageJsonUtf8)

    // --- Compute the configuration.
    return <Options>({
      name: 'Unshared',
      format: ['esm', 'cjs'],
      entry: [entry, '!**/*.test.ts', '!**/*.test.*.ts'],
      outDir: outDirectory,
      globalName,
      platform: 'node',
      target: ['node18'],
      splitting: true,
      bundle: false,
      external: [/^@unshared\/.*/],
      sourcemap: true,
      clean: true,
      shims: false,
      dts: true,
      outExtension,
      treeshake: true,
      minifySyntax: true,
      define: { 'import.meta.vitest': 'false' },
      esbuildOptions: (options) => {
        options.chunkNames = 'chunks/[hash]'
        options.ignoreAnnotations = true
      },

      // --- Merge the package.json configuration.
      ...(packageJson ? packageJson.tsup : {}),
    })
  })

// --- Export Tsup configuration.
export default defineConfig(configs)
