/** The URL to the worker used by the `WorkerService` class. */
export const WORKER_SERVICE_URL = new URL('createWorkerService.worker.ts', import.meta.url)

/** The name of the register function used by the `WorkerService` class. */
export const WORKER_SERVICE_FUNCTION_NAME = 'workerService'

/** The name of the ready function used by the `WorkerService` class. */
export const WORKER_SERVICE_READY_FUNCTION_NAME = 'ready'
