import { Readable } from 'node:stream'
import { deriveStreamLength } from './deriveStreamLength'

describe('deriveStreamLength', () => {
  test('should not consume the stream chunks', async() => {
    const stream = Readable.from('Hello, world!')
    const length = deriveStreamLength()
    void stream.pipe(length)
    const chunks = await length.toArray()
    const buffer = Buffer.concat(chunks).toString('utf8')
    expect(buffer).toBe('Hello, world!')
  })

  test('should derive the length from the stream chunks', async() => {
    const stream = Readable.from('Hello, world!')
    const length = deriveStreamLength()
    void stream.pipe(length)
    await expect(length).resolves.toBe(13)
  })
})
