import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    open: false,
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
      clean: true,
      enabled: false,
      cleanOnRerun: true,
      excludeNodeModules: true,
      reporter: ['html'],
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
