import { defineConfig } from 'tsup'

export default defineConfig({
  outDir: 'dist',
  format: ['esm', 'cjs'],
  splitting: false,
  sourcemap: true,
  clean: true,
  shims: true,
  dts: true,
  treeshake: true,
})
