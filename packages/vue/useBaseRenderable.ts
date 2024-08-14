import { Component, Prop, computed, getCurrentInstance, resolveComponent } from 'vue'
import { toReactive } from '@vueuse/core'

/** The properties of the base renderable component. */
export interface BaseRenderableOptions {

  /**
   * The HTML tag or component (constructor or name) to render. This represents what will
   * encapsulate the content of the component and how it will be rendered.
   *
   * @example 'div'
   */
  as?: {} & string | Component | keyof HTMLElementTagNameMap
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
 * A composable that provides properties and methods to create a Vue link or
 * external hyperlink. This composable will dynamically determine the type of
 * link to use based on the provided properties.
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

/* v8 ignore next */
// @vitest-environment happy-dom
if (import.meta.vitest) {
  const { isReactive, defineComponent } = await import('vue')
  const { mount } = await import('@vue/test-utils')

  describe('composable', () => {
    it('should return a reactive object', () => {
      const result = useBaseRenderable()
      const reactive = isReactive(result)
      expect(reactive).toBe(true)
    })

    it('should provide the composable into the component', () => {
      mount(() => {
        const result = useBaseRenderable()
        const instance = getCurrentInstance()
        const injected = instance?.[BASE_RENDERABLE_SYMBOL]
        expect(result).toStrictEqual(injected)
      })
    })

    it('should return the same instance when called multiple times', () => {
      mount(() => {
        const result1 = useBaseRenderable()
        const result2 = useBaseRenderable()
        expect(result1).toBe(result2)
      })
    })

    it('should return different instances for different components', () => {
      const result1 = useBaseRenderable()
      const result2 = useBaseRenderable()
      expect(result1).not.toBe(result2)
    })
  })

  describe('html tag', () => {
    it('should return a div tag', () => {
      const result = useBaseRenderable({ as: 'div' })
      expect(result.is).toBe('div')
    })

    it('should return a span tag', () => {
      const result = useBaseRenderable({ as: 'span' })
      expect(result.is).toBe('span')
    })
  })

  describe('component', () => {
    it('should return a component', () => {
      const component = defineComponent({ template: '<div></div>' })
      const result = useBaseRenderable({ as: component })
      expect(result.is).toBe(component)
    })

    it('should return a component by name', () => {
      const Component = defineComponent({ template: '<div></div>' })
      mount({
        components: { Component },
        setup() {
          const result = useBaseRenderable({ as: 'Component' })
          expect(result.is).toBe(Component)
          return () => ''
        },
      })
    })
  })
}
