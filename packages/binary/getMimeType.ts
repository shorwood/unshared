/**
 * Get the [MIME type](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types) of a `Buffer` based
 * on it's magic number or it's file extension. If the MIME type can't be determined `application/octet-stream` will be
 * returned.
 *
 * The magic number is the first few bytes of the buffer. The magic number is used to determine the file type of the
 * buffer. If the magic number is not recognized the file extension will be used to determine the MIME type.
 *
 * @param buffer The buffer to get the MIME type of.
 * @param filename The filename of the buffer.
 * @returns The MIME type.
 * @example
 *
 * const fileUrl = 'https://example.com/image.png'
 * const fileStream = fetch(fileUrl)
 * const mimeType = await getFileMime(fileStream, fileUrl)
 */
// TODO: Implement this function.
// eslint-disable-next-line unicorn/no-empty-file
