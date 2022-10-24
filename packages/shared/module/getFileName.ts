/**
 * Get the file name of an absolute path without the extension.
 * @param path The absolute path.
 * @returns The file name.
 * @example
 * getFileName('/path/to/file.js') // returns 'file'
 */
export const getFileName = (path: string): string => {
  if (typeof path !== 'string') throw new TypeError('Path must be a string')

  // --- Get the file name.
  const fileNameExtension = path.match(/[^/\\]+$/)?.[0]
  if (!fileNameExtension) throw new Error('File name not found')

  // --- Remove the extension.
  const fileName = fileNameExtension.split('.').shift()
  if (!fileName) throw new Error('File name not found')

  // --- Return the file name.
  return fileName
}
