/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */
/* eslint-disable sonarjs/no-duplicate-string */
import { ComponentObjectPropsOptions, ExtractPropTypes, Prop, Ref, computed, getCurrentInstance } from 'vue'
import { toReactive, useVModel } from '@vueuse/core'
import { cleanAttributes, cleanClasses } from '../utils'

/** The symbol to provide the composable into the component. */
const BASE_STATE_SYMBOL = Symbol('baseState')

export const BASE_STATE_OPTIONS = {

  /**
   * If `true`, all interactions with the component should be disabled.
   * Meaning that the component should not be able to send any `click`,
   * `focus`, `hover`, or any other interaction event.
   *
   * @default false
   */
  'disabled': Boolean as Prop<boolean | undefined>,
  'onUpdate:disabled': Function as Prop<(disabled: boolean) => void | undefined>,

  /**
   * If `true`, the component should be in an error state. Meaning that
   * the component should show an error message or a visual indication
   * that something went wrong.
   *
   * @default undefined
   */
  'error': [Error, String] as Prop<Error | string | undefined>,
  'onUpdate:error': Function as Prop<(error?: Error | string) => void | undefined>,

  /**
   * If `true`, the component should be in a loading state. Meaning that
   * the component should not be able to send any `click`, `focus`, `hover`,
   * or any other interaction event but should still be able to display
   * the content as if it was enabled.
   *
   * @default false
   */
  'loading': [Boolean],
  'onUpdate:loading': Function as Prop<(loading: boolean) => void | undefined>,

  /**
   * If `true`, the component should be in a read-only state. Meaning that
   * the component should not be able to send any `click`, `focus`, `hover`,
   * or any other interaction event but should still be able to display
   * the content as if it was enabled.
   *
   * @default false
   */
  'readonly': [Boolean],
  'onUpdate:readonly': Function as Prop<(readonly: boolean) => void | undefined>,

  /**
   * The CSS class to apply when the component is disabled. This allows you
   * to customize the appearance of the component when it is disabled without
   * handling the CSS in the component itself.
   *
   * @default ''
   */
  'classDisabled': { type: [String], default: '' } as Prop<string | undefined>,

  /**
   * The CSS class to apply when the component is in an error state. This
   * allows you to customize the appearance of the component when it is in
   * an error state without handling the CSS in the component itself.
   *
   * @default ''
   */
  'classError': { type: [String], default: '' } as Prop<string | undefined>,

  /**
   * The CSS class to apply when the component is loading. This allows you
   * to customize the appearance of the component when it is loading without
   * handling the CSS in the component itself.
   *
   * @default ''
   */
  'classLoading': { type: [String], default: '' } as Prop<string | undefined>,

  /**
   * The CSS class to apply when the component is read-only. This allows you
   * to customize the appearance of the component when it is read-only without
   * handling the CSS in the component itself.
   *
   * @default ''
   */
  'classReadonly': { type: [String], default: '' } as Prop<string | undefined>,
} satisfies ComponentObjectPropsOptions

/** The properties of the base state component. */
export type BaseStateOptions = ExtractPropTypes<typeof BASE_STATE_OPTIONS>

/** The properties of the composable returned by `useBaseState`. */
export interface BaseStateComposable {
  attributes: Record<string, unknown>
  classes: Record<string, boolean>
  disabled: boolean
  error: Error | string | undefined
  errorMessage: string | undefined
  loading: boolean
  readonly: boolean
}

declare module '@vue/runtime-core' {
  interface ComponentInternalInstance {
    [BASE_STATE_SYMBOL]?: BaseStateComposable
  }
}

/**
 * A composable that provides the base state for a component. This includes
 * handling the `disabled`, `readonly`, and `loading` states of the component
 * and applying the appropriate classes and attributes to the component.
 *
 * @param props The properties of the component passed by the `setup` function.
 * @param instance The internal instance of the component.
 * @returns An object with the computed classes and attributes.
 * @example
 * defineComponent({
 *   mixins: [BaseState],
 *   setup(props, context) {
 *     return useBaseState(props, context)
 *   }
 * })
 */
export function useBaseState(props: BaseStateOptions = {}, instance = getCurrentInstance()): BaseStateComposable {
  if (instance?.[BASE_STATE_SYMBOL]) return instance[BASE_STATE_SYMBOL]

  // --- Create two-way bindings for the properties.
  const emit = instance?.emit
  const loading = useVModel(props, 'loading', emit, { passive: true }) as Ref<boolean>
  const disabled = useVModel(props, 'disabled', emit, { passive: true }) as Ref<boolean>
  const readonly = useVModel(props, 'readonly', emit, { passive: true }) as Ref<boolean>
  const error = useVModel(props, 'error', emit, { passive: true }) as Ref<Error | string | undefined>

  // --- Dynamically compute classes.
  const classes = computed(() => cleanClasses({
    [props.classDisabled!]: disabled.value,
    [props.classError!]: !!error.value,
    [props.classLoading!]: loading.value,
    [props.classReadonly!]: readonly.value,
  }))

  // --- Get the error message if it is an `Error` instance or a string.
  const errorMessage = computed(() => {
    if (error.value instanceof Error) return error.value.message
    if (typeof error.value === 'string') return error.value
    return
  })

  // --- Build the props object.
  const attributes = computed(() => cleanAttributes({
    'aria-busy': (props.loading || loading.value) ? true : undefined,
    'aria-invalid': (props.error || error.value) ? true : undefined,
    'aria-readonly': (props.readonly || readonly.value) ? true : undefined,
    'aria-disabled': (props.disabled || disabled.value) ? true : undefined,
    'aria-errormessage': errorMessage.value || undefined,
    'class': classes.value,
    'disabled': (props.disabled || disabled.value) ? true : undefined,
    'readonly': (props.readonly || readonly.value) ? true : undefined,
  }))

  // --- Provide the composable into the component and return it.
  const composable = toReactive({ attributes, classes, disabled, error, errorMessage, loading, readonly })
  if (instance) instance[BASE_STATE_SYMBOL] = composable
  return composable
}

/* v8 ignore start */
// @vitest-environment happy-dom
if (import.meta.vitest) {
  const { isReactive, nextTick } = await import('vue')
  const { mount } = await import('@vue/test-utils')

  describe('composable', () => {
    it('should return a reactive object', () => {
      const result = useBaseState()
      const reactive = isReactive(result)
      expect(reactive).toBe(true)
    })

    it('should provide the composable into the component', () => {
      mount(() => {
        const result = useBaseState()
        const instance = getCurrentInstance()
        const injected = instance?.[BASE_STATE_SYMBOL]
        expect(result).toStrictEqual(injected)
      })
    })

    it('should return the same instance when called multiple times', () => {
      mount(() => {
        const result1 = useBaseState()
        const result2 = useBaseState()
        expect(result1).toBe(result2)
      })
    })

    it('should return different instances for different components', () => {
      const result1 = useBaseState()
      const result2 = useBaseState()
      expect(result1).not.toBe(result2)
    })
  })

  describe('classes', () => {
    it('should apply the disabled class when the disabled state is true', () => {
      const result = useBaseState({ disabled: true, classDisabled: 'disabled' })
      expect(result.classes).toStrictEqual({ disabled: true })
    })

    it('should apply the error class when the error state is defined', () => {
      const result = useBaseState({ error: 'Error', classError: 'error' })
      expect(result.classes).toStrictEqual({ error: true })
    })

    it('should apply the loading class when the loading state is true', () => {
      const result = useBaseState({ loading: true, classLoading: 'loading' })
      expect(result.classes).toStrictEqual({ loading: true })
    })

    it('should apply the readonly class when the readonly state is true', () => {
      const result = useBaseState({ readonly: true, classReadonly: 'readonly' })
      expect(result.classes).toStrictEqual({ readonly: true })
    })

    it('should apply multiple classes', () => {
      const result = useBaseState({
        disabled: true,
        error: 'Error',
        loading: true,
        readonly: true,
        classDisabled: 'disabled',
        classError: 'error',
        classLoading: 'loading',
        classReadonly: 'readonly',
      })
      expect(result.classes).toStrictEqual({ disabled: true, error: true, loading: true, readonly: true })
    })
  })

  describe('attributes', () => {
    it('should apply the disabled attribute when the disabled state is true', () => {
      const result = useBaseState({ disabled: true })
      expect(result.attributes).toStrictEqual({
        'disabled': true,
        'aria-disabled': true,
      })
    })

    it('should apply the error attribute when the error state is defined', () => {
      const result = useBaseState({ error: 'Something went wrong' })
      expect(result.attributes).toStrictEqual({
        'aria-errormessage': 'Something went wrong',
        'aria-invalid': true,
      })
    })

    it('should apply the loading attribute when the loading state is true', () => {
      const result = useBaseState({ loading: true })
      expect(result.attributes).toStrictEqual({
        'aria-busy': true,
      })
    })

    it('should apply the readonly attribute when the readonly state is true', () => {
      const result = useBaseState({ readonly: true })
      expect(result.attributes).toStrictEqual({
        'readonly': true,
        'aria-readonly': true,
      })
    })

    it('should apply multiple attributes', () => {
      const result = useBaseState({
        disabled: true,
        error: 'Something went wrong',
        loading: true,
        readonly: true,
      })
      expect(result.attributes).toStrictEqual({
        'disabled': true,
        'aria-disabled': true,
        'aria-errormessage': 'Something went wrong',
        'aria-invalid': true,
        'aria-busy': true,
        'readonly': true,
        'aria-readonly': true,
      })
    })
  })

  describe('model', () => {
    it('should provide the disabled model', () => {
      const result = useBaseState({ disabled: true })
      expect(result.disabled).toBe(true)
    })

    it('should provide the error model', () => {
      const result = useBaseState({ error: new Error('Something went wrong') })
      expect(result.error).toMatchObject(new Error('Something went wrong'))
    })

    it('should provide the loading model', () => {
      const result = useBaseState({ loading: true })
      expect(result.loading).toBe(true)
    })

    it('should provide the readonly model', () => {
      const result = useBaseState({ readonly: true })
      expect(result.readonly).toBe(true)
    })

    it('should provide the error message model when the error is a string', () => {
      const result = useBaseState({ error: 'Something went wrong' })
      expect(result.errorMessage).toBe('Something went wrong')
    })

    it('should provide the error message model when the error is an instance of `Error`', () => {
      const result = useBaseState({ error: new Error('Something went wrong') })
      expect(result.errorMessage).toBe('Something went wrong')
    })
  })

  describe('two-way binding', () => {
    it('should update the disabled state', async() => {
      const emit = vi.fn()
      // @ts-expect-error: Mocking the component instance.
      const result = useBaseState({ disabled: false }, { emit })
      expect(result.disabled).toBe(false)
      result.disabled = true
      await nextTick()
      expect(emit).toHaveBeenCalledWith('update:disabled', true)
    })

    it('should update the error state', async() => {
      const emit = vi.fn()
      // @ts-expect-error: Mocking the component instance.
      const result = useBaseState({ error: undefined }, { emit })
      expect(result.error).toBeUndefined()
      result.error = new Error('Something went wrong')
      await nextTick()
      expect(emit).toHaveBeenCalledWith('update:error', result.error)
    })

    it('should update the loading state', async() => {
      const emit = vi.fn()
      // @ts-expect-error: Mocking the component instance.
      const result = useBaseState({ loading: false }, { emit })
      expect(result.loading).toBe(false)
      result.loading = true
      await nextTick()
      expect(emit).toHaveBeenCalledWith('update:loading', true)
    })

    it('should update the readonly state', async() => {
      const emit = vi.fn()
      // @ts-expect-error: Mocking the component instance.
      const result = useBaseState({ readonly: false }, { emit })
      expect(result.readonly).toBe(false)
      result.readonly = true
      await nextTick()
      expect(emit).toHaveBeenCalledWith('update:readonly', true)
    })
  })
}
