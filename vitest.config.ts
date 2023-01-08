import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    setupFiles: './packages/setupTest.ts',
    include: [
      './packages/**/*.test.ts',
      './packages/**/*.test.*.ts',
    ],
  },
})
