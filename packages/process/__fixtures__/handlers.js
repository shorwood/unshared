import { Buffer } from 'node:buffer'
import { threadId } from 'node:worker_threads'
import { workerRegister } from '../dist/workerRegister.js'

workerRegister('factorial', (/** @type {number} */ n) => {
  let result = 1
  for (let index = 2; index <= n; index++) result *= index
  return result
})

workerRegister('factorialAsync', (/** @type {number} */ n) => {
  let result = 1
  for (let index = 2; index <= n; index++) result *= index
  return Promise.resolve(result)
})

workerRegister('throws', () => {
  throw new SyntaxError('Thrown')
})

workerRegister('rejects', () => {
  const error = new SyntaxError('Rejected')
  return Promise.reject(error)
})

workerRegister('buffer', () => {
  const string = 'Hello, World!'
  return Buffer.from(string)
})

workerRegister('threadId', () => threadId)
