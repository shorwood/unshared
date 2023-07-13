import { cwd as getCwd } from 'node:process'
import { loadPackageJson } from '@unshared/fs/loadPackageJson'
import { sleep } from '@unshared/functions/sleep'
import { Options, defineConfig } from 'tsup'
import { postbuild } from './postbuild'
import { prebuild } from './prebuild'

// --- Export Tsup configuration.
export default defineConfig(async() => {
  const packageJson = await loadPackageJson()
  const cwd = getCwd()

  // --- Run prebuild script.
  prebuild(cwd)

  return {
    name: 'Unshared',
    outDir: './dist',
    platform: 'node',
    target: ['node18'],
    format: ['esm', 'cjs'],
    entry: ['./*.ts', './*/index.ts'],
    clean: true,
    shims: false,
    silent: true,
    bundle: true,
    splitting: true,
    sourcemap: true,
    minifySyntax: true,
    treeshake: 'smallest',
    skipNodeModulesBundle: true,
    external: [/@unshared\/.+/],
    define: { 'import.meta.vitest': 'false' },

    dts: {
      compilerOptions: {
        moduleResolution: 'bundler',
        strict: false,
      },
    },

    esbuildOptions: (options) => {
      options.entryNames = '[name]'
      options.chunkNames = 'chunks/[hash]'
      options.assetNames = 'assets/[hash]'
      options.packages = 'external'
    },

    esbuildPlugins: [
      // PluginGlobSpecifier(),
      // PluginDeclaration(),
      // PluginMetaUrl(),
      // PluginWorker(),
    ],

    async onSuccess() {
      await sleep(1000)
      await postbuild(cwd)
    },

    // --- Merge the package.json configuration.
    ...packageJson.tsup as Options,
  }
})
