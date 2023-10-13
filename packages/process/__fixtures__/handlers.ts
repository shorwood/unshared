import { threadId } from 'node:worker_threads'
import { workerRegister } from '../workerRegister'

workerRegister('factorial', (n: number): number => {
  let result = 1
  for (let index = 2; index <= n; index++) result *= index
  return result
})

workerRegister('throws', () => {
  throw new SyntaxError('test')
})

workerRegister('rejects', () => {
  const error = new SyntaxError('test')
  return Promise.reject(error)
})

workerRegister('buffer', () => {
  const string = 'Hello, World!'
  return Buffer.from(string)
})

workerRegister('threadId', () => threadId)
