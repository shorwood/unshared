import { ref } from 'vue'
import { ready } from './ready'

describe('ready', () => {
  test('should create a promise that resolves once the ref is equal to truthy', async() => {
    const reference = ref<boolean>()
    const promise = ready(reference)
    expect(promise).toBeInstanceOf(Promise)
    reference.value = true
    await expect(promise).resolves.toBe(true)
    expectTypeOf(promise).toEqualTypeOf<Promise<boolean | undefined>>()
  })

  test('should create a promise that resolves once the ref is equal to the value', async() => {
    const reference = ref('NOT READY')
    const promise = ready(reference, 'READY')
    expect(promise).toBeInstanceOf(Promise)
    reference.value = 'READY'
    await expect(promise).resolves.toBe('READY')
    expectTypeOf(promise).toEqualTypeOf<Promise<string>>()
  })

  test('should create a promise that resolves once the condition is met', async() => {
    const reference = ref(0)
    const promise = ready(reference, value => value === 5)
    expect(promise).toBeInstanceOf(Promise)
    reference.value = 5
    await expect(promise).resolves.toBe(5)
    expectTypeOf(promise).toEqualTypeOf<Promise<number>>()
  })
})
