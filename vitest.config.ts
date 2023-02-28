import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    testTimeout: 100,
    reporters: ['dot'],
    typecheck: {
      checker: 'tsc',
      ignoreSourceErrors: false,
      include: ['./packages/types/*.ts'],
    },
    coverage: {
      100: true,
      enabled: true,
      excludeNodeModules: true,
      reporter: ['text', 'lcov', 'html'],
    },
    setupFiles: './packages/setupTest.ts',
    passWithNoTests: true,
    include: [
      './packages/**/*.test.ts',
      './packages/**/*.test.*.ts',
    ],
    includeSource: [
      './packages/**/*.ts',
    ],
    exclude: [
      './packages/setupTest.ts',
      './packages/**/node_modules/**',
    ],
  },
})
