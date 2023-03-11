import { createHash } from 'node:crypto'
import { ipcHandle } from '../ipcHandle'

// --- Expose a callable function with parameters to the main thread.
ipcHandle('hash', (algorithm: string, data: string) =>
  createHash(algorithm).update(Buffer.from(data)).digest('hex'),
)

// --- Expose a callable function with no parameters to the main thread.
ipcHandle('random', Math.random)
