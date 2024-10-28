import { createCounter } from './createCounter'

describe('createCounter', () => {
  test('should create a Counter instance', () => {
    const counter = createCounter()
    expect(counter.value).toBe(0)
  })

  test('should increment the counter', () => {
    const counter = createCounter()
    const result = counter.increment()
    expect(result).toBe(1)
    expect(counter.value).toBe(1)
  })

  test('should decrement the counter', () => {
    const counter = createCounter()
    const result = counter.decrement()
    expect(result).toBe(-1)
    expect(counter.value).toBe(-1)
  })

  test('should create a counter with a custom initial value', () => {
    const counter = createCounter(10)
    expect(counter.value).toBe(10)
  })

  test('should create a counter with a custom step', () => {
    const counter = createCounter(0, 10)
    const result = counter.increment()
    expect(result).toBe(10)
    expect(counter.value).toBe(10)
  })

  test('should increment the counter by a custom step', () => {
    const counter = createCounter(0, 10)
    const result = counter.increment(20)
    expect(result).toBe(20)
    expect(counter.value).toBe(20)
  })

  test('should decrement the counter by a custom step', () => {
    const counter = createCounter(0, 10)
    const result = counter.decrement(20)
    expect(result).toBe(-20)
    expect(counter.value).toBe(-20)
  })
})
