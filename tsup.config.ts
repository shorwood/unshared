import { defineConfig } from 'tsup'
import { isProduction } from './packages/shared'

export default defineConfig({
  outDir: 'dist',
  format: ['esm', 'cjs'],
  entry: ['index.ts', '*/index.ts'],
  external: [
    /vue/,
    /faker/,
    /firebase/,
    /milsymbol/,
    /leaflet/,
    /@hsjm/,
  ],
  treeshake: isProduction,
  splitting: isProduction,
  minify: isProduction,
  sourcemap: true,
  clean: true,
  shims: true,
  dts: true,
})
