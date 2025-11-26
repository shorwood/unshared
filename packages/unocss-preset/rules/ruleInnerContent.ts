import type { DynamicRule } from '@unocss/core'

export const ruleInnerContent: DynamicRule = [
  /^inner-content(?:-(.*))?$/,
  ([, content = '']) => ({ content: `"${content}"` }),
]
