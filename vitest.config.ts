import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    coverage: {
      enabled: true,
      skipFull: true,
    },
    setupFiles: './packages/setupTest.ts',
    include: [
      './packages/**/*.test.ts',
      './packages/**/*.test.*.ts',
    ],
  },
})
