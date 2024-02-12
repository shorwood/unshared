// @vitest-environment happy-dom
import { expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue-demi'
import { exposeToDevtool } from './exposeToDevtool'

it('should expose an object to the Vue Devtools', async() => {
  const wrapper = mount({ render: () => h('div') })
  const instance = wrapper.getCurrentComponent()
  exposeToDevtool({ foo: 'bar' }, instance)
  await nextTick()
  // @ts-expect-error: ignore
  expect(instance.setupState).toEqual({ foo: 'bar' })
})

it('should return the exposed object', () => {
  const result = exposeToDevtool({ foo: 'bar' })
  expect(result).toEqual({ foo: 'bar' })
})
