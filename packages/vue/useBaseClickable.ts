import type { Prop } from 'vue'
import type { BaseStateOptions } from './useBaseState'
import { toReactive } from '@vueuse/core'
import { computed, getCurrentInstance } from 'vue'
import { BASE_STATE_OPTIONS, useBaseState } from './useBaseState'

/** The symbol to inject the base clickable composable. */
export const BASE_CLICKABLE_SYMBOL = Symbol('baseClickable')

/** The base clickable properties. */
export const BASE_CLICKABLE_OPTIONS = {
  ...BASE_STATE_OPTIONS,
  label: [Number, String],
  onClick: [Function, Array],
  eager: Boolean,
} as Record<keyof BaseClickableOptions, Prop<unknown>>

/** The properties of the base clickable component. */
export interface BaseClickableOptions extends BaseStateOptions {

  /**
   * The label of the button. This is used to set the text content of the button
   * element as well as the `aria-labelledby` attribute for accessibility and SEO
   * purposes.
   *
   * @example 'Submit'
   */
  label?: number | string

  /**
   * The callback to call when the component is clicked. This is used to
   * handle the click event of the component and should be called when the
   * component is clicked.
   *
   * @default false
   */
  onClick?: (event: MouseEvent) => unknown

  /**
   * If `true`, the click event will be triggered on mouse down instead of
   * the click event. This is useful for components that need to respond
   * to the click event immediately.
   *
   * If the application is running in a touch environment, the click event
   * will be used instead of the mouse down event.
   *
   * @default false
   */
  eager?: boolean
}

/** The composable properties returned by the `useBaseClickable` composable. */
export interface BaseClickableComposable {

  /** The HTML attributes to apply to the component. */
  attributes: Record<string, unknown>

  /** The method to call when the component is clicked. */
  onClick: (event: MouseEvent) => unknown
}

declare module 'vue' {
  interface ComponentInternalInstance {
    [BASE_CLICKABLE_SYMBOL]?: BaseClickableComposable
  }
}

/**
 * A composable that provides the base clickable state and handling for a component.
 *
 * @param options The properties of the component passed by the `setup` function.
 * @param instance The instance of the component to provide the composable.
 * @returns An object with the computed properties and methods to use in the clickable component.
 * @example
 * defineComponent({
 *   mixins: [BaseState],
 *   setup(props, context) {
 *     return useBaseState(props, context)
 *   }
 * })
 */
export function useBaseClickable(options: BaseClickableOptions = {}, instance = getCurrentInstance()): BaseClickableComposable {
  if (instance?.[BASE_CLICKABLE_SYMBOL]) return instance[BASE_CLICKABLE_SYMBOL]

  // --- Inject the base state composable to get the state properties.
  const state = useBaseState(options, instance)

  // --- Handle click event to make it update the loading state
  // --- and catch any error that might occur during the click event.
  function onClick(event: MouseEvent) {
    if (!options.onClick || state.disabled || state.readonly || state.loading) return
    try {
      state.error = undefined
      const result = options.onClick(event)
      if (result instanceof Promise) {
        state.loading = true
        result
          .catch((error: Error) => state.error = error)
          .finally(() => state.loading = false)
      }
    }
    catch (error) {
      state.error = error as Error
    }
  }

  // --- Compute the name of the click event based on the eager click option.
  // --- If eager click is enabled, the click event will be triggered on mouse down.
  // --- Unless the application is running in a touch environment, then it will
  // --- default to the click event.
  const clickEvent = computed(() => {
    if (typeof window === 'undefined') return 'onClick'
    if ('ontouchstart' in window) return 'onClick'
    if (options.eager) return 'onMousedown'
    return 'onClick'
  })

  // --- Create the reactive attributes for the component.
  const attributes = computed(() => ({
    [clickEvent.value]: onClick,
    'aria-labelledby': options.label,
    'aria-live': 'assertive',
  }))

  // --- Provide the composable into the component and return it.
  const composable = toReactive({ attributes, onClick })
  if (instance) instance[BASE_CLICKABLE_SYMBOL] = composable
  return composable
}

/* v8 ignore next */
/* eslint-disable @typescript-eslint/unbound-method */
if (import.meta.vitest) {

  // @vitest-environment happy-dom
  const { isReactive } = await import('vue')
  const { mount } = await import('@vue/test-utils')
  const { nextTick } = await import('node:process')

  describe('composable', () => {
    it('should return a reactive object', () => {
      const result = useBaseClickable()
      const reactive = isReactive(result)
      expect(reactive).toBe(true)
    })

    it('should provide the composable into the component', () => {
      mount(() => {
        const result = useBaseClickable()
        const instance = getCurrentInstance()
        const injected = instance?.[BASE_CLICKABLE_SYMBOL]
        expect(result).toStrictEqual(injected)
      })
    })

    it('should return the same instance when called multiple times', () => {
      mount(() => {
        const result1 = useBaseClickable()
        const result2 = useBaseClickable()
        expect(result1).toBe(result2)
      })
    })

    it('should return different instances for different components', () => {
      const result1 = useBaseClickable()
      const result2 = useBaseClickable()
      expect(result1).not.toBe(result2)
    })
  })

  describe('click', () => {
    it('should not be the same function reference', () => {
      const onClick = vi.fn()
      const result = useBaseClickable({ onClick })
      expect(result.onClick).not.toBe(onClick)
    })

    it('should call the `onClick` method', () => {
      const onClick = vi.fn()
      const result = useBaseClickable({ onClick })
      const event = new MouseEvent('click')
      void result.onClick(event)
      expect(onClick).toHaveBeenCalledWith(event)
    })

    it('should not call the `onClick` method when disabled', () => {
      const onClick = vi.fn()
      const result = useBaseClickable({ onClick, disabled: true })
      void result.onClick(new MouseEvent('click'))
      expect(onClick).not.toHaveBeenCalled()
    })

    it('should not call the `onClick` method when readonly', () => {
      const onClick = vi.fn()
      const result = useBaseClickable({ onClick, readonly: true })
      void result.onClick(new MouseEvent('click'))
      expect(onClick).not.toHaveBeenCalled()
    })

    it('should not call the `onClick` method when loading', () => {
      const onClick = vi.fn()
      const result = useBaseClickable({ onClick, loading: true })
      void result.onClick(new MouseEvent('click'))
      expect(onClick).not.toHaveBeenCalled()
    })

    it('should not emit the "click" event', () => {
      const onClick = vi.fn()
      const emit = vi.fn()
      // @ts-expect-error: ignore
      const result = useBaseClickable({ onClick }, { emit })
      void result.onClick(new MouseEvent('click'))
      expect(emit).not.toHaveBeenCalledWith()
    })
  })

  describe('error', () => {
    it('should catch the error and set it to the state', async() => {
      const error = new Error('Test error')
      const onClick = vi.fn(() => { throw error })
      const emit = vi.fn()
      // @ts-expect-error: ignore
      const result = useBaseClickable({ onClick }, { emit })
      void result.onClick(new MouseEvent('click'))
      await new Promise(nextTick)
      expect(emit).toHaveBeenCalledWith('update:error', error)
    })

    it('should catch a promise error and set it to the state', async() => {
      const error = new Error('Test error')
      const onClick = vi.fn(() => Promise.reject(error))
      const emit = vi.fn()
      // @ts-expect-error: ignore
      const result = useBaseClickable({ onClick }, { emit })
      void result.onClick(new MouseEvent('click'))
      await new Promise(nextTick)
      expect(emit).toHaveBeenCalledWith('update:error', error)
    })

    it('should unset the error when the click event is successful', async() => {
      const error = new Error('Test error')
      const onClick = vi.fn()
      const emit = vi.fn()
      // @ts-expect-error: ignore
      const result = useBaseClickable({ onClick, error }, { emit })
      void result.onClick(new MouseEvent('click'))
      await new Promise(nextTick)
      expect(emit).toHaveBeenCalledWith('update:error', undefined)
    })
  })

  describe('loading', () => {
    it('should not set the loading state when the click event is not a promise', async() => {
      const onClick = vi.fn()
      const emit = vi.fn()
      // @ts-expect-error: ignore
      const result = useBaseClickable({ onClick }, { emit })
      void result.onClick(new MouseEvent('click'))
      await new Promise(nextTick)
      expect(emit).toHaveBeenCalledTimes(0)
    })

    it('should set the loading state when the click event is a promise', async() => {
      const onClick = vi.fn(() => Promise.resolve())
      const emit = vi.fn()
      // @ts-expect-error: ignore
      const result = useBaseClickable({ onClick }, { emit })
      void result.onClick(new MouseEvent('click'))
      await new Promise(nextTick)
      expect(emit).toHaveBeenCalledTimes(2)
      expect(emit).toHaveBeenNthCalledWith(1, 'update:loading', true)
      expect(emit).toHaveBeenNthCalledWith(2, 'update:loading', false)
    })

    it('should set the loading state when the click event is a promise and catch an error', async() => {
      const error = new Error('Test error')
      const onClick = vi.fn(() => Promise.reject(error))
      const emit = vi.fn()
      // @ts-expect-error: ignore
      const result = useBaseClickable({ onClick }, { emit })
      void result.onClick(new MouseEvent('click'))
      await new Promise(nextTick)
      expect(emit).toHaveBeenCalledTimes(3)
      expect(emit).toHaveBeenNthCalledWith(1, 'update:loading', true)
      expect(emit).toHaveBeenNthCalledWith(3, 'update:loading', false)
    })
  })
}
