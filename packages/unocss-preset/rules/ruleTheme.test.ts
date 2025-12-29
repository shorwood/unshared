import type { RuleContext } from '@unocss/core'
import { Color, createTheme } from '@unshared/color'
import { ruleTheme } from './ruleTheme'

describe('createRuleTheme', () => {
  const options = {
    presets: {
      primary: createTheme({
        colors: { primary: Color.fromHex('#007acc') },
      }),
    },
  }

  const [regex, handler] = ruleTheme(options)
  const context = {} as RuleContext

  it('should not match when theme does not exist', () => {
    const match = regex.exec('theme-nonexistent')
    if (!match) return
    const result = handler(match, context)
    expect(result).toBeUndefined()
  })

  it('should generate CSS variables for theme', () => {
    const match = regex.exec('theme-primary')
    if (!match) throw new Error('Pattern should match')
    const result = handler(match, context)
    expect(result).toStrictEqual({
      '--theme-primary-default-active-background': '100% 100% 357.04',
      '--theme-primary-default-active-border': '82.8% 8.47% 352.89',
      '--theme-primary-default-active-foreground': '20% 5% 357.04',
      '--theme-primary-default-active-muted': '64.8% 2.62% 352.83',
      '--theme-primary-default-default-background': '100% 100% 272.97',
      '--theme-primary-default-default-border': '84.4% 6.18% 357.65',
      '--theme-primary-default-default-foreground': '20% 5% 272.97',
      '--theme-primary-default-default-muted': '66.61% 1.92% 357.64',
      '--theme-primary-default-disabled-background': '100% 100% 357.04',
      '--theme-primary-default-disabled-border': '82.8% 8.47% 352.89',
      '--theme-primary-default-disabled-foreground': '20% 5% 357.04',
      '--theme-primary-default-disabled-muted': '64.8% 2.62% 352.83',
      '--theme-primary-default-focus-background': '100% 100% 357.04',
      '--theme-primary-default-focus-border': '82.8% 8.47% 352.89',
      '--theme-primary-default-focus-foreground': '20% 5% 357.04',
      '--theme-primary-default-focus-muted': '64.8% 2.62% 352.83',
      '--theme-primary-default-hover-background': '100% 100% 357.04',
      '--theme-primary-default-hover-border': '82.8% 8.47% 352.89',
      '--theme-primary-default-hover-foreground': '20% 5% 357.04',
      '--theme-primary-default-hover-muted': '64.8% 2.62% 352.83',
      '--theme-primary-emphasis-active-background': '100% 100% 357.04',
      '--theme-primary-emphasis-active-border': '82.8% 8.47% 352.89',
      '--theme-primary-emphasis-active-foreground': '20% 5% 357.04',
      '--theme-primary-emphasis-active-muted': '64.8% 2.62% 352.83',
      '--theme-primary-emphasis-default-background': '100% 100% 272.97',
      '--theme-primary-emphasis-default-border': '84.4% 6.18% 357.65',
      '--theme-primary-emphasis-default-foreground': '20% 5% 272.97',
      '--theme-primary-emphasis-default-muted': '66.61% 1.92% 357.64',
      '--theme-primary-emphasis-disabled-background': '100% 100% 357.04',
      '--theme-primary-emphasis-disabled-border': '82.8% 8.47% 352.89',
      '--theme-primary-emphasis-disabled-foreground': '20% 5% 357.04',
      '--theme-primary-emphasis-disabled-muted': '64.8% 2.62% 352.83',
      '--theme-primary-emphasis-focus-background': '100% 100% 357.04',
      '--theme-primary-emphasis-focus-border': '82.8% 8.47% 352.89',
      '--theme-primary-emphasis-focus-foreground': '20% 5% 357.04',
      '--theme-primary-emphasis-focus-muted': '64.8% 2.62% 352.83',
      '--theme-primary-emphasis-hover-background': '100% 100% 357.04',
      '--theme-primary-emphasis-hover-border': '82.8% 8.47% 352.89',
      '--theme-primary-emphasis-hover-foreground': '20% 5% 357.04',
      '--theme-primary-emphasis-hover-muted': '64.8% 2.62% 352.83',
      '--theme-primary-interactive-active-background': '100% 100% 357.04',
      '--theme-primary-interactive-active-border': '82.8% 8.47% 352.89',
      '--theme-primary-interactive-active-foreground': '20% 5% 357.04',
      '--theme-primary-interactive-active-muted': '64.8% 2.62% 352.83',
      '--theme-primary-interactive-default-background': '100% 100% 272.97',
      '--theme-primary-interactive-default-border': '84.4% 6.18% 357.65',
      '--theme-primary-interactive-default-foreground': '20% 5% 272.97',
      '--theme-primary-interactive-default-muted': '66.61% 1.92% 357.64',
      '--theme-primary-interactive-disabled-background': '100% 100% 357.04',
      '--theme-primary-interactive-disabled-border': '82.8% 8.47% 352.89',
      '--theme-primary-interactive-disabled-foreground': '20% 5% 357.04',
      '--theme-primary-interactive-disabled-muted': '64.8% 2.62% 352.83',
      '--theme-primary-interactive-focus-background': '100% 100% 357.04',
      '--theme-primary-interactive-focus-border': '82.8% 8.47% 352.89',
      '--theme-primary-interactive-focus-foreground': '20% 5% 357.04',
      '--theme-primary-interactive-focus-muted': '64.8% 2.62% 352.83',
      '--theme-primary-interactive-hover-background': '100% 100% 357.04',
      '--theme-primary-interactive-hover-border': '82.8% 8.47% 352.89',
      '--theme-primary-interactive-hover-foreground': '20% 5% 357.04',
      '--theme-primary-interactive-hover-muted': '64.8% 2.62% 352.83',
      '--theme-primary-surface-active-background': '100% 100% 357.04',
      '--theme-primary-surface-active-border': '82.8% 8.47% 352.89',
      '--theme-primary-surface-active-foreground': '20% 5% 357.04',
      '--theme-primary-surface-active-muted': '64.8% 2.62% 352.83',
      '--theme-primary-surface-default-background': '100% 100% 272.97',
      '--theme-primary-surface-default-border': '84.4% 6.18% 357.65',
      '--theme-primary-surface-default-foreground': '20% 5% 272.97',
      '--theme-primary-surface-default-muted': '66.61% 1.92% 357.64',
      '--theme-primary-surface-disabled-background': '100% 100% 357.04',
      '--theme-primary-surface-disabled-border': '82.8% 8.47% 352.89',
      '--theme-primary-surface-disabled-foreground': '20% 5% 357.04',
      '--theme-primary-surface-disabled-muted': '64.8% 2.62% 352.83',
      '--theme-primary-surface-focus-background': '100% 100% 357.04',
      '--theme-primary-surface-focus-border': '82.8% 8.47% 352.89',
      '--theme-primary-surface-focus-foreground': '20% 5% 357.04',
      '--theme-primary-surface-focus-muted': '64.8% 2.62% 352.83',
      '--theme-primary-surface-hover-background': '100% 100% 357.04',
      '--theme-primary-surface-hover-border': '82.8% 8.47% 352.89',
      '--theme-primary-surface-hover-foreground': '20% 5% 357.04',
      '--theme-primary-surface-hover-muted': '64.8% 2.62% 352.83',
    })
  })
})
