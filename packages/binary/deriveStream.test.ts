import { Readable } from 'node:stream'
import { Derive, deriveStream } from './deriveStream'

describe('deriveStream', () => {
  test('should synchroneously return the initial stream value', () => {
    const result = deriveStream(({ value }) => value, 42)
    expect(result).toBeInstanceOf(Derive)
  })

  test('should derive a value from the stream chunks', async() => {
    const stream = Readable.from('Hello, world!')
    const result = deriveStream(({ chunk, value }) => value + chunk.length, 0)
    void stream.pipe(result)
    const length = await result
    expect(length).toBe(13)
  })

  test('should not consume the stream chunks', async() => {
    const stream = Readable.from('Hello, world!')
    const result = deriveStream(({ chunk, value }) => value + chunk.length, 0)
    void stream.pipe(result)
    const chunks = await result.toArray()
    const buffer = Buffer.concat(chunks).toString('utf8')
    expect(buffer).toBe('Hello, world!')
  })
})
