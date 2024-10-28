import { resolve } from './resolve'

describe('resolve', () => {
  test('should return the value directly', async() => {
    const value = await resolve('Hello, World!')
    expect(value).toBe('Hello, World!')
  })

  test('should return the value by awaiting the promise', async() => {
    const contained = Promise.resolve('Hello, World!')
    const value = await resolve(contained)
    expect(value).toBe('Hello, World!')
  })

  test('should return the value by calling the function', async() => {
    const contained = () => 'Hello, World!'
    const value = await resolve(contained)
    expect(value).toBe('Hello, World!')
  })

  test('should return the value by calling the function and awaiting the promise', async() => {
    const contained = () => Promise.resolve('Hello, World!')
    const value = await resolve(contained)
    expect(value).toBe('Hello, World!')
  })

  test('should return the value by calling the function with arguments', async() => {
    const contained = (name: string) => `Hello, ${name}!`
    const value = await resolve(contained, 'World')
    expect(value).toBe('Hello, World!')
  })
})
