import { expect, it } from 'vitest'
import { isCli, isNode, isWebWorker } from './runtime'

it('isNode should return true if process and process.versions.node are defined', () => {
  expect(isNode).toEqual(true)
})

it('isWebWorker should return true if self is a DedicatedWorkerGlobalScope', () => {
  expect(isWebWorker).toEqual(false)
})

it('isCli should return true if process.argv has length > 0', () => {
  expect(isCli).toEqual(true)
})
