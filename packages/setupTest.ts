/* oxlint-disable vitest/require-top-level-describe */
import { fs, vol } from 'memfs'

beforeEach(() => {

  // --- Mock the `fs` and `fs/promises` modules.
  vi.mock('node:fs', () => fs)
  vi.mock('node:fs/promises', () => fs.promises)

  // --- Mock the `vue-router` package.
  vi.mock('vue-router', async() => {
    const VueRouter: typeof import('vue-router') = await vi.importActual('vue-router')
    const router = VueRouter.createRouter({ history: VueRouter.createMemoryHistory(), routes: [{ path: '/', component: { template: '<div></div>' } }] })
    return { ...VueRouter, router, useRoute: () => router.currentRoute, useRouter: () => router }
  })
})

afterEach(() => {
  vol.reset()
  vi.clearAllMocks()
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})
