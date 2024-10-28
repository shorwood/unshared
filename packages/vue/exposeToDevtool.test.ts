import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import { exposeToDevtool } from './exposeToDevtool'

// @vitest-environment happy-dom
describe('exposeToDevtool', () => {
  test('should expose an object to the Vue Devtools', async() => {
    const wrapper = mount({ render: () => h('div') })
    const instance = wrapper.getCurrentComponent()
    exposeToDevtool({ foo: 'bar' }, instance)
    await nextTick()
    // @ts-expect-error: `setupState` is not declared in the type definition.
    expect(instance.setupState).toStrictEqual({ foo: 'bar' })
  })

  test('should return undefined', () => {
    const result = exposeToDevtool({ foo: 'bar' })
    expect(result).toBeUndefined()
  })
})
