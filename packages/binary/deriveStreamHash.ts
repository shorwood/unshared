import { Hash, HashOptions, createHash } from 'node:crypto'
import { Transform } from 'node:stream'
import { Awaitable } from '@unshared/functions/awaitable'
import { deriveStream } from './deriveStream'

/**
 * Computes the hash of a stream of bytes without consuming the stream. This
 * function will intercept the chunks read from subsequent calls to `read()`,
 * update the hash with the chunk, and then pass the chunks back into the stream.
 *
 * This function returns an `Awaitable` value, which means that the synchronous
 * value is the `Derive` stream itself, and the asynchronous value is the final
 * `Hash` object once the stream has been consumed by an external stream.
 *
 * @param algorithm The algorithm to use.
 * @param options The options to use.
 * @returns A resolvable stream that resolves to the hash of the stream.
 * @example
 * // Pipe the `request.body` to a file.
 * const writeStream = fs.createWriteStream('file.copy.txt')
 * const checksum = await deriveStreamHash('sha256')
 * request.body.pipe(checksum).pipe(writeStream)
 *
 * // Once the hash has been computed, store it in a file.
 * await checksum // Hash { ... }
 * await writeFileSync('file.sha256.txt', checksum.digest('hex'))
 */
export function deriveStreamHash(algorithm: string, options?: HashOptions): Awaitable<Transform, Hash> {
  const hash = createHash(algorithm, options)
  return deriveStream(({ chunk }) => { hash.update(chunk); return hash }, hash)
}

/* c8 ignore next */
if (import.meta.vitest) {
  const valueUtf8 = 'Hello, world!'
  const valueBuffer = Buffer.from(valueUtf8, 'utf8')
  const valueSha256 = createHash('sha256').update(valueBuffer).digest('hex')
  const { Readable } = await import('node:stream')
  const { streamRead } = await import('./streamRead')

  it('should not consume the stream chunks', async() => {
    const stream = Readable.from(valueBuffer)
    const checksum = deriveStreamHash('sha256')
    stream.pipe(checksum)
    const buffer = await streamRead(checksum, 'utf8')
    expect(buffer).toEqual(valueUtf8)
  })

  it('should derive the SHA-256 checksum from the stream chunks', async() => {
    const stream = Readable.from(valueBuffer)
    const checksum = deriveStreamHash('sha256')
    stream.pipe(checksum)
    const sha256 = await checksum.then(hash => hash.digest('hex'))
    expect(sha256).toEqual(valueSha256)
  })
}
