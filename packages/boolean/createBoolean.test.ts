/* eslint-disable sonarjs/no-primitive-wrappers */
import { Boolean, createBoolean } from './createBoolean'

describe('createBoolean', () => {
  test('should create a Boolean instance', () => {
    const result = createBoolean()
    expect(result).toBeInstanceOf(Boolean)
    expectTypeOf(result).toEqualTypeOf<Boolean>()
  })

  test('should default to false', () => {
    const result = createBoolean()
    expect(result.value).toBe(false)
  })

  test('should set the value to true', () => {
    const result = createBoolean(true)
    expect(result.value).toBe(true)
  })

  test('should check if a Boolean is true', () => {
    const boolean = createBoolean(true)
    expect(boolean.isTrue).toBe(true)
  })

  test('should check if a Boolean is false', () => {
    const boolean = createBoolean(false)
    expect(boolean.isFalse).toBe(true)
  })

  test('should and a boolean', () => {
    const result = createBoolean(true)
    result.and(false)
    expect(result.value).toBe(false)
  })

  test('should nand a boolean', () => {
    const result = createBoolean(true)
    result.nand(false)
    expect(result.value).toBe(true)
  })

  test('should nor a boolean', () => {
    const result = createBoolean(true)
    result.nor(false)
    expect(result.value).toBe(false)
  })

  test('should not a boolean', () => {
    const result = createBoolean(true)
    result.not()
    expect(result.value).toBe(false)
  })

  test('should or a boolean', () => {
    const result = createBoolean(true)
    result.or(false)
    expect(result.value).toBe(true)
  })

  test('should xor a boolean', () => {
    const result = createBoolean(true)
    result.xor(false)
    expect(result.value).toBe(true)
  })

  test('should xnor a boolean', () => {
    const result = createBoolean(true)
    result.xnor(false)
    expect(result.value).toBe(false)
  })

  test('should be chainable', () => {

    // const boolean = createBoolean(true)
    // const result = boolean.and(false).nand(false).nor(false).not.or(false).xor(false).xnor(false).value
    // expect(result).toStrictEqual(false)
    // expectTypeOf(result).toEqualTypeOf<false>()
    const result = createBoolean(true)
    result.and(false)
      .nand(false)
      .nor(false)
      .not()
      .or(false)
      .xor(false)
      .xnor(false)
    expect(result.value).toBe(false)
  })
})
