// @vitest-environment happy-dom
import { mount } from '@vue/test-utils'
import { expect, it } from 'vitest'
import { ComponentInternalInstance, getCurrentInstance, nextTick, h } from 'vue-demi'

/**
 * Exposes an object to the Vue Devtools.
 *
 * @param object The object to expose
 * @param componentInstance The component instance to expose to
 * @returns The exposed object
 */
export function exposeToDevtool<T>(object: T, componentInstance?: ComponentInternalInstance | null): T {
  // TODO: abort when not in dev mode

  // --- Get current component instance.
  const instance = componentInstance ?? getCurrentInstance()
  if (!instance) return object

  // --- Update `setupState` on next tick.
  // @ts-expect-error: `setupState` is not declared in the type definition.
  void nextTick(() => instance.setupState = object)

  // --- Return the object.
  return object
}

/* v8 ignore start */
if (import.meta.vitest) {
  it('should expose an object to the Vue Devtools', async() => {
    const wrapper = mount({ render: () => h('div') })
    const instance = wrapper.getCurrentComponent()
    void exposeToDevtool({ foo: 'bar' }, instance)
    await nextTick()
    // @ts-expect-error: `setupState` is not declared in the type definition.
    expect(instance.setupState).toStrictEqual({ foo: 'bar' })
  })

  it('should return the exposed object', () => {
    const result = exposeToDevtool({ foo: 'bar' })
    expect(result).toStrictEqual({ foo: 'bar' })
    expect(result).toBe(result)
  })
}
