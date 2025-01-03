import type { Prop, Ref } from 'vue'
import { toReactive, useVModel } from '@vueuse/core'
import { computed, getCurrentInstance } from 'vue'
import { getFileUrl } from './getFileUrl'

/** The symbol to provide the base toggle composable. */
export const BASE_INPUT_FILE_SYMBOL = Symbol()

/** The props when using the `useBaseInputFile` composable. */
export const BASE_INPUT_FILE_OPTIONS = {
  'modelValue': {},
  'onUpdate:modelValue': [Function, Array],
  'onInsert': [Function, Array],
  'multiple': Boolean,
  'accept': String,
} satisfies Record<keyof BaseInputFileOptions, Prop<unknown>>

/** The type of value that can be passed to the input. */
export type InputFiles = Array<File | string>

/** The options for the `useBaseInputFile` composable. */
export interface BaseInputFileOptions {

  /**
   * The initial value of the input. This can be a single file, an array of files,
   * or a URL. Defaults to undefined.
   *
   * @default undefined
   */
  modelValue?: InputFiles | string
  'onUpdate:modelValue'?: (value: InputFiles) => void

  /**
   * The handler to call when one or multiple files are inserted into the input.
   * This can be used to upload the files to a server or perform some other action.
   *
   * @example async(files) => await fetch('/upload', { method: 'POST', body: files })
   */
  onInsert? (files: File[]): Promise<void> | void

  /**
   * If true, the input will accept multiple files at once. Defaults to false.
   *
   * @default false
   */
  multiple?: boolean

  /**
   * A set of file types that the input will accept. This can be a comma-separated
   * list of MIME types or file extensions. If not provided, the input will accept
   * any file type.
   *
   * @default '*'
   */
  accept?: string
}

/** The composable properties returned by the `useBaseInputFile` composable. */
export interface BaseInputFileComposable {

  /** The current value of the input. */
  model: InputFiles

  /**
   * A list of URLs to the files. If the value is a file, it will be converted to a
   * URL using `URL.createObjectURL`. If the value is a string, it will be used as is.
   *
   * @example ['blob:...', 'https://example.com/image.jpg']
   */
  thumbnails: string[]

  /**
   * Open the file dialog to select a file. This will trigger the `update:modelValue`
   * event and add the selected file to the `modelValue` property.
   *
   * @example openDialog()
   */
  openDialog: () => void

  /**
   * Handle the drop event when files are dropped onto the input. This should be
   * assigned to the `onDrop` event of the HTML element containing the input.
   */
  handleDrop: (event: DragEvent) => void
}

declare module 'vue' {
  interface ComponentInternalInstance {
    [BASE_INPUT_FILE_SYMBOL]?: BaseInputFileComposable
  }
}

export function useBaseInputFile(options: BaseInputFileOptions = {}, instance = getCurrentInstance()): BaseInputFileComposable {
  if (instance?.[BASE_INPUT_FILE_SYMBOL])
    return instance[BASE_INPUT_FILE_SYMBOL]

  // --- Compute component type.
  const emit = instance?.emit
  const model = useVModel(options, 'modelValue', emit, { passive: true, defaultValue: [] }) as Ref<InputFiles>

  function handleDrop(event: DragEvent) {
    event.preventDefault()
    if (!event.dataTransfer) return
    const files = [...event.dataTransfer.files]
    if (options.multiple) return model.value.push(...files)
    else model.value = files
    if (!emit) return
    emit('insert', files)
  }

  function handleChange(event: InputEvent) {
    if (!event.target) return
    const target = event.target as HTMLInputElement
    const files = [...target.files ?? []]
    if (options.multiple) return model.value.push(...files)
    else model.value = files
    if (!emit) return
    emit('insert', files)
  }

  /**
   * Open the file dialog to select a file. This will trigger the `update:modelValue`
   * event and add the selected file to the `modelValue` property.
   *
   * @example openDialog()
   */
  function openDialog() {
    const input = document.createElement('input', { is: 'input' })
    input.setAttribute('type', 'file')
    input.setAttribute('name', options.multiple ? 'files[]' : 'file')
    input.setAttribute('accept', options.accept ?? '*')
    input.setAttribute('multiple', options.multiple ? 'multiple' : '')
    input.addEventListener('change', event => handleChange(event as InputEvent))
    input.click()
  }

  // --- List of URLs to the files.
  const thumbnails = computed(() => {
    const value = model.value
    if (!value) return []
    if (Array.isArray(value)) return value.map(value => getFileUrl(value)).filter(Boolean)
    return [getFileUrl(value)]
  })

  // --- Return useables reactive variables and methods.
  const composable = toReactive({ model, thumbnails, openDialog, handleDrop }) as BaseInputFileComposable
  if (instance) instance[BASE_INPUT_FILE_SYMBOL] = composable
  return composable
}
