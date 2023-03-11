import { fs, vol } from 'memfs'

beforeEach(() => {
  vi.mock('node:fs', () => fs)
  vi.mock('node:fs/promises', () => fs.promises)
})

afterEach(() => {
  vol.reset()
  vi.clearAllMocks()
  vi.unstubAllEnvs()
  vi.unstubAllGlobals()
})
