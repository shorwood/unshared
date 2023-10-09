import metaUrlPlugin from '@chialab/esbuild-plugin-meta-url'
import workerPlugin from '@chialab/esbuild-plugin-worker'
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['index.ts'],
  format: ['esm', 'cjs'],
  esbuildPlugins: [
    workerPlugin(),
    metaUrlPlugin(),
  ],
})
