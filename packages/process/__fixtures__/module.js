/* eslint-disable jsdoc/no-types */
import { threadId } from 'node:worker_threads'

/**
 * @param {number} n The number to calculate the factorial
 * @returns {number} The factorial of the number
 */
export function factorial(n) {
  let result = 1
  for (let index = 2; index <= n; index++) result *= index
  return result
}

/**
 * @param {number} n The number to calculate the factorial
 * @returns {Promise<number>} A promise that resolves with the factorial of the number
 */
export function factorialAsync(n) {
  return Promise.resolve(factorial(n))
}

/**
 * @returns {void} Throws a syntax error
 */
export function throws() {
  throw new SyntaxError('Thrown')
}

/**
 * @returns {Promise<void>} A promise that rejects with a syntax error
 */
export function rejects() {
  const error = new SyntaxError('Rejected')
  return Promise.reject(error)
}

/**
 * @returns {Uint8Array} A buffer with the string 'Hello, World!'
 */
export function buffer() {
  const string = 'Hello, World!'
  return Uint8Array.from(Buffer.from(string))
}

/**
 * @returns {number} The thread id
 */
export function getThreadId() {
  return threadId
}

/** @type {number} */
export const constant = 42

export default factorial
