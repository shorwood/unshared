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

    exclude,
    globals: true,
    include: [],
    includeSource,
    reporters: ['basic'],
    setupFiles: './packages/setupTest.ts',
    testTimeout: process.env.DEBUGGER ? 100 : 0,

    // --- UI configuration.
    api: {
      host: '0.0.0.0',
      port: 5000,
    },
    open: true,
    ui: true,

    // --- Benchmark configuration.
    benchmark: {
      exclude,
      includeSource,
      outputFile: './benchmark/results.json',
      reporters: ['verbose'],
    },

    // --- V8 coverage configuration.
    coverage: {
      clean: true,
      cleanOnRerun: true,
      enabled: false,
      reporter: ['lcovonly', 'html-spa'],
      reportOnFailure: true,
      reportsDirectory: './coverage',
    },

    // --- Type-checking configuration.
    typecheck: {
      checker: 'tsc',
      enabled: false,
      exclude,
      ignoreSourceErrors: true,
      include: includeSource,
    },
  },
})
