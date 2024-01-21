/**
 * Create a Tar archive from a map of `BinaryLike` values and their relative paths
 * in the archive.
 *
 * @param entries The map of entries to add to the archive.
 * @param options The options of the archive.
 * @returns A resolvable that returns the archive stream and lazily resolves to
 * a buffer of the archive.
 * @example
 * const archive = createArchiveTar({
 *   'file.txt': 'Hello, world!',
 *   'folder/file.txt': 'Hello, world!',
 * })
 *
 * // Pipe the archive stream to a file.
 * const writeStream = fs.createWriteStream('archive.tar')
 * archive.pipe(writeStream)
 *
 * // Or get the archive buffer.
 * const buffer = await archive
 * fs.writeFileSync('archive.tar', buffer)
 */
// TODO: Implement this function.
// eslint-disable-next-line unicorn/no-empty-file
