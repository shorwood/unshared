import { ComponentInternalInstance, getCurrentInstance, h, nextTick } from 'vue'

/**
 * Exposes an object to the Vue Devtools. This is useful when defining a component
 * using the `defineComponent` function and you want to expose some properties to
 * the Vue Devtools for debugging purposes.
 *
 * @param object The object to expose to the Vue Devtools.
 * @param componentInstance The component instance to expose the object to.
 * @example
 * const component = defineComponent({
 *   setup() {
 *     const text = reactive({ foo: 'bar' })
 *     exposeToDevtool({ text })
 *     return () => h('div', text.foo)
 *   },
 * })
 */
export function exposeToDevtool<T extends object>(object: T, componentInstance?: ComponentInternalInstance | null): void {
  const instance = componentInstance ?? getCurrentInstance()
  if (!instance) return

  // @ts-expect-error: `setupState` is not declared in the type definition.
  void nextTick(() => instance.setupState = object)
}

/* v8 ignore start */
// @vitest-environment happy-dom
if (import.meta.vitest) {
  const { mount } = await import('@vue/test-utils')

  test('should expose an object to the Vue Devtools', async() => {
    const wrapper = mount({ render: () => h('div') })
    const instance = wrapper.getCurrentComponent()
    void exposeToDevtool({ foo: 'bar' }, instance)
    await nextTick()

    // @ts-expect-error: `setupState` is not declared in the type definition.
    expect(instance.setupState).toStrictEqual({ foo: 'bar' })
  })

  test('should return undefined', () => {
    const result = exposeToDevtool({ foo: 'bar' })
    expect(result).toBeUndefined()
  })
}
