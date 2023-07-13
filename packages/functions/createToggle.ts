export interface Toggle {
  /**
   * The current value of this switch.
   */
  value: boolean
  /**
   * Toggles the value of this switch.
   *
   * @returns The new value of this switch.
   * @example createToggle(true).toggle() // false
   */
  toggle(): boolean
  /**
   * Set the value of this switch to `true`.
   *
   * @returns The new value of this switch.
   * @example createToggle(false).on() // true
   */
  on(): boolean
  /**
   * Set the value of this switch to `false`.
   *
   * @returns The new value of this switch.
   * @example createToggle(true).off() // false
   */
  off(): boolean
}

/**
 * Creates a switch instance from a boolean.
 *
 * @param value The initial value of the switch. (Default: `false`)
 * @returns An object with the switch value and toggle, on, and off functions.
 * @example createToggle(true) // Toggle
 */
export function createToggle(value = false): Toggle {
  return {
    value,
    toggle() {
      this.value = !this.value
      return this.value
    },
    on() {
      this.value = true
      return this.value
    },
    off() {
      this.value = false
      return this.value
    },
  }
}

/* c8 ignore next */
if (import.meta.vitest) {
  it('should create a Toggle instance', () => {
    const result = createToggle(true)
    expect(result.value).toEqual(true)
  })

  it('should create a Toggle instance with the default value', () => {
    const result = createToggle()
    expect(result.value).toEqual(false)
  })

  it('should toggle the value of a Toggle instance to false', () => {
    const result = createToggle(true)
    const resultToggle = result.toggle()
    expect(result.value).toEqual(false)
    expect(resultToggle).toEqual(false)
  })

  it('should toggle the value of a Toggle instance to true', () => {
    const result = createToggle(false)
    const resultToggle = result.toggle()
    expect(result.value).toEqual(true)
    expect(resultToggle).toEqual(true)
  })

  it('should set the value of a Toggle instance to true', () => {
    const result = createToggle(false)
    const resultOn = result.on()
    expect(result.value).toEqual(true)
    expect(resultOn).toEqual(true)
  })

  it('should set the value of a Toggle instance to false', () => {
    const result = createToggle(true)
    const resultOff = result.off()
    expect(result.value).toEqual(false)
    expect(resultOff).toEqual(false)
  })
}
