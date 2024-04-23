/** The URL to the worker used by the `WorkerService` class. */
export const WORKER_SERVICE_URL = import.meta.vitest
  ? new URL('createWorkerService.worker', import.meta.url)
  : new URL('dist/createWorkerService.worker', import.meta.url)

/** The name of the register function used by the `WorkerService` class. */
export const WORKER_SERVICE_HANDLER_NAME = 'WORKER_SERVICE'

/* v8 ignore start */
if (import.meta.vitest) {
  it('should have a worker service URL', () => {
    expect(WORKER_SERVICE_URL).toBeInstanceOf(URL)
  })

  it('should point to the non-`dist` folder', () => {
    expect(WORKER_SERVICE_URL.pathname).not.toContain('dist/')
  })

  it('should have a worker service handler name', () => {
    expect(WORKER_SERVICE_HANDLER_NAME).toBe('WORKER_SERVICE')
  })
}
