/* eslint-disable antfu/no-import-dist */
import { threadId } from 'node:worker_threads'
import { workerRegister } from '../dist/workerRegister.js'

workerRegister('default', () => 'DEFAULT')

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
  return Uint8Array.from(Buffer.from(string))
})

workerRegister('messageReceive', (/** @type {MessagePort} */ port) =>
  new Promise((resolve) => {
    port.addEventListener('message', message => resolve(message.data))
  }))

workerRegister('messageSend', (/** @type {MessagePort} */ port) => {
  port.postMessage('Hello, World!')
})

workerRegister('messageEcho', (/** @type {MessagePort} */ port) =>
  new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error('Timeout')), 1000)
    port.addEventListener('message', (message) => {
      process.stdout.write('messageEcho: ')
      port.postMessage(`Echo: ${message.data}`)
      resolve(`Echo: ${message.data}`)
    })
  }))

workerRegister('getThreadId', () => threadId)
