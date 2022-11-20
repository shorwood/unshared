import { defineConfig } from 'tsup'
import { isProduction } from './packages/shared/environment/isProduction'

export default defineConfig({
  name: 'HsjmShared',
  globalName: 'HsjmShared',
  onSuccess: 'pnpm build:post && pnpm build:lint',
  outDir: 'dist',
  format: ['esm', 'cjs', 'iife'],
  entry: ['index.ts'],
  treeshake: isProduction(),
  splitting: isProduction(),
  minify: isProduction(),
  sourcemap: true,
  clean: true,
  shims: true,
  dts: true,
})
