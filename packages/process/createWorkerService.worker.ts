import { WorkerServiceRequest } from './createWorkerService'
import { WORKER_SERVICE_FUNCTION_NAME } from './createWorkerService.constants'
import { workerRegister } from './workerRegister'

// --- Register the dynamic runner function.
workerRegister(WORKER_SERVICE_FUNCTION_NAME, async({ id, name = 'default', parameters = [] }: WorkerServiceRequest) => {
  // --- Import the module and get the target export.
  const modulePath = id instanceof URL ? id.pathname : id
  const moduleResolved = await import(modulePath)
  const moduleExport = moduleResolved[name]

  // --- Call the target function or return the target value.
  return typeof moduleExport === 'function'
    ? moduleExport(...parameters)
    : moduleExport
})
