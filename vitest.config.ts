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
      include: ['./**/*.ts'],
    },
    coverage: {
      100: true,
      clean: true,
      enabled: false,
      cleanOnRerun: true,
      excludeNodeModules: true,
      reporter: ['html'],
    },
    setupFiles: new URL('packages/setupTest.ts', import.meta.url).pathname,
    passWithNoTests: true,
    include: [
      './**/*.test.ts',
      './**/*.test.*.ts',
    ],
    includeSource: [
      './packages/**/*.ts',
    ],
    exclude: [
      new URL('packages/setupTest.ts', import.meta.url).pathname,
      new URL('**/node_modules/**', import.meta.url).pathname,
    ],
  },
})
