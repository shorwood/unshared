import { PassThrough, Readable } from 'node:stream'

/**
 * Concatenates multiple streams into a single stream.
 *
 * @param streams The streams to concatenate.
 * @returns A stream that emits the chunks from the given streams.
 * @example
 * // Create multiple read streams for a file split into parts.
 * const fileParts = ['file.part1.txt', 'file.part2.txt', 'file.part3.txt']
 * const fileStreams = fileParts.map(createReadStream)
 *
 * // Concatenate the file streams into a single stream.
 * const fileStream = streamConcat(...fileStreams)
 */
export function streamConcat(...streams: Readable[]): Readable {
  const result = new PassThrough()

  // --- If there are no input streams, return an empty stream that
  // --- will end immediately to avoid returning a stream that may never end.
  if (streams.length === 0) return result.end()

  // --- Pipe the stream into the result stream one by one.
  // --- To avoid return a stream that may never end, we need to ensure
  // --- that the result stream ends when the last stream has ended.
  for (let index = 0; index < streams.length; index++)
    streams[index].pipe(result, { end: index >= streams.length - 1 })

  return result
}

/* v8 ignore start */
if (import.meta.vitest) {
  const { streamRead } = await import('./streamRead')

  it('should passthrough an empty stream', async() => {
    const stream = Readable.from('')
    const result = streamConcat(stream)
    const resultUtf8 = await streamRead(result, 'utf8')
    expect(resultUtf8).toEqual('')
  })

  it('should passthrough a single stream', async() => {
    const stream = Readable.from('Hello')
    const result = streamConcat(stream)
    const resultUtf8 = await streamRead(result, 'utf8')
    expect(resultUtf8).toEqual('Hello')
  })

  it('should concatenate three streams', async() => {
    const stream1 = Readable.from('Hello')
    const stream2 = Readable.from(' ')
    const stream3 = Readable.from('World')
    const result = streamConcat(stream1, stream2, stream3)
    const resultUtf8 = await streamRead(result, 'utf8')
    expect(resultUtf8).toEqual('Hello World')
  })

  it('should write to the array in the order given in the arguments', async() => {
    const stream1 = new PassThrough()
    const stream2 = new PassThrough()
    const streamHello = Readable.from('Hello')
    const result = streamConcat(streamHello, streamWorld)
    const resultUtf8 = await streamRead(result, 'utf8')
    expect(resultUtf8).toEqual('HelloWorld')
  })
}
