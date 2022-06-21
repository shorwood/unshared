import { expect, it } from 'vitest'
import { colorLighten } from './colorLighten'

it('lighten a color by the given amount', () => {
  expect(colorLighten('#fff', 0.2)).toBe('#333333')
  expect(colorLighten('#fff', 0.4)).toBe('#666666')
  expect(colorLighten('#fff', 0.6)).toBe('#999999')
  expect(colorLighten('#fff', 0.8)).toBe('#cccccc')
  expect(colorLighten('#fff', 1)).toBe('#ffffff')
  expect(colorLighten('#000', 2)).toBe('#000000')
})
