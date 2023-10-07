import { defineConfig } from 'tsup'

// --- Export Tsup configuration.
export default defineConfig(async() => ({
  name: 'Unshared',
  outDir: './dist',
  platform: 'node',
  target: ['node18'],
  format: ['esm', 'cjs'],
  entry: ['./*.ts'],
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
      // moduleResolution: 'bundler',
      strict: true,
    },
  },

  esbuildOptions: (options) => {
    options.entryNames = '[name]'
    options.chunkNames = 'chunks/[hash]'
    options.assetNames = 'assets/[hash]'
    options.packages = 'external'
  },

  // esbuildPlugins: [
  // PluginGlobSpecifier(),
  // PluginDeclaration(),
  // PluginMetaUrl(),
  // PluginWorker(),
  // ],
}))
