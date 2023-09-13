import { Hash, HashOptions, createHash } from 'node:crypto'
import { Readable, Transform } from 'node:stream'
import { Awaitable } from '@unshared/functions/awaitable'
import { createStreamDerive } from './createStreamDerive'
import { streamRead } from './streamRead'

/**
 * Create a checksum from a stream of bytes without consuming the stream. This
 * function will intercept the chunks read from subsequent calls to `read()`,
 * execute the given callback, and then pass the chunks back into the stream.
 *
 * This function returns an `Awaitable` value, which means that the synchronous
 * value is the stream itself, and the asynchronous value is the value returned
 * from the callback once the stream has been consumed.
 *
 * @param algorithm The algorithm to use.
 * @param options The options to use.
 * @returns A resolvable that returns the stream and lazily resolves to the
 * derived value.
 * @example
 * const stream = fs.createReadStream('file.txt')
 * const checksum = await createStreamChecksum('sha256')
 *
 * // Pipe the stream to a file.
 * const writeStream = fs.createWriteStream('file.txt')
 * stream.pipe(writeStream)
 *
 * // Once the stream has been consumed, get the checksum of the file.
 * const checksum = await checksum // 13
 */
export function createStreamChecksum(algorithm: string, options?: HashOptions): Awaitable<Transform, Hash> {
  const hash = createHash(algorithm, options)
  return createStreamDerive(({ chunk }) => { hash.update(chunk); return hash }, hash)
}

/* c8 ignore next */
if (import.meta.vitest) {
  const valueUtf8 = 'Hello, world!'
  const valueBuffer = Buffer.from(valueUtf8, 'utf8')
  const valueSha256 = createHash('sha256').update(valueBuffer).digest('hex')
  const valueMd5 = createHash('md5').update(valueBuffer).digest('hex')

  it('should passthrough the stream chunks', async() => {
    const stream = Readable.from(valueBuffer)
    const checksum = createStreamChecksum('sha256')
    stream.pipe(checksum)
    const buffer = await streamRead(checksum, 'utf8')
    expect(buffer).toEqual(valueUtf8)
  })

  it('should derive the SHA-256 checksum from the stream chunks', async() => {
    const stream = Readable.from(valueBuffer)
    const checksum = createStreamChecksum('sha256')
    stream.pipe(checksum)
    const sha256 = await checksum.then(hash => hash.digest('hex'))
    expect(sha256).toEqual(valueSha256)
  })

  it('should derive the MD5 checksum from the stream chunks', async() => {
    const stream = Readable.from(valueBuffer)
    const checksum = createStreamChecksum('md5')
    stream.pipe(checksum)
    const md5 = await checksum.then(hash => hash.digest('hex'))
    expect(md5).toEqual(valueMd5)
  })
}
