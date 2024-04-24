import { toReactive } from '@vueuse/core'
import { Component, ExtractPropTypes, Prop, computed, provide, resolveComponent } from 'vue'

export const BASE_RENDERABLE_PROPS = {
  /**
   * The HTML tag, component name, or component object to render. This represents
   * what will encapsulate the content of the component and how it will be rendered.
   *
   * @default 'div'
   */
  as: { type: [String, Object], default: 'div' } as Prop<Component | keyof HTMLElementTagNameMap | string & {}>,
}

/** The properties of the base renderable component. */
export type BaseRenderableProps = ExtractPropTypes<typeof BASE_RENDERABLE_PROPS>

/**
 * A composable that provides properties and methods to create a Vue link or
 * external hyperlink. This composable will dynamically determine the type of
 * link to use based on the provided properties.
 *
 * @param props The properties of the component passed by the `setup` function.
 * @returns An object with the computed classes and attributes.
 * @example
 * defineComponent({
 *   setup(props, context) {
 *     return useBaseRenderable(props, context)
 *   }
 * })
 */
export function useBaseRenderable(props: BaseRenderableProps) {

  // --- Compute component type.
  const is = computed(() => {
    if (props.as === undefined) return
    const isHtmlTag = typeof props.as === 'string' && props.as.toLowerCase() === props.as
    if (isHtmlTag) return props.as as keyof HTMLElementTagNameMap
    return resolveComponent(props.as as string)
  })

  // --- Provide the composable into the component and return it.
  const composable = toReactive({ is })
  provide('baseRenderable', composable)
  return composable
}
