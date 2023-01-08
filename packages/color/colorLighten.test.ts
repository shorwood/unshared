import { expect, it } from 'vitest'
import { colorLighten } from './colorLighten'

it('lighten a color by the given amount', () => {
  expect(colorLighten('#fff', 0.2)).toEqual('#333333')
  expect(colorLighten('#fff', 0.4)).toEqual('#666666')
  expect(colorLighten('#fff', 0.6)).toEqual('#999999')
  expect(colorLighten('#fff', 0.8)).toEqual('#cccccc')
  expect(colorLighten('#fff', 1)).toEqual('#ffffff')
  expect(colorLighten('#000', 2)).toEqual('#000000')
})
