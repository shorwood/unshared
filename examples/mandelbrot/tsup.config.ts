import { defineConfig } from 'tsup'

export default defineConfig({
  clean: true,
  entry: {
    index: './index.ts',
    render: './render.ts',
  },
  esbuildOptions: (options) => {
    options.define = { 'import.meta.vitest': 'false' }
  },
  format: ['esm'],
  minifySyntax: true,
  silent: true,
})
