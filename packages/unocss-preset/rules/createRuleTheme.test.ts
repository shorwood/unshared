import type { RuleContext } from '@unocss/core'
import { Color, createTheme } from '@unshared/color'
import { createRuleTheme } from './createRuleTheme'

describe('createRuleTheme', () => {
  const options = {
    presets: {
      primary: createTheme({
        colors: { primary: Color.fromHex('#007acc') },
      }),
    },
  }

  const [regex, handler] = createRuleTheme(options)
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
      '--theme-primary-default-active-background': '77.61% 4.44% 263.09',
      '--theme-primary-default-active-border': '64.67% 3.54% 263.24',
      '--theme-primary-default-active-foreground': '20% 0% 123.38',
      '--theme-primary-default-active-muted': '47.42% 1.09% 265.22',
      '--theme-primary-default-default-background': '93.12% 2.2% 266.71',
      '--theme-primary-default-default-border': '80.18% 2.59% 264.65',
      '--theme-primary-default-default-foreground': '20% 5% 266.71',
      '--theme-primary-default-default-muted': '62.94% 0.8% 265.85',
      '--theme-primary-default-disabled-background': '89.14% 0.96% 265.97',
      '--theme-primary-default-disabled-border': '76.21% 0.77% 266.01',
      '--theme-primary-default-disabled-foreground': '20% 5% 265.97',
      '--theme-primary-default-disabled-muted': '58.97% 0.24% 266.37',
      '--theme-primary-default-focus-background': '82.78% 4.09% 263.58',
      '--theme-primary-default-focus-border': '69.84% 3.27% 263.74',
      '--theme-primary-default-focus-foreground': '20% 0% 123.38',
      '--theme-primary-default-focus-muted': '52.59% 1.01% 265.46',
      '--theme-primary-default-hover-background': '86.22% 3.75% 263.95',
      '--theme-primary-default-hover-border': '73.29% 3% 264.11',
      '--theme-primary-default-hover-foreground': '20% 5% 263.95',
      '--theme-primary-default-hover-muted': '56.04% 0.92% 265.62',
      '--theme-primary-emphasis-active-background': '67.26% 9.66% 257.37',
      '--theme-primary-emphasis-active-border': '54.33% 7.72% 257.47',
      '--theme-primary-emphasis-active-foreground': '20% 0% 123.38',
      '--theme-primary-emphasis-active-muted': '37.08% 2.32% 262.75',
      '--theme-primary-emphasis-default-background': '82.78% 6.94% 261.37',
      '--theme-primary-emphasis-default-border': '69.85% 5.54% 261.66',
      '--theme-primary-emphasis-default-foreground': '20% 0% 123.38',
      '--theme-primary-emphasis-default-muted': '52.59% 1.69% 264.66',
      '--theme-primary-emphasis-disabled-background': '79.32% 2.02% 265.07',
      '--theme-primary-emphasis-disabled-border': '66.39% 1.61% 265.14',
      '--theme-primary-emphasis-disabled-foreground': '20% 0% 123.38',
      '--theme-primary-emphasis-disabled-muted': '49.14% 0.5% 266',
      '--theme-primary-emphasis-focus-background': '72.44% 8.85% 258.83',
      '--theme-primary-emphasis-focus-border': '59.5% 7.06% 259.05',
      '--theme-primary-emphasis-focus-foreground': '20% 0% 123.38',
      '--theme-primary-emphasis-focus-muted': '42.25% 2.13% 263.51',
      '--theme-primary-emphasis-hover-background': '75.89% 8.07% 259.88',
      '--theme-primary-emphasis-hover-border': '62.95% 6.45% 260.14',
      '--theme-primary-emphasis-hover-foreground': '20% 0% 123.38',
      '--theme-primary-emphasis-hover-muted': '45.7% 1.95% 264',
      '--theme-primary-interactive-active-background': '54.52% 19.72% 257.46',
      '--theme-primary-interactive-active-border': '41.16% 15.5% 258.38',
      '--theme-primary-interactive-active-foreground': '95% 0% 123.38',
      '--theme-primary-interactive-active-muted': '26.72% 5.49% 253.12',
      '--theme-primary-interactive-default-background': '65.48% 16.74% 249.67',
      '--theme-primary-interactive-default-border': '52.56% 13.39% 249.73',
      '--theme-primary-interactive-default-foreground': '95% 0% 123.38',
      '--theme-primary-interactive-default-muted': '35.36% 3.87% 259.68',
      '--theme-primary-interactive-disabled-background': '62.95% 4.13% 262.55',
      '--theme-primary-interactive-disabled-border': '50.01% 3.3% 262.52',
      '--theme-primary-interactive-disabled-foreground': '95% 0% 123.38',
      '--theme-primary-interactive-disabled-muted': '32.76% 1.01% 264.73',
      '--theme-primary-interactive-focus-background': '58.03% 19.08% 254.96',
      '--theme-primary-interactive-focus-border': '44.8% 15.09% 255.64',
      '--theme-primary-interactive-focus-foreground': '95% 0% 123.38',
      '--theme-primary-interactive-focus-muted': '26.73% 5.04% 254.3',
      '--theme-primary-interactive-hover-background': '60.17% 18.27% 252.49',
      '--theme-primary-interactive-hover-border': '47.09% 14.5% 252.96',
      '--theme-primary-interactive-hover-foreground': '95% 0% 123.38',
      '--theme-primary-interactive-hover-muted': '28.46% 4.57% 256.22',
      '--theme-primary-surface-active-background': '82.77% 1.81% 265.29',
      '--theme-primary-surface-active-border': '69.83% 1.45% 265.36',
      '--theme-primary-surface-active-foreground': '20% 0% 123.38',
      '--theme-primary-surface-active-muted': '52.59% 0.45% 266.1',
      '--theme-primary-surface-default-background': '98.29% 0.59% 76.16',
      '--theme-primary-surface-default-border': '85.35% 1.07% 265.86',
      '--theme-primary-surface-default-foreground': '20.08% 4.36% 69.68',
      '--theme-primary-surface-default-muted': '68.11% 0.33% 266.32',
      '--theme-primary-surface-disabled-background': '94.05% 0.4% 266.36',
      '--theme-primary-surface-disabled-border': '81.12% 0.32% 266.38',
      '--theme-primary-surface-disabled-foreground': '20% 5% 266.36',
      '--theme-primary-surface-disabled-muted': '63.88% 0.1% 266.52',
      '--theme-primary-surface-focus-background': '87.94% 1.68% 265.46',
      '--theme-primary-surface-focus-border': '75.01% 1.34% 265.54',
      '--theme-primary-surface-focus-foreground': '20% 5% 265.46',
      '--theme-primary-surface-focus-muted': '57.76% 0.42% 266.18',
      '--theme-primary-surface-hover-background': '91.39% 1.54% 265.6',
      '--theme-primary-surface-hover-border': '78.45% 1.23% 265.67',
      '--theme-primary-surface-hover-foreground': '20% 5% 265.6',
      '--theme-primary-surface-hover-muted': '61.21% 0.38% 266.24',
    })
  })
})
