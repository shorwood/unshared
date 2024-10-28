import type { MaybeFunction, Pretty } from '@unshared/types'
import type { Ref, WatchOptions } from 'vue'
import { getCurrentInstance, ref, watch } from 'vue'

/** The options for the `useEditableProps` composable. */
export interface UseEditablePropsOptions<
  T,
  K extends keyof T = keyof T,
  D extends Partial<Pick<T, K>> = object,
> extends WatchOptions {

  /**
   * The default values for the editable properties. This can be a function
   * that returns the default values or an object with the default values.
   * If a function is provided, it will be called once to get the default
   * values.
   *
   * @default () => ({ value: 'Hello, world!' })
   */
  defaultValues?: MaybeFunction<D>

  /**
   * The name of the event to emit when a property changes.
   *
   * @default 'update:props'
   */
  eventName?: string

  /**
   * The properties to pick from the props. If not provided, all properties
   * will be picked.
   */
  pick?: K[]

  /**
   * The emit function of the component. If not provided, the emit function
   * of the current instance will be used.
   */
  emit?: (event: string, ...args: any[]) => void
}

/** The object returned by the `useEditableProps` composable. */
type EditableProps<
  T,
  K extends keyof T = keyof T,
  D extends Partial<Pick<T, K>> = object,
> = Pretty<{
  [P in K]-?: Ref<P extends keyof D ? D[P] | Exclude<T[P], undefined | void> : T[P]>
}>

/**
 * Given a set of props, creates a set of editable properties that can be
 * used to update the props of a component when they change. This composable
 * is similar to `useVModel` from `@vueuse/core`, but it is designed to only
 * emit the `update:props` event when the value of a property changes.
 *
 * @param props The props to make editable.
 * @param options The options for the editable properties.
 * @returns The editable properties.
 * @example
 * // Define the props for the component.
 * const props = defineProps<{ value: string; count: number }>()
 *
 * // When `value` or `count` changes, the `update:props` event will be emitted.
 * const { value, count } = useEditableProps(props)
 */
export function useEditableProps<
  T extends object,
  K extends keyof T = keyof T,
  D extends Partial<Pick<T, K>> = object,
>(props: T, options: UseEditablePropsOptions<T, K, D> = {}): EditableProps<T, K, D> {

  // --- Destructure the options.
  const {
    defaultValues,
    eventName = 'update:props',
    emit = getCurrentInstance()?.emit,
    pick,
    ...watchOptions
  } = options

  // --- Create the result object and get the default values.
  const references = {} as EditableProps<T>
  const defaults = typeof defaultValues === 'function' ? defaultValues() : defaultValues
  const keys = pick ?? Object.keys(props) as K[]

  // --- Create a reference for each property.
  for (const key of keys) {
    if (!keys.includes(key)) continue
    const value = props[key] ?? defaults?.[key]
    const reference = ref(value) as Ref<T[K]>

    // --- Sync inbound changes to the reference.
    watch(() => props[key], (value) => {
      reference.value = value
    }, watchOptions)

    // --- Sync outbound changes to the props.
    watch(reference, (value) => {
      if (emit) emit(eventName, key, value)
    }, watchOptions)

    // @ts-expect-error: The key is a valid property.
    references[key] = reference
  }

  // --- Return the editable properties.
  return references as EditableProps<T, K, D>
}
