import { createVariant } from '../utils'

/** Variant for selected &[selected="true"] */
export const variantSelected = createVariant('selected', [
  '&[selected="true"]',
  '&[aria-selected="true"]',
])
