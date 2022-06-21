/**
 * Check if value is an array
 * @param {any} value The value to check
 * @returns {boolean} True if value is an array
 */
export const isArray = (value: any): value is any[] => Array.isArray(value)

/**
  * Check if array is empty
  * @param {any[]} value The array to check
  * @returns {boolean} True if array is an empty array
  */
export const isArrayEmpty = (value: any[]): boolean => Array.isArray(value) && value.length === 0

/**
  * Check if array is not empty
  * @param {any[]} value The array to check
  * @returns {boolean} True if array is a non empty array
  */
export const isArrayNotEmpty = (value: any[]): boolean => Array.isArray(value) && value.length > 0

/**
  * Check if array includes item
  * @param {any[]} value The array to check
  * @param {any} item The value to look for
  * @returns {boolean} True if array includes item
  */
export const isArrayIncluding = <T>(value: T[], item: T): boolean => value.includes(item)

/**
  * Check if array includes at least one of the items
  * @param {any[]} value The array to check
  * @param {any[]} items The values to look for
  * @returns {boolean} True if array includes at least one of the items
  */
export const isArrayIncludingSome = <T>(value: T[], items: T[]): boolean => items.some(item => value.includes(item))

/**
   * Check if array includes all of the items
   * @param {any[]} value The array to check
   * @param {any[]} items The values to look for
   * @returns {boolean} True if array includes all of the items
   */
export const isArrayIncludingEvery = <T>(value: T[], items: T[]): boolean => items.every(item => value.includes(item))

/**
  * Check if array does not include item
  * @param {any[]} value The array to check
  * @param {any} item The value to look for
  * @returns {boolean} True if array does not include item
  */
export const isArrayNotIncluding = <T>(value: T[], item: T): boolean => !value.includes(item)

/**
   * Check if array does not include any of the items
   * @param {any[]} value The array to check
   * @param {any[]} items The values to look for
   * @returns {boolean} True if array does not include any of the items
   */
export const isArrayNotIncludingSome = <T>(value: T[], items: T[]): boolean => items.some(item => !value.includes(item))

/**
   * Check if array does not include all of the items
   * @param {any[]} value The array to check
   * @param {any[]} items The values to look for
   * @returns {boolean} True if array does not include all of the items
   */
export const isArrayNotIncludingEvery = <T>(value: T[], items: T[]): boolean => items.every(item => !value.includes(item))
