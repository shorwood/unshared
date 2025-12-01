import type { VariantObject } from '@unocss/core'
import { createVariant } from '../utils'

/**
 * Variant for selector `&[aria-busy="true"]`.
 *
 * @returns The UnoCSS variant for loading state.
 */
export function variantLoading<Theme extends object>(): VariantObject<Theme> {
  return createVariant<Theme>('loading', [
    '&[aria-busy="true"]',
  ])
}
