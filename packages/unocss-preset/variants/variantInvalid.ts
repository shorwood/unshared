import { createVariant } from '../utils'

/** Variant for selected &[aria-invalid="true"] */
export const variantInvalid = createVariant('error', ['&[aria-invalid="true"]', '*[aria-invalid="true"] &'])
