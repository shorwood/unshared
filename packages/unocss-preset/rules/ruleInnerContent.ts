import type { DynamicRule } from '@unocss/core'

export function ruleInnerContent<Theme extends object>(): DynamicRule<Theme> {
  return [
    /^inner-content(?:-(.*))?$/,
    ([, content = '']) => ({ content: `"${content}"` }),
  ]
}
