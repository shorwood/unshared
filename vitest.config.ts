import { cpus } from 'node:os'
import { defineConfig } from 'vitest/config'
import { resolvePackageNames } from './packages/scripts/resolvePackageNames'

const packageNames = await resolvePackageNames()
const include = packageNames.map(name => `./packages/${name}/**/*.test.ts`)

const exclude = [
  '**/node_modules/**',
  '**/index.ts',
  '**/__wip__/**',
  '**/*.d.ts',
  './packages/eslint-config/**',
]

export default defineConfig({
  test: {

    exclude,
    globals: true,
    include,
    reporters: ['basic'],
    setupFiles: './packages/setupTest.ts',
    testTimeout: process.env.DEBUGGER ? 100 : 0,
    pool: 'forks',
    poolOptions: {
      forks: {
        maxForks: cpus().length,
        minForks: 1,
      },
    },

    // --- Benchmark configuration.
    benchmark: {
      exclude,
      include,
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
      include,
      exclude,
      ignoreSourceErrors: true,
    },
  },
})
