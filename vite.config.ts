/// <reference types="vitest" />
import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    api: { port: 9000 },
    environment: 'node',
    setupFiles: '/__mocks__/setup.ts',
    include: [
      './packages/**/*.test.ts',
      './packages/**/*.test.*.ts',
    ],
  },
})
