import type { Rule } from '@unocss/core'

export const ruleInnerContent: Rule = [
  /^inner-content(?:-(.*))?$/,
  ([, content = '']: string[]) => ({ content: `"${content}"` }),
]
