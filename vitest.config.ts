import { defineConfig } from 'vitest/config'
import { PACKAGES_NAMES } from './scripts/constants'

const includeSource = PACKAGES_NAMES.map(name => `./packages/${name}/**/*.ts`)

export default defineConfig({
  test: {
    open: false,
    globals: true,
    testTimeout: 100,
    reporters: ['basic'],
    setupFiles: './packages/setupTest.ts',
    // includeSource: ['./packages/**/*.ts'],
    includeSource,
    include: [],
    exclude: ['**/node_modules/**'],

    // --- Type-checking configuration.
    typecheck: {
      checker: 'tsc',
      ignoreSourceErrors: false,
      include: includeSource,
    },

    // --- V8 coverage configuration.
    coverage: {
      enabled: false,
      clean: true,
      cleanOnRerun: true,
      reporter: ['lcovonly'],
    },
  },
})
