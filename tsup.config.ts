import { readFileSync, readdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { Options, defineConfig } from 'tsup'
import { toPascalCase } from './packages/string'
import { postbuild } from './scripts/postbuild'
import pluginProgress from 'esbuild-plugin-progress'

const __dirname = dirname(import.meta.url.slice(7))

const packages = new Set(['process', 'boolean'])

const configs = readdirSync('./packages', { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .filter(dirent => packages.has(dirent.name))
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
      silent: true,
      platform: 'node',
      target: ['node18'],
      splitting: true,
      bundle: true,
      external: [/^@unshared\/.*/],
      sourcemap: true,
      clean: true,
      shims: true,
      dts: true,
      treeshake: true,
      minifySyntax: true,
      define: { 'import.meta.vitest': 'false' },

      esbuildOptions: (options) => {
        options.chunkNames = 'chunks/[hash]'
        options.ignoreAnnotations = true
        options.packages = 'external'
      },
      
      esbuildPlugins: [
        pluginProgress({
          message: `Building ${dirent.name}...`
        })
      ],

      outExtension: ({ format }) => {
        let js = '.js'
        if (format === 'cjs') js = '.cjs'
        if (format === 'esm') js = '.js'
        if (format === 'iife') js = '.global.js'
        return { js }
      },

      onSuccess: () => postbuild(dirent.name),

      // --- Merge the package.json configuration.
      ...(packageJson ? packageJson.tsup : {}),
    })
  })

// --- Export Tsup configuration.
export default defineConfig(configs)
