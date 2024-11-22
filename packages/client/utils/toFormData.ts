import type { FormDataLike } from './isFormDataLike'

/**
 * Casts an object that may contain `Blob`, `File`, or `FileList` values to a `FormData` object.
 *
 * @param object The object to cast to a `FormData` object.
 * @returns The `FormData` object.
 */
export function toFormData(object: FormDataLike): FormData {
  if (object instanceof FormData) return object
  const formData = new FormData()
  for (const key in object) {
    const value = object[key]
    if (value === undefined) continue
    if (Array.isArray(value)) {
      for (const item of value)
        formData.append(key, item as Blob | string)
    }
    else {
      formData.append(key, value as Blob | string)
    }
  }
  return formData
}
