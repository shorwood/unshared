import { defineConfig } from 'vitest/config'
import { PACKAGES_NAMES } from './scripts/constants'

const includeSource = PACKAGES_NAMES.map(name => `./packages/${name}/**/*.ts`)
const exclude = ['**/node_modules/**', '**/index.ts', '**/__wip__/**']

export default defineConfig({
  test: {
    open: false,
    globals: true,
    testTimeout: 100,
    reporters: ['basic'],
    setupFiles: './packages/setupTest.ts',
    includeSource,
    include: [],
    exclude,

    // --- Type-checking configuration.
    typecheck: {
      enabled: false,
      checker: 'tsc',
      ignoreSourceErrors: true,
      include: includeSource,
      exclude,
    },

    // --- V8 coverage configuration.
    coverage: {
      enabled: false,
      clean: true,
      cleanOnRerun: true,
      reporter: ['lcovonly', 'html-spa'],
      reportsDirectory: './coverage',
      reportOnFailure: true,
    },
  },
})
