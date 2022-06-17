
import { expect, it } from 'vitest'
import { pi } from './pi'

it('approximates pi with variable accuracy', () => {
  expect(pi(0)).toEqual(0)
  expect(pi(1)).toEqual(4)
  expect(pi(2)).toEqual(2.666666666666667)
  expect(pi(3)).toEqual(3.466666666666667)
  expect(pi(4)).toEqual(2.8952380952380956)
  expect(pi(5)).toEqual(3.3396825396825403)
  expect(pi(6)).toEqual(2.9760461760461765)
  expect(pi(7)).toEqual(3.2837384837384844)
  expect(pi(8)).toEqual(3.017071817071818)
  expect(pi(9)).toEqual(3.2523659347188767)
})

it('should fail when accuracy is negative', () => {
  expect(() => { pi(-1) }).toThrow(Error)
})
