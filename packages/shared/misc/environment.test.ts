import { expect, it } from 'vitest'
import { environment, getEnvironmentVariable, isCli, isDevelopment, isNode, isProduction, isStrictMode, isWebWorker } from './environment'

it('environment should return the environment variables', async() => {
  expect(environment).toEqual(process.env)
})

it('getEnvironmentVariable should return a specific environment variable', async() => {
  expect(getEnvironmentVariable('PWD')).toEqual(process.env.PWD)
})

it('isDevelopment should return true if environment.DEV is set', () => {
  expect(isDevelopment).toBeTypeOf('boolean')
})

it('isProduction should return true if environment.NODE_ENV is "production"', () => {
  expect(isProduction).toBeTypeOf('boolean')
})

it('isNode should return true if process and process.versions.node are defined', () => {
  expect(isNode).toBe(true)
})

it('isWebWorker should return true if self is a DedicatedWorkerGlobalScope', () => {
  expect(isWebWorker).toBe(false)
})

it('isCli should return true if process.argv has length > 0', () => {
  expect(isCli).toBe(true)
})

it('isStrictMode() should return true if current runtime is in strict mode', () => {
  expect(isStrictMode).toEqual(true)
})
