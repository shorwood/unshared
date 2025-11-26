import type { RuleContext } from '@unocss/core'
import { Color, createTheme } from '@unshared/color'
import { createRuleThemeRing } from './createRuleThemeRing'

describe('createRuleThemeRing', () => {
  const options = {
    presets: {
      primary: createTheme({
        colors: { primary: Color.fromHex('#007acc') },
      }),
    },
  }

  const [regex, handler] = createRuleThemeRing(options)
  const context = {} as RuleContext

  it('should not match when specifier does not exist in theme', () => {
    const match = regex.exec('ring-nonexistent')
    if (!match) return
    const result = handler(match, context)
    expect(result).toBeUndefined()
  })

  it('should generate ring color without opacity', () => {
    const match = regex.exec('ring-primary')
    if (!match) throw new Error('Pattern should match')
    const result = handler(match, context)
    expect(result).toStrictEqual({
      '--un-ring-color': 'oklch(var(--theme-primary-default-default-border) / var(--un-ring-opacity, 1))',
    })
  })

  it('should generate ring color with opacity', () => {
    const match = regex.exec('ring-primary/80')
    if (!match) throw new Error('Pattern should match')
    const result = handler(match, context)
    expect(result).toStrictEqual({
      '--un-ring-opacity': '80%',
      '--un-ring-color': 'oklch(var(--theme-primary-default-default-border) / var(--un-ring-opacity, 1))',
    })
  })
})
