import { createToggle } from './createToggle'

describe('createToggle', () => {
  test('should create a Toggle instance', () => {
    const result = createToggle(true)
    expect(result.value).toBe(true)
  })

  test('should create a Toggle instance with the default value', () => {
    const result = createToggle()
    expect(result.value).toBe(false)
  })

  test('should toggle the value of a Toggle instance to false', () => {
    const result = createToggle(true)
    const resultToggle = result.toggle()
    expect(result.value).toBe(false)
    expect(resultToggle).toBe(false)
  })

  test('should toggle the value of a Toggle instance to true', () => {
    const result = createToggle(false)
    const resultToggle = result.toggle()
    expect(result.value).toBe(true)
    expect(resultToggle).toBe(true)
  })

  test('should set the value of a Toggle instance to true', () => {
    const result = createToggle(false)
    const resultOn = result.on()
    expect(result.value).toBe(true)
    expect(resultOn).toBe(true)
  })

  test('should set the value of a Toggle instance to false', () => {
    const result = createToggle(true)
    const resultOff = result.off()
    expect(result.value).toBe(false)
    expect(resultOff).toBe(false)
  })
})
