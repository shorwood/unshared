import type { VariantObject } from '@unocss/core'
import { createVariant } from '../utils'

/**
 * Variant for selected `&[selected="true"]`.
 *
 * @returns The UnoCSS variant for selected state.
 */
export function variantSelected<Theme extends object>(): VariantObject<Theme> {
  return createVariant<Theme>('selected', [
    '&[selected="true"]',
    '&[aria-selected="true"]',
  ])
}
