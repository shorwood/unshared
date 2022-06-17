/// <reference types="vitest" />
import { resolve } from 'node:path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  test: {
    coverage: {
      all: true,
      reporter: ['clover', 'cobertura', 'lcov', 'text'],
      include: ['packages'],
      extension: ['ts'],
      excludeNodeModules: true,
      reportsDirectory: resolve(__dirname, './coverage'),
    },
  },
})
