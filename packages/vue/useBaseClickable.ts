import { computed, getCurrentInstance } from 'vue'
import { toReactive } from '@vueuse/core'
import { throttle } from '@unshared/functions/throttle'
import { debounce } from '@unshared/functions/debounce'
import { BASE_STATE_OPTIONS, BaseStateOptions, useBaseState } from './useBaseState'

/** The symbol to inject the base clickable composable. */
export const BASE_CLICKABLE_SYMBOL = Symbol('baseClickable')

/** The base clickable properties. */
export const BASE_CLICKABLE_OPTIONS = {
  ...BASE_STATE_OPTIONS,
  onClick: Function,
  debounce: { type: Number, default: 0 },
  throttle: { type: Number, default: 0 },
}

/** The properties of the base clickable component. */
export interface BaseClickableOptions extends BaseStateOptions {

  /**
   * The callback to call when the component is clicked. This is used to
   * handle the click event of the component and should be called when the
   * component is clicked.
   *
   * @default false
   */
  onClick?: () => Promise<void> | void

  /**
   * The debounce time to wait before calling the `onClick` method. This is
   * used to debounce the click event and prevent multiple clicks from being
   * called in a short amount of time.
   *
   * @default 0
   */
  debounce?: number

  /**
   * The throttle time to wait before calling the `onClick` method. This is
   * used to throttle the click event and prevent multiple clicks from being
   * called in a short amount of time.
   *
   * @default 0
   */
  throttle?: number
}

/** The composable properties returned by the `useBaseClickable` composable. */
export interface BaseClickableComposable {

  /** The HTML attributes to apply to the component. */
  attributes: Record<string, unknown>

  /** The method to call when the component is clicked. */
  onClick: () => Promise<void> | void

  /** The method to call when the component is clicked without debouncing or throttling. */
  onClickRaw: () => Promise<void> | void
}

declare module '@vue/runtime-core' {
  interface ComponentInternalInstance {
    [BASE_CLICKABLE_SYMBOL]?: BaseClickableComposable
  }
}

/**
 * A composable that provides the base clickable state and handling for a component.
 *
 * @param props The properties of the component passed by the `setup` function.
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
export function useBaseClickable(props: BaseClickableOptions = {}, instance = getCurrentInstance()): BaseClickableComposable {
  if (instance?.[BASE_CLICKABLE_SYMBOL]) return instance[BASE_CLICKABLE_SYMBOL]

  // --- Inject the base state composable to get the state properties.
  const state = useBaseState(props, instance)

  // --- Handle click event to make it update the loading state
  // --- and catch any error that might occur during the click event.
  function onClickRaw() {
    if (!props.onClick || state.disabled || state.readonly || state.loading) return
    try {
      state.error = undefined
      const result = props.onClick()
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

  // --- Wrap function to handle loading state & catch error.
  const onClick = computed(() => {
    if (props.throttle && props.throttle > 0) return throttle(onClickRaw, props.throttle) as () => Promise<void> | void
    if (props.debounce && props.debounce > 0) return debounce(onClickRaw, props.debounce) as () => Promise<void> | void
    return onClickRaw
  })

  // --- Create the reactive attributes for the component.
  const attributes = computed(() => ({
    onClick: () => onClick.value(),
  }))

  // --- Provide the composable into the component and return it.
  const composable = toReactive({ attributes, onClick, onClickRaw })
  if (instance) instance[BASE_CLICKABLE_SYMBOL] = composable
  return composable
}

/* v8 ignore next */
// @vitest-environment happy-dom
if (import.meta.vitest) {
  const { isReactive } = await import('vue')
  const { mount } = await import('@vue/test-utils')
  // eslint-disable-next-line @typescript-eslint/unbound-method
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
    it('should call the `onClick` method', () => {
      const onClick = vi.fn()
      const emit = vi.fn()
      // @ts-expect-error: ignore
      const result = useBaseClickable({ onClick }, { emit })
      void result.onClick()
      expect(onClick).toHaveBeenCalledWith()
    })

    it('should not call the `onClick` method when not provided', () => {
      const emit = vi.fn()
      // @ts-expect-error: ignore
      const result = useBaseClickable({}, { emit })
      void result.onClick()
      expect(emit).not.toHaveBeenCalled()
    })

    it('should not call the `onClick` method when disabled', () => {
      const onClick = vi.fn()
      const emit = vi.fn()
      // @ts-expect-error: ignore
      const result = useBaseClickable({ onClick, disabled: true }, { emit })
      void result.onClick()
      expect(onClick).not.toHaveBeenCalled()
    })

    it('should not call the `onClick` method when readonly', () => {
      const onClick = vi.fn()
      const emit = vi.fn()
      // @ts-expect-error: ignore
      const result = useBaseClickable({ onClick, readonly: true }, { emit })
      void result.onClick()
      expect(onClick).not.toHaveBeenCalled()
    })

    it('should not call the `onClick` method when loading', () => {
      const onClick = vi.fn()
      const emit = vi.fn()
      // @ts-expect-error: ignore
      const result = useBaseClickable({ onClick, loading: true }, { emit })
      void result.onClick()
      expect(onClick).not.toHaveBeenCalled()
    })

    it('should debounce the `onClick` method', async() => {
      vi.useFakeTimers()
      const onClick = vi.fn()
      const emit = vi.fn()
      // @ts-expect-error: ignore
      const result = useBaseClickable({ onClick, debounce: 50 }, { emit })
      void result.onClick()
      void result.onClick()
      void result.onClick()
      expect(onClick).toHaveBeenCalledTimes(0)
      vi.advanceTimersByTime(100)
      await new Promise(nextTick)
      expect(onClick).toHaveBeenCalledTimes(1)
    })

    it('should throttle the `onClick` method', async() => {
      vi.useFakeTimers()
      const onClick = vi.fn()
      const emit = vi.fn()
      // @ts-expect-error: ignore
      const result = useBaseClickable({ onClick, throttle: 50 }, { emit })
      void result.onClick()
      void result.onClick()
      void result.onClick()
      expect(onClick).toHaveBeenCalledTimes(1)
      vi.advanceTimersByTime(100)
      await new Promise(nextTick)
      expect(onClick).toHaveBeenCalledTimes(1)
    })
  })

  describe('error', () => {
    it('should catch the error and set it to the state', async() => {
      const error = new Error('Test error')
      const onClick = vi.fn(() => { throw error })
      const emit = vi.fn()
      // @ts-expect-error: ignore
      const result = useBaseClickable({ onClick }, { emit })
      void result.onClick()
      await new Promise(nextTick)
      expect(emit).toHaveBeenCalledWith('update:error', error)
    })

    it('should catch a promise error and set it to the state', async() => {
      const error = new Error('Test error')
      const onClick = vi.fn(() => Promise.reject(error))
      const emit = vi.fn()
      // @ts-expect-error: ignore
      const result = useBaseClickable({ onClick }, { emit })
      void result.onClick()
      await new Promise(nextTick)
      expect(emit).toHaveBeenCalledWith('update:error', error)
    })

    it('should unset the error when the click event is successful', async() => {
      const error = new Error('Test error')
      const onClick = vi.fn()
      const emit = vi.fn()
      // @ts-expect-error: ignore
      const result = useBaseClickable({ onClick, error }, { emit })
      void result.onClick()
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
      void result.onClick()
      await new Promise(nextTick)
      expect(emit).toHaveBeenCalledTimes(0)
    })

    it('should set the loading state when the click event is a promise', async() => {
      const onClick = vi.fn(() => Promise.resolve())
      const emit = vi.fn()
      // @ts-expect-error: ignore
      const result = useBaseClickable({ onClick }, { emit })
      void result.onClick()
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
      void result.onClick()
      await new Promise(nextTick)
      expect(emit).toHaveBeenCalledTimes(3)
      expect(emit).toHaveBeenNthCalledWith(1, 'update:loading', true)
      expect(emit).toHaveBeenNthCalledWith(3, 'update:loading', false)
    })
  })
}
