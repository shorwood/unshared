import type { ComponentInternalInstance } from 'vue'
import { getCurrentInstance, nextTick } from 'vue'

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
