/**
 * Extracts the content of a Tar archive into a map of `BinaryLike` values and their
 * relative paths in the archive. The archive can be any binary-like value, including
 * strings, buffers, streams, and more.
 *
 * This function returns an awaitable that synchronously returns an `AsyncIterable` of
 * the entries in the archive. The entries are lazily extracted from the archive as
 * they are iterated over. The result is also awaitable, and will resolve to a map of
 * file paths to binary-like contents.
 *
 * @param archive The Tar archive to extract.
 * @param options The options to use.
 * @returns A map of file paths to binary-like contents.
 * @example
 * const readStream = fs.createReadStream('archive.tar')
 * const entries = extractArchiveTar(readStream)
 *
 * // Iterate over the entries.
 * for await (const [path, content] of entries) {}
 *
 * // Or get the entries map.
 * const map = await entries // { ... }
 */
// TODO: Implement this function.
// eslint-disable-next-line unicorn/no-empty-file
