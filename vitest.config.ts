import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    open: false,
    globals: true,
    useAtomics: true,
    testTimeout: 100,
    reporters: ['basic'],
    setupFiles: './packages/setupTest.ts',
    includeSource: ['./packages/**/*.ts'],
    include: ['./packages/**/*.test.ts'],
    exclude: ['**/node_modules/**'],

    // --- Type-checking configuration.
    typecheck: {
      checker: 'tsc',
      ignoreSourceErrors: false,
      include: ['./**/*.ts'],
    },

    // --- V8 coverage configuration.
    coverage: {
      enabled: false,
      100: true,
      clean: true,
      cleanOnRerun: true,
      reporter: ['html'],
    },
  },
})
