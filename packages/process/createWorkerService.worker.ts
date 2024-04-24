import { createRequire } from 'node:module'
import { WorkerServicePayload } from './createWorkerService'
import { workerRegister } from './workerRegister'

async function callback(request: WorkerServicePayload) {
  const { moduleId, name = 'default', parameters = [], paths } = request

  // --- Import the module and get the named export.
  const require = createRequire(import.meta.url)
  const modulePath = require.resolve(moduleId as string, { paths })
  const moduleResolved = await import(modulePath) as Record<string, unknown>

  // --- If the named export is a special method, return the result.
  if (name === 'getOwnPropertyNames') return Object.getOwnPropertyNames(moduleResolved)

  // --- Check if the named export exists.
  if (name in moduleResolved === false)
    throw new Error(`The module "${modulePath}" does not have the named export "${name}".`)
  const moduleExport = moduleResolved[name]

  // --- Execute the function.
  return typeof moduleExport === 'function'
    ? moduleExport(...parameters) as unknown
    : moduleExport
}

// --- Register the dynamic runner function.
workerRegister('WORKER_SERVICE', callback)
