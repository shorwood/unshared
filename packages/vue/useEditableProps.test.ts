import type { Ref } from 'vue'
import { isRef, nextTick } from 'vue'
import { useEditableProps } from './useEditableProps'

describe('useEditableProps', () => {
  test('should create editable properties out of an object', () => {
    const props = { value: 'hello', count: 0 }
    const result = useEditableProps(props)
    expect(isRef(result.value)).toBe(true)
    expect(isRef(result.count)).toBe(true)
    expect(result.value.value).toBe('hello')
    expect(result.count.value).toBe(0)
    expectTypeOf(result).toEqualTypeOf<{ value: Ref<string>; count: Ref<number> }>()
  })

  test('should pick only the specified properties', () => {
    const props = { value: 'hello', count: 0 }
    const result = useEditableProps(props, { pick: ['value'] })
    expect(result.value).toBeDefined()
    // @ts-expect-error: The property is not defined.
    expect(result.count).toBeUndefined()
    expectTypeOf(result).toEqualTypeOf<{ value: Ref<string> }>()
  })

  test('should use default values when provided', () => {
    const props = { value: undefined, count: 0 } as { value?: string; count?: number }
    const result = useEditableProps(props, { defaultValues: { value: 'world' } })
    expect(result.value.value).toBe('world')
    expect(result.count.value).toBe(0)
    expectTypeOf(result).toEqualTypeOf<{ value: Ref<string>; count: Ref<number | undefined> }>()
  })

  test('should emit an event when a property changes', async() => {
    const props = { value: 'hello', count: 0 }
    const emit = vi.fn()
    const result = useEditableProps(props, { emit })
    result.value.value = 'world'
    await nextTick()
    expect(emit).toHaveBeenCalledWith('update:props', 'value', 'world')
  })

  test('should emit an custom event when a property changes', async() => {
    const props = { value: 'hello', count: 0 }
    const emit = vi.fn()
    const result = useEditableProps(props, { emit, eventName: 'change' })
    result.value.value = 'world'
    await nextTick()
    expect(emit).toHaveBeenCalledWith('change', 'value', 'world')
  })
})
