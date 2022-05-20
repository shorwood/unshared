import { RGB } from './types'

/**
 * Takes an RGB color and converts it into a single integer value.
 * @param {RGB} rgb An RGB object
 * @returns {number} An integer value
 */
export const rgbToInt = ({ r, g, b }: RGB) => (r << 16) | (g << 8) | b
