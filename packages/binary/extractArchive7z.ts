/**
 * Extracts the content of a 7z archive into a map of `BinaryLike` values and their
 * relative paths in the archive. The archive can be any binary-like value, including
 * strings, buffers, streams, and more.
 *
 * This function returns an awaitable that synchronously returns an `AsyncIterable` of
 * the entries in the archive. The entries are lazily extracted from the archive as
 * they are iterated over. The result is also awaitable, and will resolve to a map of
 * file paths to binary-like contents.
 *
 * @param archive The 7z archive to extract.
 * @param options The options to use.
 * @returns A map of file paths to binary-like contents.
 * @example
 * const readStream = fs.createReadStream('archive.7z')
 * const entries = extractArchive7z(readStream)
 *
 * // Iterate over the entries.
 * for await (const [path, content] of entries) {}
 *
 * // Or get the entries map.
 * const map = await entries // { ... }
 */
// TODO: Implement this function.
// eslint-disable-next-line unicorn/no-empty-file
