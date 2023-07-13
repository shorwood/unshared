import { Reactive, reactive } from './reactive'
import { reference } from './reference'
import { Unwraped, unwrap } from './unwrap'
import { watch } from './watch'

/** Flag for checking if a value is a computed value. */
export const ComputedFlag = Symbol('Computed')

/** The internal value for a computed value. */
export const ComputedData = Symbol('ComputedData')

/** A computed value. */
export type Computed<T = unknown> = Reactive<{
  [ComputedFlag]: true
  [ComputedData]: { dirty: boolean; value: T }
  value: T
}>

/** The computed getter function. */
export type ComputedGetter<T, D extends Reactive[]> =
  D extends (infer U)[]
    ? (...dependencies: Unwraped<U>[]) => T
    : () => T

/**
 * Create a reactive computed value. The computed value will be updated when
 * any of the dependencies change.
 *
 * @param getter The getter function for the computed value.
 * @param dependencies The dependencies for the computed value.
 * @returns The reactive computed value.
 * @example
 * const a = reference(1)
 * const b = reference(2)
 * const sum = computed(() => a.value + b.value)
 */
export function computed<T, D extends Reactive[]>(getter: ComputedGetter<T, D>, ...dependencies: D): Computed<T> {
  // --- Create the computed value.
  const computed = reactive({
    [ComputedFlag]: true,
    [ComputedData]: { dirty: true, value: undefined },
    get value() {
      if (this[ComputedData].dirty) {
        this[ComputedData].value = getter(...dependencies.map(unwrap))
        this[ComputedData].dirty = false
      }
      return this[ComputedData].value
    },
  })

  // --- Watch dependencies for changes.
  for (const dependency of dependencies) {
    watch(dependency, () => {
      computed[ComputedData].dirty = true
    })
  }

  return computed as Computed<T>
}

/** c8 ignore next */
if (import.meta.vitest) {
  it('should create a computed value', () => {
    const a = reference(1)
    const b = reference(2)
    const sum = computed((a, b) => a + b, a, b)
    expect(sum.value).toEqual(3)
    a.value = 2
    expect(sum.value).toEqual(4)
  })
}
