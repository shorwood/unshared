import { mount } from '@vue/test-utils'
import { getCurrentInstance } from 'vue'
import { isReactive, nextTick } from 'vue'
import { BASE_STATE_SYMBOL, useBaseState } from './useBaseState'

// @vitest-environment happy-dom
describe('useBaseState', () => {
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
})
