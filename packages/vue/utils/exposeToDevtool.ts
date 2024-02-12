import { isProduction } from '@hsjm/shared'
import { ComponentInternalInstance, getCurrentInstance, nextTick } from 'vue-demi'

/**
 * Exposes an object to the Vue Devtools.
 *
 * @param object The object to expose
 * @param componentInstance The component instance to expose to
 * @returns The exposed object
 */
export function exposeToDevtool <T extends Record<string, any>>(object: T, componentInstance?: ComponentInternalInstance | null): T {
  // --- Get current component instance.
  const instance = componentInstance ?? getCurrentInstance()
  if (!instance || isProduction()) return object

  // --- Update `setupState` on next tick.
  // @ts-expect-error: `setupState` is not declared in the type definition.
  nextTick(() => instance.setupState = object)

  // --- Return the object.
  return object
}
