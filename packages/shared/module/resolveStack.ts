/**
 * Resolve the file paths of the stack frames.
 * @example
 * resolveStack() // ['/home/user/project/index.js', '/home/user/project/foo.js']
 */
export const resolveStack = () =>
  new Error('_')?.stack
    ?.match(/(?:file:\/\/)?(\/.*)\.\w+/g)
    ?.map(file => file.replace('file://', '')) || []
