/**
 * Demultiplexes a stream into multiple streams.
 *
 * @param stream The stream to demultiplex.
 * @returns An array of streams that are interleaved from the original streams.
 */
export function streamDemultiplex(stream: Readable): Readable[] {
  const { PassThrough } = require('node:stream') as typeof import('node:stream')
  const demultiplex = new PassThrough()
  const streams: Readable[] = []
  let streamIndex = 0
  stream.on('data', (chunk) => {
    if (streamIndex >= streams.length)
      streams.push(new PassThrough())

    streams[streamIndex].write(chunk)
    streamIndex++
  })
  stream.on('end', () => {
    for (const stream of streams)
      stream.end()
  })
  stream.on('error', (error) => {
    for (const stream of streams)
      stream.emit('error', error)
  })
  return streams
}
