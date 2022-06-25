/// <reference types="vitest" />
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [
    vue(),
  ],
  test: {
    api: {
      port: 9000,
    },
    include: [
      './packages/**/*.test.ts',
      './packages/**/*.test.*.ts',
    ],
    coverage: {
      all: true,
      reporter: ['clover', 'cobertura', 'lcov', 'text'],
      include: ['packages'],
      extension: ['ts'],
      excludeNodeModules: true,
      reportsDirectory: resolve(__dirname, './coverage'),
    },
    environment: 'node',
  },
})
