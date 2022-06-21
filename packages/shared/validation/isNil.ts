/**
 * Check if value is null
 * @param value The value to check
 * @returns {value is null} Returns true if value is null, false otherwise
 */
export const isNull = (value: any): value is null => value === null

/**
 * Check if value is not null
 * @param value The value to check
 * @returns {boolean} Returns true if value is not null, false otherwise
 */
export const isNotNull = (value: any): boolean => value !== null

/**
 * Check if value is undefined
 * @param value The value to check
 * @returns {value is undefined} Returns true if value is undefined, false otherwise
 */
export const isUndefined = (value: any): value is undefined => typeof value === 'undefined'

/**
 * Check if value is not undefined
 * @param value The value to check
 * @returns {boolean} Returns true if value is not undefined, false otherwise
 */
export const isNotUndefined = (value: any): boolean => typeof value !== 'undefined'

/**
 * Check if value is null or undefined
 * @param value The value to check
 * @returns {value is null | undefined} Returns true if value is null or undefined, false otherwise
 */
export const isNil = (value: any): value is null | undefined => typeof value === 'undefined' || value === null

/**
 * Check if value is not null and not undefined
 * @param value The value to check
 * @returns {boolean} Returns true if value is not null and not undefined, false otherwise
 */
export const isNotNil = (value: any): boolean => typeof value !== 'undefined' && value !== null
