import { computed } from './computed'
import { reference } from './reference'
import { timeline } from './timeline'

describe('timeline', () => {
  test('should store changes of a reactive', () => {
    const value = reference(1)
    const changes = timeline(value)
    value.value = 2
    expect(changes).toStrictEqual([1, 2])
  })

  test('should store changes of a reference', () => {
    const value = reference(1)
    const changes = timeline(value)
    value.value = 2
    expect(changes).toStrictEqual([1, 2])
  })

  test('should store changes of a computed', async() => {
    const a = reference(1)
    const b = reference(2)
    const sum = computed([a, b], (a, b) => a + b, { eager: true, immediate: true })
    const changes = timeline(sum)
    a.value = 2
    await new Promise(resolve => setTimeout(resolve, 10))
    expect(changes).toStrictEqual([3, 4])
  })

  test('should transform values', () => {
    const value = reference(1)
    const changes = timeline(value, { transform: String })
    value.value = 2
    expect(changes).toStrictEqual(['1', '2'])
  })

  test('should limit the number of changes', () => {
    const a = reference(1)
    const changes = timeline(a, { limit: 2 })
    a.value = 2
    a.value = 3
    a.value = 4
    expect(changes).toStrictEqual([3, 4])
  })

  test('should infer the type of the timeline if no transform is provided', () => {
    const value = reference(1)
    const changes = timeline(value)
    expectTypeOf(changes).toEqualTypeOf<number[]>()
  })

  test('should infer the type of the timeline if a transform is provided', () => {
    const value = reference(1)
    const changes = timeline(value, { transform: String })
    expectTypeOf(changes).toEqualTypeOf<string[]>()
  })
})
