import { computed, isRef, ref, unref } from 'vue-demi'
import { MaybeRef } from '../utils'

type UseFileInputValue = Array<string | File> | string | File | undefined

interface UseFileInputOptions {
  /** Sets or retrieves the Boolean value indicating whether multiple items can be selected from a list. */
  multiple?: HTMLInputElement['multiple']
  /** Sets or retrieves a comma-separated list of content types. */
  accept?: HTMLInputElement['accept']
  /** Upload method that must return an URL. */
  upload?: (file: File) => Promise<string>
}

// --- Utility to get file as URL.
const getThumbnail = (item: File | string): string =>
  ((item instanceof File)
    ? URL.createObjectURL(item)
    : item)

export const useInputFile = (
  initialValue: MaybeRef<UseFileInputValue>,
  options = {} as MaybeRef<UseFileInputOptions>,
) => {
  // --- Initialize file array reference.
  const files = isRef(initialValue) ? initialValue : ref(initialValue)

  // --- Set or concat.
  const add = async(fileList: FileList, _options = options as MaybeRef<UseFileInputOptions>) => {
    // --- Unref and destructure options.
    const { upload } = unref(_options)

    // --- Cast FileList to Array.
    let fileArray: Array<File | string> = []
    for (let index = 0; index < fileList.length; index++)
      fileArray.push(fileList.item(index) as File)

    // --- Upload files using the provided utility.
    fileArray = upload
      ? await Promise.all((fileArray as File[]).map(upload))
      : fileArray

    files.value = (Array.isArray(files.value))
      ? [...files.value, ...fileArray]
      : fileArray[0]
  }

  // --- Remove at index.
  const remove = (index: number): UseFileInputValue => files.value = (Array.isArray(files.value))
    ? files.value.filter((v, k) => k !== index)
    : undefined

  // --- Ask user for  files.
  const prompt = (_options = options as MaybeRef<UseFileInputOptions>) => {
    // --- Unref and destructure options.
    const { multiple, accept } = unref(_options)

    // --- Create and configure input.
    const input = document.createElement('input')
    input.type = 'file'
    if (accept) input.accept = accept
    if (multiple) input.multiple = multiple

    // @ts-expect-error --- Add handler and show native file explorer.
    input.addEventListener('change', (event: Event) => add(event.target.files))
    input.click()
  }

  // --- Computed function to get all thumbnails.
  const thumbnails = computed((): string[] =>
    (Array.isArray(files.value)
      ? files.value?.map(getThumbnail)
      : [getThumbnail(files.value as any)]),
  )

  // --- Computed function to get the first thumbnail.
  const thumbnail = computed(() => thumbnails.value?.unshift())

  // --- Return useables reactive variables and methods.
  return { files, thumbnails, thumbnail, prompt, add, remove }
}
