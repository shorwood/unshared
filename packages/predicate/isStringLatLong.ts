/**
 * Check if string matches latitude and longitude.
 * @param value The value to check
 * @return `true` if string matches a latitude and longitude, `false` otherwise
 * @see https://en.wikipedia.org/wiki/Geographic_coordinate_system
 * @example
 * isStringLatLong('-90.0') // true
 * isStringLatLong('-90,0.0') // false
 */
export const isStringLatLong = (value: string): boolean =>
  typeof value === 'string'
  && /^((-?|\+?)?\d+(\.\d+)?),\s*((-?|\+?)?\d+(\.\d+)?)$/.test(value)
