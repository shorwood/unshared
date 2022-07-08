/**
 * Check if string matches an URL
 * @param {string} value The value to check
 * @returns {boolean} `true` if string matches is an URL, `false` otherwise
 * @see https://urlregex.com/
 * @example
 * isStringUrl('https://') // false
 * isStringUrl('https://www.google.com/') // true
 */
export const isStringUrl = (value: string): boolean =>
  typeof value === 'string'
  && /^((https?|ftp):\/\/)?((?!(10|127)(\.\d{1,3}){3})(?!(169\.254|192\.168)(\.\d{1,3}){2})(?!172\.(1[6-9]|2\d|3[01])(\.\d{1,3}){2})([1-9]\d?|1\d\d|2[01]\d|22[0-3])(\.(1?\d{1,2}|2[0-4]\d|25[0-5])){2}\.([1-9]\d?|1\d\d|2[0-4]\d|25[0-4])|([\da-z\u00A1-\uFFFF]-*)*[\da-z\u00A1-\uFFFF]+(\.([\da-z\u00A1-\uFFFF]-*)*[\da-z\u00A1-\uFFFF]+)*\.[a-z\u00A1-\uFFFF]{2,})(:\d{2,5})?(\/\S*)?$/i.test(value)
