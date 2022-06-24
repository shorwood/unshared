/**
 * Swap endian of a 32-bit number
 * @param {number} n The number to swap
 * @returns {number} The number with swapped endian
 */
export const swapEndian = (n: number): number => (
  ((n << 8) | (n >>> 24)) & 0x00FF00FF
| ((n << 24) | (n >>> 8)) & 0xFF00FF00
)
