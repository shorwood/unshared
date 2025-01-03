import type { Reactive, ReactiveOptions } from './reactive'
import type { Unwrapped } from './unwrap'
import { ComputedData, ComputedFlag } from './constants'
import { reactive } from './reactive'
import { unwrap } from './unwrap'
import { watch } from './watch'

/**
 * A computed value. This is a reactive value that is computed from other
 * reactive values. The computed value will be updated when any of the
 * dependencies change.
 *
 * @template T The type of the value being computed.
 * @example ComputedObject<string> // { [ComputedFlag]: true, [ComputedData]: { dirty: boolean, value: string }, value: string }
 */
export type Computed<T = unknown> = Reactive<{
  [ComputedData]: { dirty: boolean; value: T }
  [ComputedFlag]: true
  value: T
}>

/** The computed getter function. */
export type ComputedGetter<U, T> =
  U extends readonly unknown[]
    ? (...parameters: { [K in keyof U]: Unwrapped<U[K]> }) => T
    : never

/** The options for creating a computed value. */
export interface ComputedOptions extends ReactiveOptions {

  /**
   * The computed value will be evaluated eagerly. This means that the computed
   * value will be evaluated every time one of the dependencies changes. If you
   * don't specify this option, the computed value will be evaluated lazily.
   *
   * Be careful when using this option, as it can lead to performance issues since
   * the computed value will be evaluated more often.
   *
   * @default false
   */
  eager?: boolean

  /**
   * The computed value will be evaluated upon creation. This is useful if the
   * computation is time consuming and you want to avoid a delay when accessing
   * the computed value for the first time.
   *
   * @default false
   */
  immediate?: boolean
}

/**
 * Create a reactive computed value. The computed value will be updated when
 * any of the dependencies change.
 *
 * @param dependencies The dependencies for the computed value.
 * @param getter The getter function for the computed value.
 * @param options The options for the computed value.
 * @returns The reactive computed value.
 * @example
 * const a = reference(1)
 * const b = reference(2)
 * const sum = computed(() => a.value + b.value)
 */
export function computed<T, D extends readonly Reactive[] = []>(dependencies: D, getter: ComputedGetter<D, T>, options: ComputedOptions = {}): Computed<T> {
  const { eager = false, immediate = false, ...reactiveOptions } = options

  // --- Create the computed value.
  const computed = reactive({
    [ComputedData]: { dirty: true, value: undefined },
    [ComputedFlag]: true,

    // --- If one of the dependencies changed, the computed value is dirty.
    // --- If so, the value will be recomputed on the next access.
    get value() {
      const data = computed[ComputedData]
      if (!eager && !data.dirty) return data.value
      data.value = getter(...dependencies.map(value => unwrap(value) as unknown))
      data.dirty = false
      return data.value
    },
  }, reactiveOptions) as Computed<T>

  // --- Start watching dependencies for changes. Once a dependency changes,
  // --- the computed value will be marked as dirty. This will trigger a
  // --- recompute on the next access.
  for (const dependency of dependencies) {
    watch(dependency, () => {
      computed[ComputedData] = {
        dirty: true,
        value: computed[ComputedData].value,
      }

      // --- If the computed value is eager, we need to access the value
      // --- to trigger the recompute.
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      if (eager) computed.value
    })
  }

  // --- If `immediate` is set, we need to access the value to trigger the
  // --- initial computation.
  // eslint-disable-next-line @typescript-eslint/no-unused-expressions
  if (immediate) computed.value

  // --- Return the computed value.
  return computed
}
