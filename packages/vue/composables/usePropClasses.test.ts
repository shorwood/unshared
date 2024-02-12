/* eslint-disable unicorn/prevent-abbreviations */
import { expect, it } from 'vitest'
import { usePropClasses } from './usePropClasses'

const $style = { small: 'is-small', large: 'is-large', vertical: 'is-vertical' }
const classList = ['small', 'large', 'vertical']

it('computes the classes to apply from a CSS module', () => {
  const props = { size: 'small', vertical: true }
  const classes = usePropClasses(props, $style)
  expect(classes.value).toEqual(['is-small', 'is-vertical'])
})

it('computes the classes to apply from a class list', () => {
  const props = { size: 'small', vertical: true }
  const classes = usePropClasses(props, classList)
  expect(classes.value).toEqual(['vertical'])
})

it('computes to an empty array from a CSS Module', () => {
  const props = { size: undefined, vertical: false }
  const classes = usePropClasses(props, $style)
  expect(classes.value).toEqual([])
})
