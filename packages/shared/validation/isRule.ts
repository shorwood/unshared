import { isObject } from './validators'
import { Rule } from './types'

/**
 *
 * @param value
 */
export const isRule = (value: any): value is Rule => (
  typeof value === 'function'
  || (isObject(value) && typeof value.handler === 'function')
  || (Array.isArray(value)
    && value.length >= 2
    && value.length <= 3
    && typeof value[0] === 'function'
    && typeof value[1] !== 'function'
  )
)
