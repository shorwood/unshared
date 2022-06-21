import { expect, it } from 'vitest'
import { workerizeNode } from './workerizeNode'

it.todo('should wrap a function and return a promise', async() => {
  const wrapped = workerizeNode((x: number) => x + 5)
  const promise = wrapped(10)
  const result = await promise
  console.log({ promise, result })
  expect(await wrapped(10)).toEqual(15)
})
