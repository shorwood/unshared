import { mount } from '@vue/test-utils'
import { getCurrentInstance, isReactive } from 'vue'
import { BASE_CLICKABLE_SYMBOL, useBaseClickable } from './useBaseClickable'

// @vitest-environment happy-dom
describe('useBaseClickable', () => {
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
      result.onClick(event)
      expect(onClick).toHaveBeenCalledWith(event)
    })

    it('should not call the `onClick` method when disabled', () => {
      const onClick = vi.fn()
      const result = useBaseClickable({ onClick, disabled: true })
      result.onClick(new MouseEvent('click'))
      expect(onClick).not.toHaveBeenCalled()
    })

    it('should not call the `onClick` method when readonly', () => {
      const onClick = vi.fn()
      const result = useBaseClickable({ onClick, readonly: true })
      result.onClick(new MouseEvent('click'))
      expect(onClick).not.toHaveBeenCalled()
    })

    it('should not call the `onClick` method when loading', () => {
      const onClick = vi.fn()
      const result = useBaseClickable({ onClick, loading: true })
      result.onClick(new MouseEvent('click'))
      expect(onClick).not.toHaveBeenCalled()
    })

    it('should not emit the "click" event', () => {
      const onClick = vi.fn()
      const emit = vi.fn()
      // @ts-expect-error: ignore
      const result = useBaseClickable({ onClick }, { emit })
      result.onClick(new MouseEvent('click'))
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
      result.onClick(new MouseEvent('click'))
      await new Promise(resolve => process.nextTick(resolve))
      expect(emit).toHaveBeenCalledWith('update:error', error)
    })

    it('should catch a promise error and set it to the state', async() => {
      const error = new Error('Test error')
      const onClick = vi.fn(() => Promise.reject(error))
      const emit = vi.fn()
      // @ts-expect-error: ignore
      const result = useBaseClickable({ onClick }, { emit })
      result.onClick(new MouseEvent('click'))
      await new Promise(resolve => process.nextTick(resolve))
      expect(emit).toHaveBeenCalledWith('update:error', error)
    })

    it('should unset the error when the click event is successful', async() => {
      const error = new Error('Test error')
      const onClick = vi.fn()
      const emit = vi.fn()
      // @ts-expect-error: ignore
      const result = useBaseClickable({ onClick, error }, { emit })
      result.onClick(new MouseEvent('click'))
      await new Promise(resolve => process.nextTick(resolve))
      expect(emit).toHaveBeenCalledWith('update:error', undefined)
    })
  })

  describe('loading', () => {
    it('should not set the loading state when the click event is not a promise', async() => {
      const onClick = vi.fn()
      const emit = vi.fn()
      // @ts-expect-error: ignore
      const result = useBaseClickable({ onClick }, { emit })
      result.onClick(new MouseEvent('click'))
      await new Promise(resolve => process.nextTick(resolve))
      expect(emit).toHaveBeenCalledTimes(0)
    })

    it('should set the loading state when the click event is a promise', async() => {
      const onClick = vi.fn(() => Promise.resolve())
      const emit = vi.fn()
      // @ts-expect-error: ignore
      const result = useBaseClickable({ onClick }, { emit })
      result.onClick(new MouseEvent('click'))
      await new Promise(resolve => process.nextTick(resolve))
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
      result.onClick(new MouseEvent('click'))
      await new Promise(resolve => process.nextTick(resolve))
      expect(emit).toHaveBeenCalledTimes(3)
      expect(emit).toHaveBeenNthCalledWith(1, 'update:loading', true)
      expect(emit).toHaveBeenNthCalledWith(3, 'update:loading', false)
    })
  })
})
