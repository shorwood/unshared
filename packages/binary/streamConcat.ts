import { PassThrough, Readable } from 'node:stream'
import { streamRead } from './streamRead'

/**
 * Concatenates multiple streams into a single stream.
 *
 * @param streams The streams to concatenate.
 * @returns A stream that emits the chunks from the given streams.
 * @example
 * const fileParts = ['file.part1.txt', 'file.part2.txt', 'file.part3.txt']
 * const fileStreams = fileParts.map(createReadStream)
 * const fileStream = concatStream(...fileStreams)
 */
export function concatStream(...streams: Readable[]): Readable {
  // --- Make sure the streams are readable.
  for (const stream of streams) {
    if (Readable.isReadable(stream) === false)
      throw new TypeError('Expected all items to be a Readable stream.')
    if (stream.readableEnded)
      throw new Error('Expected all streams to be readable.')
  }

  // --- Pipe the streams together.
  const result = new PassThrough()
  const streamLastIndex = streams.length - 1
  for (let index = 0; index < streams.length; index++)
    streams[index].pipe(result, { end: index >= streamLastIndex })

  // --- Return the concatenated stream.
  return result
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should passthrough a single stream', async() => {
    const stream = Readable.from('Hello')
    const result = concatStream(stream)
    const resultUtf8 = await streamRead(result, 'utf8')
    expect(resultUtf8).toEqual('Hello')
  })

  it('should concatenate two streams', async() => {
    const streamHello = Readable.from('Hello')
    const streamWorld = Readable.from('World')
    const result = concatStream(streamHello, streamWorld)
    const resultUtf8 = await streamRead(result, 'utf8')
    expect(resultUtf8).toEqual('HelloWorld')
  })

  it('should concatenate three streams', async() => {
    const streamHello = Readable.from('Hello')
    const streamSpace = Readable.from(' ')
    const streamWorld = Readable.from('World')
    const result = concatStream(streamHello, streamSpace, streamWorld)
    const resultUtf8 = await streamRead(result, 'utf8')
    expect(resultUtf8).toEqual('Hello World')
  })

  it('should throw if no streams are given', () => {
    const shouldThrow = () => concatStream()
    expect(shouldThrow).toThrowError('Expected at least one stream.')
  })

  it('should throw an error if one of the items is not a stream without consuming the other streams', () => {
    const stream = Readable.from('Hello')
    // @ts-expect-error: invalid argument type.
    const shouldThrow = () => concatStream(stream, 'not-stream')
    expect(shouldThrow).toThrowError(TypeError)
    expect(stream.readableEnded).toEqual(false)
  })

  it('should throw an error if one of the streams has already ended without consuming the other streams', async() => {
    const streamHello = Readable.from('Hello')
    const streamWorld = Readable.from('World')
    await streamRead(streamWorld)
    const shouldThrow = () => concatStream(streamHello, streamWorld)
    expect(shouldThrow).toThrowError(Error)
    expect(streamHello.readableEnded).toEqual(false)
  })
}
