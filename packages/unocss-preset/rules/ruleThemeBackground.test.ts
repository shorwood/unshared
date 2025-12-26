import type { RuleContext } from '@unocss/core'
import { Color } from '@unshared/color'
import { createTheme } from '@unshared/color'
import { createRuleThemeBackground } from './createRuleThemeBackground'

describe('createRuleThemeBackground', () => {
  const options = {
    presets: {
      primary: createTheme({
        colors: { primary: Color.fromHex('#007acc') },
      }),
    },
  }

  const [regex, handler] = createRuleThemeBackground(options)
  const context = {} as RuleContext

  it('should not match when specifier does not exist in theme', () => {
    const match = regex.exec('bg-nonexistent')
    if (!match) return
    const result = handler(match, context)
    expect(result).toBeUndefined()
  })

  it('should generate background color without opacity', () => {
    const match = regex.exec('bg-primary')
    if (!match) throw new Error('Pattern should match')
    const result = handler(match, context)
    expect(result).toStrictEqual({
      'background-color': 'oklch(var(--theme-primary-default-default-background) / var(--un-bg-opacity, 1))',
    })
  })

  it('should generate background color with opacity', () => {
    const match = regex.exec('bg-primary/50')
    if (!match) throw new Error('Pattern should match')
    const result = handler(match, context)
    expect(result).toStrictEqual({
      '--un-bg-opacity': '50%',
      'background-color': 'oklch(var(--theme-primary-default-default-background) / var(--un-bg-opacity, 1))',
    })
  })
})
