export interface Toggle {

  /**
   * Set the value of this switch to `false`.
   *
   * @returns The new value of this switch.
   * @example createToggle(true).off() // false
   */
  off(): boolean

  /**
   * Set the value of this switch to `true`.
   *
   * @returns The new value of this switch.
   * @example createToggle(false).on() // true
   */
  on(): boolean

  /**
   * Toggles the value of this switch.
   *
   * @returns The new value of this switch.
   * @example createToggle(true).toggle() // false
   */
  toggle(): boolean

  /**
   * The current value of this switch.
   */
  value: boolean
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
    off() {
      this.value = false
      return this.value
    },
    on() {
      this.value = true
      return this.value
    },
    toggle() {
      this.value = !this.value
      return this.value
    },
    value,
  }
}
