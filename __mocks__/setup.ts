import { fs, vol } from 'memfs'
import { afterEach, beforeEach, vi } from 'vitest'

beforeEach(() => {
  vi.mock('node:fs', () => fs)
  vi.mock('node:fs/promises', () => fs.promises)
  vi.mock('firebase/firestore')
  vi.mock('firebase/auth')
  vi.mock('firebase/app')
})

afterEach(() => {
  vol.reset()
  vi.clearAllMocks()
})
