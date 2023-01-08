import { fs, vol } from 'memfs'
import { afterEach, beforeEach, vi } from 'vitest'

beforeEach(() => {
  vi.mock('node:fs', () => fs)
  vi.mock('node:fs/promises', () => fs.promises)
})

afterEach(() => {
  vol.reset()
  vi.clearAllMocks()
})
