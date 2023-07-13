/* eslint-disable sonarjs/no-duplicate-string */
import { Readable } from 'node:stream'

/**
 * Get the total length of a stream by reading it.
 *
 * @param stream The stream to get the length of.
 * @returns The stream with a length property.
 */
export async function streamLength(stream: Readable): Promise<number> {
  if (Readable.isReadable(stream) === false)
    throw new TypeError('Expected a stream')
  if (stream.readableEnded)
    throw new Error('Stream is already ended.')

  // --- Compute the length of the stream.
  let length = 0
  for await (const chunk of stream)
    length += chunk.length
  return length
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should get the length of a stream', async() => {
    const stream = Readable.from('Hello, world!')
    const length = await streamLength(stream)
    expect(length).toEqual(13)
  })

  it('should throw when a non-stream is passed', async() => {
    const shouldThrow = () => streamLength('Hello, world!' as any)
    expect(shouldThrow).rejects.toThrowError(TypeError)
  })

  it('should throw when the stream is already ended', async() => {
    const stream = Readable.from('Hello, world!')
    stream.destroy()
    const shouldThrow = () => streamLength(stream)
    expect(shouldThrow).rejects.toThrowError(Error)
  })
}
