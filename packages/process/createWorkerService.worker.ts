import { WorkerServiceRequest } from './createWorkerService'
import { workerRegister } from './workerRegister'

// --- Register the dynamic runner function.
workerRegister('WORKER_SERVICE', async(request: WorkerServiceRequest) => {
  const { id, name = 'default', parameters = [] } = request

  // --- Import the module and get the named export.
  const modulePath = id instanceof URL ? id.pathname : id
  const moduleResolved = await import(modulePath)
  const moduleExport = moduleResolved[name]

  // --- Execute the function.
  return typeof moduleExport === 'function'
    ? moduleExport(...parameters)
    : moduleExport
})
