/**
 * A type that represents a FormData-like object, which is a plain object with
 * nested Blob, File, or FileList values. Or a FormData instance.
 */
export type FormDataLike = FormData | Record<string, Blob | File | FileList>

/**
 * Predicate to check if a value is FormData-like, meaning it is a plain object
 * with nested Blob, File, or FileList values.
 *
 * @param value The value to check.
 * @returns `true` if the value is FormData-like, `false` otherwise.
 * @example isFormDataLike({ file: new File(['test'], 'test.txt') }) // true
 */
export function isFormDataLike(value: unknown): value is FormDataLike {
  if (typeof value !== 'object' || value === null) return false
  if (value instanceof FormData) return true
  const values = Object.values(value)
  if (values.length === 0) return false
  return values.every((x) => {
    if (x instanceof File) return true
    if (Array.isArray(x)) return x.every(item => item instanceof File)
    return x instanceof Blob
  })
}
