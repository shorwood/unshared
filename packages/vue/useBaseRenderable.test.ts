import { mount } from '@vue/test-utils'
import { defineComponent, getCurrentInstance, isReactive } from 'vue'
import { BASE_RENDERABLE_SYMBOL, useBaseRenderable } from './useBaseRenderable'

// @vitest-environment happy-dom
describe('useBaseRenderable', () => {
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
})
