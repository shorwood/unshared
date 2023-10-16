import { WorkerServiceRequest } from './createWorkerService'
import { WORKER_SERVICE_FUNCTION_NAME } from './createWorkerService.constants'
import { workerRegister } from './workerRegister'

// --- Register the dynamic runner function.
workerRegister(WORKER_SERVICE_FUNCTION_NAME, async(request: WorkerServiceRequest) => {
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
