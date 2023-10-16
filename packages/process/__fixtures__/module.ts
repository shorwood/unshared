import { threadId } from 'node:worker_threads'

export function factorial(n: number): number {
  let result = 1
  for (let index = 2; index <= n; index++) result *= index
  return result
}

export function throws() {
  throw new SyntaxError('test')
}

export function rejects() {
  const error = new SyntaxError('test')
  return Promise.reject(error)
}

export function buffer() {
  const string = 'Hello, World!'
  return Buffer.from(string)
}

export function getThreadId() {
  return threadId
}
