import type { RuleContext } from '@unocss/core'
import { Color, createTheme } from '@unshared/color'
import { createRuleThemeText } from './createRuleThemeText'

describe('createRuleThemeText', () => {
  const options = {
    presets: {
      primary: createTheme({
        colors: { primary: Color.fromHex('#007acc') },
      }),
    },
  }

  const [regex, handler] = createRuleThemeText(options)
  const context = {} as RuleContext

  it('should not match when specifier does not exist in theme', () => {
    const match = regex.exec('text-nonexistent')
    if (!match) return
    const result = handler(match, context)
    expect(result).toBeUndefined()
  })

  it('should generate text color without opacity', () => {
    const match = regex.exec('text-primary')
    if (!match) throw new Error('Pattern should match')
    const result = handler(match, context)
    expect(result).toStrictEqual({
      color: 'oklch(var(--theme-primary-default-default-foreground) / var(--un-text-opacity, 1))',
    })
  })

  it('should generate text color with opacity', () => {
    const match = regex.exec('text-primary/75')
    if (!match) throw new Error('Pattern should match')
    const result = handler(match, context)
    expect(result).toStrictEqual({
      '--un-text-opacity': '75%',
      'color': 'oklch(var(--theme-primary-default-default-foreground) / var(--un-text-opacity, 1))',
    })
  })
})
