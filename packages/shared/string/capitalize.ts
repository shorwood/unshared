/**
 *
 * @param value
 */
export const capitalize = (value: string) => value
  .toLowerCase()
  .replace(/^\w|[A-Z]|\b\w/g, word => word.toUpperCase())
