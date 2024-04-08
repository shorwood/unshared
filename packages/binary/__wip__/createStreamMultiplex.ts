import { PassThrough, Readable } from 'node:stream'

export interface Multiplex extends Readable {
  /**
   * A map of streams to their chunk sizes and total lengths. This property is
   * used when demultiplexing the stream.
   *
   * @example [[32, 1024], [16, 256]]
   */
  readonly offsets: Array<[number, number]>
}

/**
 * Multiplexes a stream into multiple streams.
 *
 * @param streams The streams to multiplex.
 * @returns A stream that interleaves the data from the original streams.
 */
// export function streamMultiplex(...streams: Readable[]): Multiplex {
//   if (streams.length === 0)
//     throw new Error('No streams were provided.')
//   for (const stream of streams) {
//     if (stream instanceof Readable === false)
//       throw new TypeError('Expected a Readable stream.')
//     if (stream.readableEnded)
//       throw new Error('Readable has already ended.')
//   }

//   // --- Create a new stream and set the offsets from the streams' high water marks.
//   const multiplex = new PassThrough()
//   const entries = streams.map((stream, index) => ({
//     stream,
//     index,
//     length: 0,
//     chunkSize: stream.readableHighWaterMark,
//   }))

//   for (const entry of entries) {
//     const { stream, index, chunkSize } =
