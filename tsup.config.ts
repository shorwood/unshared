import { defineConfig } from 'tsup'
import { isProduction } from './packages/shared'

export default defineConfig({
  outDir: 'dist',
  format: ['esm', 'cjs'],
  treeshake: isProduction,
  splitting: isProduction,
  minify: isProduction,
  sourcemap: true,
  clean: true,
  shims: true,
  dts: true,
})
