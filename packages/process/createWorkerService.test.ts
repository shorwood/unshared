import { createWorkerService, WorkerService } from './createWorkerService'

describe('createWorkerService', () => {
  type Module = typeof import('./__fixtures__/module')
  const moduleId = new URL('__fixtures__/module', import.meta.url)

  describe('createWorkerService', () => {
    it('should create a worker service', () => {
      const service = createWorkerService()
      expect(service).toBeInstanceOf(WorkerService)
    })
  })

  describe.sequential('spawn', () => {
    it('should spawn the default export function and return the result', async() => {
      const service = createWorkerService()
      const result = await service.spawn<Module['factorial']>({ moduleId, parameters: [5] })
      expect(result).toBe(120)
      expectTypeOf(result).toEqualTypeOf<number>()
      await service.destroy()
    })

    it('should spawn a sync function return the result', async() => {
      const service = createWorkerService()
      const result = await service.spawn<Module['factorial']>({ moduleId, name: 'factorial', parameters: [5] })
      expect(result).toBe(120)
      expectTypeOf(result).toEqualTypeOf<number>()
      await service.destroy()
    })

    it('should spawn an async function and return the result', async() => {
      const service = createWorkerService()
      const result = await service.spawn<Module['factorialAsync']>({ moduleId, name: 'factorialAsync', parameters: [5] })
      expect(result).toBe(120)
      expectTypeOf(result).toEqualTypeOf<number>()
      await service.destroy()
    })

    it('should spawn a function and return an Uint8Array', async() => {
      const service = createWorkerService()
      const result = await service.spawn<Module['buffer']>({ moduleId, name: 'buffer' })
      const expected = new Uint8Array([72, 101, 108, 108, 111, 44, 32, 87, 111, 114, 108, 100, 33])
      expect(result).toStrictEqual(expected)
      expectTypeOf(result).toEqualTypeOf<Uint8Array>()
      await service.destroy()
    })

    it('should reject an error if the function throws', async() => {
      const service = createWorkerService()
      const shouldReject = service.spawn({ moduleId, name: 'throws' })
      await expect(shouldReject).rejects.toThrow('Thrown')
      await service.destroy()
    })

    it('should reject an error if the function rejects', async() => {
      const service = createWorkerService()
      const shouldReject = service.spawn({ moduleId, name: 'rejects' })
      await expect(shouldReject).rejects.toThrow('Rejected')
      await service.destroy()
    })

    it('should spawn a function and return the thread ID', async() => {
      const service = createWorkerService()
      const result = await service.spawn<Module['getThreadId']>({ moduleId, name: 'getThreadId' })
      expect(result).toStrictEqual(service.worker?.threadId)
      expectTypeOf(result).toEqualTypeOf<number>()
      await service.destroy()
    })

    it('should spawn a built-in module function and return the result', async() => {
      const service = createWorkerService()
      const result = await service.spawn({ moduleId: 'node:crypto', name: 'randomBytes', parameters: [16] })
      expect(result).toBeInstanceOf(Uint8Array)
      expect(result).toHaveLength(16)
      await service.destroy()
    })

    it('should reject an error if the module does not exist', async() => {
      const service = createWorkerService()
      const shouldReject = service.spawn({ moduleId: 'doesNotExist' })
      await expect(shouldReject).rejects.toThrow('Cannot find module')
      await service.destroy()
    })

    it('should reject an error if the named export does not exist', async() => {
      const service = createWorkerService()
      const shouldReject = service.spawn({ moduleId, name: 'doesNotExist' })
      await expect(shouldReject).rejects.toThrow('does not have the named export "doesNotExist"')
      await service.destroy()
    })
  })

  describe.sequential('wrap', () => {
    it('should wrap a module in a worker thread and call a named function', async() => {
      const service = createWorkerService()
      const { factorial } = service.wrap<Module>(moduleId)
      const result = await factorial(5)
      expect(result).toBe(120)
      await service.destroy()
    })

    it('should get the own property names of the wrapped module', async() => {
      const service = createWorkerService()
      const { getOwnPropertyNames } = service.wrap<Module>(moduleId)
      const result = await getOwnPropertyNames()
      expect(result).toStrictEqual([
        'buffer',
        'constant',
        'default',
        'factorial',
        'factorialAsync',
        'getThreadId',
        'rejects',
        'throws',
      ])
      await service.destroy()
    })

    it('should infer the return type of the wrapped module', async() => {
      const service = createWorkerService()
      const module = service.wrap<Module>(moduleId)
      await service.destroy()
      expectTypeOf(module).toEqualTypeOf<{
        buffer: () => Promise<Uint8Array>
        constant: () => Promise<number>
        default: (n: number) => Promise<number>
        factorial: (n: number) => Promise<number>
        factorialAsync: (n: number) => Promise<number>
        getOwnPropertyNames: () => Promise<string[]>
        getThreadId: () => Promise<number>
        rejects: () => Promise<void>
        throws: () => Promise<void>
      }>()
    })
  })

  describe.sequential('lifecycle', () => {
    it('should not initialize the worker thread', async() => {
      const service = createWorkerService()
      expect(service.worker).toBeUndefined()
      await service.destroy()
    })

    it('should terminate and return -1 when no worker is running', async() => {
      const service = createWorkerService()
      const result = await service.destroy()
      expect(service.worker).toBeUndefined()
      expect(result).toBe(-1)
      await service.destroy()
    })

    it('should terminate and return the exit code when a worker is running', async() => {
      const service = createWorkerService()
      await service.spawn({ moduleId, name: 'factorial', parameters: [5] })
      const result = await service.destroy()
      expect(service.worker).toBeUndefined()
      expect(result).toBe(1)
      await service.destroy()
    })

    it('should create the worker manually', async() => {
      const service = createWorkerService()
      await service.initialize()
      expect(service.worker).toBeDefined()
      await service.destroy()
    })

    it('should create the worker automatically', async() => {
      const service = createWorkerService({ eager: true })
      expect(service.worker).toBeDefined()
      await service.destroy()
    })

    it('should be disposable', async() => {
      const service = createWorkerService()
      await service.initialize()
      await service[Symbol.asyncDispose]()
      await new Promise(resolve => setTimeout(resolve, 10))
      expect(service.worker).toBeUndefined()
    })
  })

  describe.sequential('running', () => {
    it('should increment the running count when a function is called', async() => {
      const service = createWorkerService({ eager: true })
      expect(service.running).toBe(0)
      void service.spawn({ moduleId, name: 'factorial', parameters: [5] })
      expect(service.running).toBe(1)
      await service.destroy()
    })

    it('should decrement the running count when a function is resolved', async() => {
      const service = createWorkerService({ eager: true })
      expect(service.running).toBe(0)
      await service.spawn({ moduleId, name: 'factorial', parameters: [5] })
      expect(service.running).toBe(0)
      await service.destroy()
    })

    it('should decrement the running count when a function is rejected', async() => {
      const service = createWorkerService({ eager: true })
      expect(service.running).toBe(0)
      await service.spawn({ moduleId, name: 'rejects' }).catch(() => {})
      expect(service.running).toBe(0)
      await service.destroy()
    })
  })
})
