import { defineConfig } from 'tsup'

export default defineConfig({
  format: ['esm'],
  entry: {
    index: './index.ts',
    render: './render.ts',
  },
  clean: true,
  silent: true,
  esbuildOptions: (options) => {
    options.define = { 'import.meta.vitest': 'false' }
  },
  minifySyntax: true,
})
