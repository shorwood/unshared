import { Rule } from 'unocss'

export const ruleInnerContent: Rule = [
  /^inner-content(?:-?(.*))?$/,
  ([, content = '']: string[]) => ({ content: `"${content}"` }),
]
