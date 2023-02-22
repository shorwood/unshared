/* eslint-disable @typescript-eslint/consistent-type-imports */
/* eslint-disable sonarjs/no-duplicate-string */
import { fs, vol } from 'memfs'

beforeEach(() => {
  // --- Use virtual file system.
  vi.mock('node:fs', () => fs)
  vi.mock('node:fs/promises', () => fs.promises)

  // --- Emulate a main thread.
  vi.mock('node:worker_threads', async() => {
    const workerThreads = await vi.importActual<typeof import('node:worker_threads')>('node:worker_threads')
    return { ...workerThreads, isMainThread: true }
  })
})

afterEach(() => {
  vol.reset()
  vi.clearAllMocks()
  vi.unstubAllGlobals()
})
