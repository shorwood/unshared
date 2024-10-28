import { randomBytes } from 'node:crypto'
import { Readable } from 'node:stream'
import { createDeflate, createGzip } from 'node:zlib'
import { createStreamDecompress } from './createStreamDecompress'

describe('createStreamDecompress', () => {
  const buffer = randomBytes(2048)
  const expected = buffer.toString('hex')

  test('should not decompress raw data', async() => {
    const decompress = createStreamDecompress()
    const result = Readable.from(buffer).pipe(decompress)
    const chunks = await result.toArray()
    const data = Buffer.concat(chunks).toString('hex')
    expect(data).toStrictEqual(expected)
  })

  test('should decompress gzip data', async() => {
    const compress = createGzip()
    const decompress = createStreamDecompress()
    const result = Readable.from(buffer).pipe(compress).pipe(decompress)
    const chunks = await result.toArray()
    const data = Buffer.concat(chunks).toString('hex')
    expect(data).toStrictEqual(expected)
  })

  test('should decompress deflate data', async() => {
    const compress = createDeflate()
    const decompress = createStreamDecompress()
    const result = Readable.from(buffer).pipe(compress).pipe(decompress)
    const chunks = await result.toArray()
    const data = Buffer.concat(chunks).toString('hex')
    expect(data).toStrictEqual(expected)
  })
})
