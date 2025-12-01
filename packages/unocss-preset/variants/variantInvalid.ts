import type { VariantObject } from '@unocss/core'
import { createVariant } from '../utils'

/**
 * Variant for selected `&[aria-invalid="true"]`.
 *
 * @returns The UnoCSS variant for invalid state.
 */
export function variantInvalid<Theme extends object>(): VariantObject<Theme> {
  return createVariant<Theme>('error', [
    '&[aria-invalid="true"]',
    '*[aria-invalid="true"] &',
  ])
}
