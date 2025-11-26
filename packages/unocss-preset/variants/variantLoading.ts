import { createVariant } from '../utils'

/** Variant for selector `&[aria-busy="true"]`. */
export const variantLoading = createVariant('loading', [
  '&[aria-busy="true"]',
])
