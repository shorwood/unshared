import type { MaybeLiteral } from '@unshared/types'
import type { Component, Prop } from 'vue'
import { toReactive } from '@vueuse/core'
import { computed, getCurrentInstance, resolveComponent } from 'vue'

/** The properties of the base renderable component. */
export interface BaseRenderableOptions {

  /**
   * The HTML tag or component (constructor or name) to render. This represents what will
   * encapsulate the content of the component and how it will be rendered.
   *
   * @example 'div'
   */
  as?: Component | MaybeLiteral<keyof HTMLElementTagNameMap>
}

/** The base properties of the renderable composable. */
export interface BaseRenderableComposable {

  /**
   * The HTML tag or component (constructor or name) to render. This represents what will
   * encapsulate the content of the component and how it will be rendered.
   *
   * @example 'div'
   */
  is: Component | string | undefined
}

/** The symbol to provide the composable into the component. */
export const BASE_RENDERABLE_SYMBOL = Symbol()

/** The properties of the base renderable component. */
export const BASE_RENDERABLE_OPTIONS = {
  as: [String, Object],
} as Record<keyof BaseRenderableOptions, Prop<unknown>>

declare module 'vue' {
  interface ComponentInternalInstance {
    [BASE_RENDERABLE_SYMBOL]?: BaseRenderableComposable
  }
}

/**
 * A composable to provide the base renderable properties to a Vue component. It allows
 * the component to define what HTML tag or component it should render as. This is useful
 * for components that need to be flexible in their rendering, such as input fields or
 * buttons that can be rendered as different HTML elements or Vue components.
 *
 * @param props The properties of the component passed by the `setup` function.
 * @param instance The instance of the component to provide the composable.
 * @returns An object with the computed classes and attributes.
 * @example
 * defineComponent({
 *   props: BASE_RENDERABLE_PROPS,
 *   setup(props, context) {
 *     const renderable = useBaseRenderable(props)
 *     return () => h(renderable.is ?? 'div')
 *   }
 * })
 */
export function useBaseRenderable(props: BaseRenderableOptions = {}, instance = getCurrentInstance()) {
  if (instance?.[BASE_RENDERABLE_SYMBOL]) return instance[BASE_RENDERABLE_SYMBOL]

  // --- Compute component type.
  const is = computed(() => {
    if (props.as === undefined) return
    if (typeof props.as !== 'string') return props.as
    const isHtmlTag = typeof props.as === 'string' && props.as.toLowerCase() === props.as
    if (isHtmlTag) return props.as
    return resolveComponent(props.as)
  })

  // --- Provide the composable into the component and return it.
  const composable = toReactive({ is })
  if (instance) instance[BASE_RENDERABLE_SYMBOL] = composable
  return composable
}
