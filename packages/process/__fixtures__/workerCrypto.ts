import { createHash } from 'node:crypto'
import { ipcExpose } from '../ipcExpose'

// --- Expose a callable function with parameters to the main thread.
ipcExpose('hash', (algorithm: string, data: string) =>
  createHash(algorithm).update(Buffer.from(data)).digest('hex'),
)

// --- Expose a callable function with no parameters to the main thread.
ipcExpose('random', Math.random)
