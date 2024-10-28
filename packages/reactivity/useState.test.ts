import { useState } from './useState'

describe('useState', () => {
  test('should create a state and get its value', () => {
    const [getState] = useState(0)
    const result = getState()
    expect(result).toBe(0)
    expectTypeOf(result).toEqualTypeOf<number>()
  })

  test('should create a state and set its value', () => {
    const [getState, setState] = useState(0)
    setState(1)
    const result = getState()
    expect(result).toBe(1)
    expectTypeOf(result).toEqualTypeOf<number>()
  })

  test('should allow generic types to be passed', () => {
    const [getState, setState] = useState<number>()
    setState(1)
    const result = getState()
    expect(result).toBe(1)
    expectTypeOf(result).toEqualTypeOf<number | undefined>()
  })
})
