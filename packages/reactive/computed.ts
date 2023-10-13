import { Reactive, ReactiveFlag, ReactiveOptions, reactive } from './reactive'
import { reference } from './reference'
import { Unwrapped, unwrap } from './unwrap'
import { watch } from './watch'

/**
 * Flag for checking if a value is a computed value.
 *
 * @internal
 */
export const ComputedFlag = Symbol('Computed')

/**
 * The internal value for a computed value.
 *
 * @internal
 */
export const ComputedData = Symbol('ComputedData')

/**
 * A computed value. This is a reactive value that is computed from other
 * reactive values. The computed value will be updated when any of the
 * dependencies change.
 *
 * @template T The type of the value being computed.
 * @example ComputedObject<string> // { [ComputedFlag]: true, [ComputedData]: { dirty: boolean, value: string }, value: string }
 */
export type Computed<T = unknown> = Reactive<{
  [ComputedFlag]: true
  [ComputedData]: { dirty: boolean; value: T }
  value: T
}>

/** The computed getter function. */
export type ComputedGetter<D, T> =
  D extends Array<infer U> ? (...dependencies: Array<Unwrapped<U>>) => T
    : D extends infer U ? (dependency: Unwrapped<U>) => T
      : () => T

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
export function computed<T, D extends unknown[] = []>(dependencies: D, getter: ComputedGetter<D, T>, options: ComputedOptions = {}): Computed<T> {
  const { eager = false, immediate = false, ...reactiveOptions } = options

  // --- Create the computed value.
  const computed = reactive({
    [ComputedFlag]: true,
    [ComputedData]: { dirty: true, value: undefined },

    // --- If one of the dependencies changed, the computed value is dirty.
    // --- If so, the value will be recomputed on the next access.
    get value() {
      const data = computed[ComputedData]
      if (!eager && !data.dirty) return data.value
      data.value = getter(...dependencies.map(unwrap))
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
        value: computed[ComputedData].value,
        dirty: true,
      }

      // --- If the computed value is eager, we need to access the value
      // --- to trigger the recompute.
      // eslint-disable-next-line no-unused-expressions
      if (eager) computed.value
    })
  }

  // --- If `immediate` is set, we need to access the value to trigger the
  // --- initial computation.
  // eslint-disable-next-line no-unused-expressions
  if (immediate) computed.value

  // --- Return the computed value.
  return computed
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should create a computed value', () => {
    const a = reference(1)
    const b = reference(2)
    const sum = computed([a, b], (a, b) => a + b)
    expect (sum[ComputedFlag]).toEqual(true)
    expect (sum[ReactiveFlag]).toEqual(true)
    expect (sum.value).toEqual(3)
  })

  it('should create a computed value with no dependencies', () => {
    const sum = computed([], () => 1)
    expect (sum[ComputedFlag]).toEqual(true)
    expect (sum[ReactiveFlag]).toEqual(true)
    expect (sum.value).toEqual(1)
  })

  it('should flag the value as dirty when a dependency changes', () => {
    const a = reference(1)
    const b = reference(2)
    const sum = computed([a, b], (a, b) => a + b)
    a.value = 2
    expect (sum[ComputedData].dirty).toEqual(true)
  })

  it('should not recomputed the value when a dependency changes until accessed', () => {
    const a = reference(1)
    const b = reference(2)
    const sum = computed([a, b], (a, b) => a + b)
    a.value = 2
    expect (sum[ComputedData].dirty).toEqual(true)
    expect (sum[ComputedData].value).toEqual(undefined)
  })

  it('should recompute the value when a dependency changes if eager', () => {
    const a = reference(1)
    const b = reference(2)
    const sum = computed([a, b], (a, b) => a + b, { eager: true })
    a.value = 2
    expect (sum[ComputedData].dirty).toEqual(false)
    expect (sum[ComputedData].value).toEqual(4)
  })

  it('should compute the value immediately', () => {
    const a = reference(1)
    const b = reference(2)
    const sum = computed([a, b], (a, b) => a + b, { immediate: true })
    expect (sum[ComputedData].dirty).toEqual(false)
    expect (sum[ComputedData].value).toEqual(3)
  })

  it('should recompute the value when a dependency changes', () => {
    const a = reference(1)
    const b = reference(2)
    const sum = computed([a, b], (a, b) => a + b)
    a.value = 2
    expect (sum.value).toEqual(4)
  })
}
