import type { RuleContext } from '@unocss/core'
import { Color, createTheme } from '@unshared/color'
import { createRuleThemeBorder } from './createRuleThemeBorder'

describe('createRuleThemeBorder', () => {
  const options = {
    presets: {
      primary: createTheme({
        colors: { primary: Color.fromHex('#007acc') },
      }),
    },
  }

  const [regex, handler] = createRuleThemeBorder(options)
  const context = {} as RuleContext

  it('should not match when specifier does not exist in theme', () => {
    const match = regex.exec('border-nonexistent')
    if (!match) return
    const result = handler(match, context)
    expect(result).toBeUndefined()
  })

  it('should generate border color without opacity', () => {
    const match = regex.exec('border-primary')
    if (!match) throw new Error('Pattern should match')
    const result = handler(match, context)
    expect(result).toStrictEqual({
      'border-color': 'oklch(var(--theme-primary-default-default-border) / var(--un-border-opacity, 1))',
    })
  })

  it('should generate border color with opacity', () => {
    const match = regex.exec('border-primary/60')
    if (!match) throw new Error('Pattern should match')
    const result = handler(match, context)
    expect(result).toStrictEqual({
      '--un-border-opacity': '60%',
      'border-color': 'oklch(var(--theme-primary-default-default-border) / var(--un-border-opacity, 1))',
    })
  })

  it('should generate border-top color', () => {
    const match = regex.exec('border-t-primary')
    if (!match) throw new Error('Pattern should match')
    const result = handler(match, context)
    expect(result).toStrictEqual({
      'border-top-color': 'oklch(var(--theme-primary-default-default-border) / var(--un-border-opacity, 1))',
    })
  })

  it('should generate border shorthand color', () => {
    const match = regex.exec('b-primary')
    if (!match) throw new Error('Pattern should match')
    const result = handler(match, context)
    expect(result).toStrictEqual({
      'border-color': 'oklch(var(--theme-primary-default-default-border) / var(--un-border-opacity, 1))',
    })
  })

  it('should generate border-x colors', () => {
    const match = regex.exec('border-x-primary')
    if (!match) throw new Error('Pattern should match')
    const result = handler(match, context)
    expect(result).toStrictEqual({
      'border-left-color': 'oklch(var(--theme-primary-default-default-border) / var(--un-border-opacity, 1))',
      'border-right-color': 'oklch(var(--theme-primary-default-default-border) / var(--un-border-opacity, 1))',
    })
  })
})
