import { defineConfig } from 'vitest/config'
import { PACKAGES_NAMES } from './scripts/constants'

const includeSource = PACKAGES_NAMES.map(name => `./packages/${name}/**/*.ts`)
const exclude = [
  '**/node_modules/**',
  '**/index.ts',
  '**/__wip__/**',
  '**/*.d.ts',
]

export default defineConfig({
  test: {
    open: false,
    globals: true,
    testTimeout: process.env.DEBUGGER ? 100 : 0,
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

    // --- Benchmark configuration.
    benchmark: {
      includeSource,
      exclude,
      outputFile: './benchmark/results.json',
      reporters: ['verbose'],
    },
  },
})
