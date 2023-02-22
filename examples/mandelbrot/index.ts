import { Worker } from 'node:worker_threads'
import { renderLoop } from './renderLoop'

const workerUrl = new URL('computePixel.ts', import.meta.url)
new Worker(workerUrl)

renderLoop()

process.on('exit', () => {
  process.stdout.write('\u001B[0;0H')
  process.stdout.write('\u001Bc')
})
