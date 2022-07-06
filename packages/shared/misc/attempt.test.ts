import { expect, it } from 'vitest'
import { attempt } from './attempt'

const failingFunction = () => { throw new Error('I am failing') }
const failingAsyncFunction = async() => { throw new Error('I am failing asyncrhonously') }
const validFunction = () => 'I am valid'
const validAsyncFunction = async() => 'I am valid asynchronously'

it('returns value and error for a failing sync function', async() => {
  const [result, error] = await attempt(failingFunction)
  expect(result).toBe(undefined)
  expect(error).toBeInstanceOf(Error)
  expect(error!.message).toEqual('I am failing')
})

it('returns value and error for a failing async function', async() => {
  const [result, error] = await attempt(failingAsyncFunction)
  expect(result).toBe(undefined)
  expect(error).toBeInstanceOf(Error)
  expect(error!.message).toEqual('I am failing asyncrhonously')
})

it('returns value and undefined for a valid sync function', async() => {
  const [result, error] = await attempt(validFunction)
  expect(result).toEqual('I am valid')
  expect(error).toBe(undefined)
})

it('returns value and undefined for a valid async function', async() => {
  const [result, error] = await attempt(validAsyncFunction)
  expect(result).toEqual('I am valid asynchronously')
  expect(error).toBe(undefined)
})
