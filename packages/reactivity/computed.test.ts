import { computed } from './computed'
import { ComputedData, ComputedFlag, ReactiveFlag } from './constants'
import { reactive } from './reactive'
import { reference } from './reference'

describe('computed', () => {
  test('should create a computed value', () => {
    const a = reference(1)
    const b = reference(2)
    const sum = computed([a, b], (a, b) => a + b)
    expect(sum[ComputedFlag]).toBe(true)
    expect(sum[ReactiveFlag]).toBe(true)
    expect(sum.value).toBe(3)
  })

  test('should create a computed value with no dependencies', () => {
    const sum = computed([], () => 1)
    expect(sum[ComputedFlag]).toBe(true)
    expect(sum[ReactiveFlag]).toBe(true)
    expect(sum.value).toBe(1)
  })

  test('should flag the value as dirty when a reactive dependency changes', () => {
    const a = reactive({ foo: 1 })
    const b = reactive({ bar: 2 })
    const sum = computed([a, b] as const, (a, b) => a.foo + b.bar)
    a.foo = 2
    expect(sum[ComputedData].dirty).toBe(true)
  })

  test('should flag the value as dirty when a reference dependency changes', () => {
    const a = reference(1)
    const b = reference(2)
    const sum = computed([a, b], (a, b) => a + b)
    a.value = 2
    expect(sum[ComputedData].dirty).toBe(true)
  })

  test('should flag the value as dirty when a computed dependency changes', () => {
    const a = reference(1)
    const b = reference(2)
    const sum = computed([a, b], (a, b) => a + b)
    const double = computed([sum], sum => sum * 2)
    a.value = 2
    expect(double[ComputedData].dirty).toBe(true)
  })

  test('should not recomputed the value when a dependency changes until accessed', () => {
    const a = reference(1)
    const b = reference(2)
    const sum = computed([a, b], (a, b) => a + b)
    a.value = 2
    expect(sum[ComputedData].dirty).toBe(true)
    expect(sum[ComputedData].value).toBeUndefined()
  })

  test('should recompute the value when a dependency changes if eager', () => {
    const a = reference(1)
    const b = reference(2)
    const sum = computed([a, b], (a, b) => a + b, { eager: true })
    a.value = 2
    expect(sum[ComputedData].dirty).toBe(false)
    expect(sum[ComputedData].value).toBe(4)
  })

  test('should compute the value immediately', () => {
    const a = reference(1)
    const b = reference(2)
    const sum = computed([a, b], (a, b) => a + b, { immediate: true })
    expect(sum[ComputedData].dirty).toBe(false)
    expect(sum[ComputedData].value).toBe(3)
  })

  test('should recompute the value when a dependency changes', () => {
    const a = reference(1)
    const b = reference(2)
    const sum = computed([a, b], (a, b) => a + b)
    a.value = 2
    expect(sum.value).toBe(4)
  })
})
