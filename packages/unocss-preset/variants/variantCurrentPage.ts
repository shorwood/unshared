import type { VariantObject } from '@unocss/core'
import { createVariant } from '../utils'

/**
 * Variant for selector `&[aria-current="page"]`.
 *
 * @returns The UnoCSS variant for current page.
 */
export function variantCurrentPage<Theme extends object>(): VariantObject<Theme> {
  return createVariant<Theme>('current', [
    '&[aria-current="page"]',
  ])
}
