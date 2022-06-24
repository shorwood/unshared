/// <reference types="vitest" />
import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    api: {
      port: 9000,
    },
    include: [
      './packages/**/*.test.ts',
    ],
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
