import { defineConfig } from 'tsup'
import workerPlugin from '@chialab/esbuild-plugin-worker'
import metaUrlPlugin from '@chialab/esbuild-plugin-meta-url'

export default defineConfig({
  entry: ['index.ts'],
  format: ['esm', 'cjs'],
  esbuildPlugins: [
    workerPlugin(),
    metaUrlPlugin(),
  ],
})
