import type { WorkerServicePayload } from './createWorkerService'
import { createRequire } from 'node:module'
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

/* v8 ignore next */
if (import.meta.vitest) {
  test('should call a named function from a built-in module and return the result', async() => {
    const result = await callback({ moduleId: 'node:util', name: 'format', parameters: ['Hello', 'World!'] })
    expect(result).toBe('Hello World!')
  })

  test('should call a named sync function from a local module and return the result', async() => {
    const result = await callback({ moduleId: './__fixtures__/module', name: 'factorial', parameters: [10] })
    expect(result).toBe(3628800)
  })

  test('should call a named async function from a local module and return the resolved value', async() => {
    const result = await callback({ moduleId: './__fixtures__/module', name: 'factorialAsync', parameters: [10] })
    expect(result).toBe(3628800)
  })

  test('should default to the default export if no name is provided', async() => {
    const result = await callback({ moduleId: './__fixtures__/module', parameters: [10] })
    expect(result).toBe(3628800)
  })

  test('should throw an error if the named export does not exist', async() => {
    const shouldReject = callback({ moduleId: './__fixtures__/module', name: 'doesNotExist' })
    await expect(shouldReject).rejects.toThrow(/The module ".+?" does not have the named export "doesNotExist"/)
  })

  test('should throw an error if the module does not exist', async() => {
    const shouldReject = callback({ moduleId: './__fixtures__/doesNotExist' })
    await expect(shouldReject).rejects.toThrow(/Cannot find module '.+?'/)
  })

  test('should throw an error if the module throws', async() => {
    const shouldReject = callback({ moduleId: './__fixtures__/module', name: 'throws' })
    await expect(shouldReject).rejects.toThrow(SyntaxError)
    await expect(shouldReject).rejects.toThrow('Thrown')
  })

  test('should throw an error if the module rejects', async() => {
    const shouldReject = callback({ moduleId: './__fixtures__/module', name: 'rejects' })
    await expect(shouldReject).rejects.toThrow(SyntaxError)
    await expect(shouldReject).rejects.toThrow('Rejected')
  })

  test('should return the own property names of the module', async() => {
    const result = await callback({ moduleId: './__fixtures__/module', name: 'getOwnPropertyNames' })
    expect(result).toMatchObject([
      'factorial',
      'factorialAsync',
      'throws',
      'rejects',
      'buffer',
      'getThreadId',
      'constant',
      'default',
    ])
  })
}
