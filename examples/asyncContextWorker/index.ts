import { createWorkerPool } from '@unshared/process/createWorkerPool'

const workerPool = createWorkerPool({ size: 4 })

async function main() {
  const workerUrl = new URL('./worker', import.meta.url)
  const worker = workerPool.wrap<typeof import('./worker')>(workerUrl)
  const result = await worker.main()
  console.log(result)
}

await main()
