import type { BaseInputToggleOptions } from './useBaseInputToggle'
import { mount } from '@vue/test-utils'
import { getCurrentInstance, isReactive, nextTick, reactive } from 'vue'
import { BASE_INPUT_TOGGLE_SYMBOL, useBaseInputToggle } from './useBaseInputToggle'

// @vitest-environment happy-dom
describe('useBaseInputToggle', () => {
  describe('composable', () => {
    it('should return a reactive object', () => {
      const result = useBaseInputToggle()
      const reactive = isReactive(result)
      expect(reactive).toBe(true)
    })

    it('should provide the composable into the component', () => {
      mount(() => {
        const result = useBaseInputToggle()
        const instance = getCurrentInstance()
        const injected = instance?.[BASE_INPUT_TOGGLE_SYMBOL]
        expect(result).toStrictEqual(injected)
      })
    })

    it('should return the same instance when called multiple times', () => {
      mount(() => {
        const result1 = useBaseInputToggle()
        const result2 = useBaseInputToggle()
        expect(result1).toBe(result2)
      })
    })

    it('should return different instances for different components', () => {
      const result1 = useBaseInputToggle()
      const result2 = useBaseInputToggle()
      expect(result1).not.toBe(result2)
    })
  })

  describe('switch', () => {
    describe('model', () => {
      it('should be true when the model is true', () => {
        const result = useBaseInputToggle({ modelValue: true, type: 'switch' })
        expect(result.isActive).toBe(true)
      })

      it('should be false when the model is false', () => {
        const result = useBaseInputToggle({ modelValue: false, type: 'switch' })
        expect(result.isActive).toBe(false)
      })

      it('should be false when the model is not a boolean', () => {
        // @ts-expect-error: ignore
        const result = useBaseInputToggle({ modelValue: 'not-true', type: 'switch' })
        expect(result.isActive).toBe(false)
      })

      it('should change `isActive` when `modelValue` changes', async() => {
        const props = reactive({ modelValue: false, type: 'switch' }) as BaseInputToggleOptions
        const result = useBaseInputToggle(props)
        props.modelValue = true
        await nextTick()
        expect(result.isActive).toBe(true)
      })

      it('should change `model` to `true` when `modelValue` changes to `true`', async() => {
        const props = reactive({ modelValue: false, type: 'switch' }) as BaseInputToggleOptions
        const result = useBaseInputToggle(props)
        props.modelValue = true
        await nextTick()
        expect(result.model).toBe(true)
      })
    })

    describe('toggle', () => {
      it('should the model to true when the model is false', () => {
        const emit = vi.fn()
        // @ts-expect-error: ignore
        const result = useBaseInputToggle({ modelValue: false, type: 'switch' }, { emit })
        result.toggle()
        expect(result.model).toBe(true)
      })

      it('should toggle the model to false when the model is true', () => {
        const emit = vi.fn()
        // @ts-expect-error: ignore
        const result = useBaseInputToggle({ modelValue: true, type: 'switch' }, { emit })
        result.toggle()
        expect(result.model).toBe(false)
      })

      it('should toggle the model to true when the model is not a boolean', () => {
        const emit = vi.fn()
        // @ts-expect-error: ignore
        const result = useBaseInputToggle({ modelValue: 'not-true', type: 'switch' }, { emit })
        result.toggle()
        expect(result.model).toBe(true)
      })
    })

    describe('emit', () => {
      it('should emit when toggling the model to true', async() => {
        const emit = vi.fn()
        // @ts-expect-error: ignore
        const result = useBaseInputToggle({ modelValue: false, type: 'switch' }, { emit })
        result.toggle()
        await nextTick()
        expect(emit).toHaveBeenNthCalledWith(1, 'toggle')
        expect(emit).toHaveBeenNthCalledWith(2, 'off')
        expect(emit).toHaveBeenNthCalledWith(3, 'update:modelValue', true)
      })

      it('should emit when toggling the model to false', async() => {
        const emit = vi.fn()
        // @ts-expect-error: ignore
        const result = useBaseInputToggle({ modelValue: true, type: 'switch' }, { emit })
        result.toggle()
        await nextTick()
        expect(emit).toHaveBeenNthCalledWith(1, 'toggle' )
        expect(emit).toHaveBeenNthCalledWith(2, 'on' )
        expect(emit).toHaveBeenNthCalledWith(3, 'update:modelValue', false)
      })
    })

    describe('attributes', () => {
      it('should set the attribute when active and tag `input`', () => {
        const result = useBaseInputToggle({ modelValue: true, type: 'switch', as: 'input' })
        expect(result.attributes).toStrictEqual({
          checked: true,
          onClick: result.toggle,
          type: 'checkbox',
        })
      })

      it('should set the attribute when active and tag is `button`', () => {
        const result = useBaseInputToggle({ modelValue: true, type: 'switch', as: 'button' })
        expect(result.attributes).toStrictEqual({
          'aria-pressed': true,
          'aria-selected': true,
          'onClick': result.toggle,
          'role': 'checkbox',
          'selected': true,
          'tabindex': 0,
        })
      })

      it('should set the attribute when inactive and tag is `input`', () => {
        const result = useBaseInputToggle({ modelValue: false, type: 'switch', as: 'input' })
        expect(result.attributes).toStrictEqual({
          onClick: result.toggle,
          type: 'checkbox',
        })
      })

      it('should set the attribute when inactive and tag is `button`', () => {
        const result = useBaseInputToggle({ modelValue: false, type: 'switch', as: 'button' })
        expect(result.attributes).toStrictEqual({
          'aria-pressed': false,
          'onClick': result.toggle,
          'role': 'checkbox',
          'tabindex': 0,
        })
      })
    })
  })

  describe('radio', () => {
    describe('model', () => {
      it('should be true when the model is the provided value', () => {
        const result = useBaseInputToggle({ modelValue: 'one', value: 'one', type: 'radio' })
        expect(result.isActive).toBe(true)
      })

      it('should be false when the model is not the provided value', () => {
        const result = useBaseInputToggle({ modelValue: 'two', value: 'one', type: 'radio' })
        expect(result.isActive).toBe(false)
      })

      it('should change `isActive` when `modelValue` changes', async() => {
        const props = reactive({ modelValue: 'two', value: 'one', type: 'radio' }) as BaseInputToggleOptions
        const result = useBaseInputToggle(props)
        props.modelValue = 'one'
        await nextTick()
        expect(result.isActive).toBe(true)
      })

      it('should change `model` to the provided value when `modelValue` changes to the provided value', async() => {
        const props = reactive({ modelValue: 'two', value: 'one', type: 'radio' }) as BaseInputToggleOptions
        const result = useBaseInputToggle(props)
        props.modelValue = 'one'
        await nextTick()
        expect(result.model).toBe('one')
      })

      it('should default the value to the key of the component', () => {
        // @ts-expect-error: ignore
        const result = useBaseInputToggle({ modelValue: 'one', type: 'radio' }, { props: { key: 'one' } })
        expect(result.isActive).toBe(true)
      })
    })

    describe('toggle', () => {
      it('should set the model to the provided value when the model is different', () => {
        const emit = vi.fn()
        // @ts-expect-error: ignore
        const result = useBaseInputToggle({ modelValue: 'two', value: 'one', type: 'radio' }, { emit })
        result.toggle()
        expect(result.model).toBe('one')
      })

      it('should set the model to the provided value when the model is undefined', () => {
        const emit = vi.fn()
        // @ts-expect-error: ignore
        const result = useBaseInputToggle({ modelValue: undefined, value: 'one', type: 'radio' }, { emit })
        result.toggle()
        expect(result.model).toBe('one')
      })

      it('should not emit when the model is the same as the provided value', () => {
        const emit = vi.fn()
        // @ts-expect-error: ignore
        const result = useBaseInputToggle({ modelValue: 'one', value: 'one', type: 'radio' }, { emit })
        result.toggle()
        expect(result.model).toBe('one')
      })
    })

    describe('emit', () => {
      it('should set the model to the provided value when the model is different', async() => {
        const emit = vi.fn()
        // @ts-expect-error: ignore
        const result = useBaseInputToggle({ modelValue: 'two', value: 'one', type: 'radio' }, { emit })
        result.toggle()
        await nextTick()
        expect(emit).toHaveBeenNthCalledWith(1, 'toggle')
        expect(emit).toHaveBeenNthCalledWith(2, 'off')
        expect(emit).toHaveBeenNthCalledWith(3, 'update:modelValue', 'one')
      })

      it('should set the model to the provided value when the model is undefined', async() => {
        const emit = vi.fn()
        // @ts-expect-error: ignore
        const result = useBaseInputToggle({ modelValue: undefined, value: 'one', type: 'radio' }, { emit })
        result.toggle()
        await nextTick()
        expect(emit).toHaveBeenNthCalledWith(1, 'toggle')
        expect(emit).toHaveBeenNthCalledWith(2, 'off')
        expect(emit).toHaveBeenNthCalledWith(3, 'update:modelValue', 'one')
      })

      it('should not emit when the model is the same as the provided value', async() => {
        const emit = vi.fn()
        // @ts-expect-error: ignore
        const result = useBaseInputToggle({ modelValue: 'one', value: 'one', type: 'radio' }, { emit })
        result.toggle()
        await nextTick()
        expect(emit).not.toHaveBeenCalled()
      })
    })

    describe('attributes', () => {
      it('should set the attribute when active and tag `input`', () => {
        const result = useBaseInputToggle({ modelValue: 'one', value: 'one', type: 'radio', as: 'input' })
        expect(result.attributes).toStrictEqual({
          checked: true,
          onClick: result.toggle,
          type: 'radio',
        })
      })

      it('should set the attribute when active and tag is `button`', () => {
        const result = useBaseInputToggle({ modelValue: 'one', value: 'one', type: 'radio', as: 'button' })
        expect(result.attributes).toStrictEqual({
          'aria-pressed': true,
          'aria-selected': true,
          'onClick': result.toggle,
          'role': 'radio',
          'selected': true,
          'tabindex': 0,
        })
      })

      it('should set the attribute when inactive and tag is `input`', () => {
        const result = useBaseInputToggle({ modelValue: 'two', value: 'one', type: 'radio', as: 'input' })
        expect(result.attributes).toStrictEqual({
          onClick: result.toggle,
          type: 'radio',
        })
      })

      it('should set the attribute when inactive and tag is `button`', () => {
        const result = useBaseInputToggle({ modelValue: 'two', value: 'one', type: 'radio', as: 'button' })
        expect(result.attributes).toStrictEqual({
          'aria-pressed': false,
          'onClick': result.toggle,
          'role': 'radio',
          'tabindex': 0,
        })
      })
    })
  })

  describe('checkbox', () => {
    describe('model', () => {
      it('should be true when the model contains the provided value', () => {
        const result = useBaseInputToggle({ modelValue: ['one', 'two'], value: 'one', type: 'checkbox' })
        expect(result.isActive).toBe(true)
      })

      it('should be false when the model does not contain the provided value', () => {
        const result = useBaseInputToggle({ modelValue: ['two'], value: 'one', type: 'checkbox' })
        expect(result.isActive).toBe(false)
      })

      it('should be false when the model is not an array', () => {
        // @ts-expect-error: ignore
        const result = useBaseInputToggle({ modelValue: 'one', value: 'one', type: 'checkbox' })
        expect(result.isActive).toBe(false)
      })

      it('should be true when the model contains all the provided values', () => {
        const result = useBaseInputToggle({ modelValue: ['one', 'two', 'three'], value: ['one', 'two'], type: 'checkbox' })
        expect(result.isActive).toBe(true)
      })

      it('should be mixed when the model contains some of the provided values', () => {
        const result = useBaseInputToggle({ modelValue: ['one'], value: ['one', 'two'], type: 'checkbox' })
        expect(result.isActive).toBe('mixed')
      })

      it('should change `isActive` to `true` when `modelValue` changes', async() => {
        const props = reactive({ modelValue: ['two'], value: 'one', type: 'checkbox' }) as BaseInputToggleOptions
        const result = useBaseInputToggle(props)
        props.modelValue = ['one']
        await nextTick()
        expect(result.isActive).toBe(true)
      })

      it('should change `model` to the provided value when `modelValue` changes to the provided value', async() => {
        const props = reactive({ modelValue: ['two'], value: 'one', type: 'checkbox' }) as BaseInputToggleOptions
        const result = useBaseInputToggle(props)
        props.modelValue = ['one']
        await nextTick()
        expect(result.model).toStrictEqual(['one'])
      })
    })

    describe('toggle', () => {
      it('should push the value when the model is undefined', () => {
        const emit = vi.fn()
        // @ts-expect-error: ignore
        const result = useBaseInputToggle({ modelValue: undefined, value: 'one', type: 'checkbox' }, { emit })
        result.toggle()
        expect(result.model).toStrictEqual(['one'])
      })

      it('should push the value when the model does not contain the value', () => {
        const emit = vi.fn()
        // @ts-expect-error: ignore
        const result = useBaseInputToggle({ modelValue: ['two'], value: 'one', type: 'checkbox' }, { emit })
        result.toggle()
        expect(result.model).toStrictEqual(['two', 'one'])
      })

      it('should push the values when the model does not contain all the values', () => {
        const emit = vi.fn()
        // @ts-expect-error: ignore
        const result = useBaseInputToggle({ modelValue: ['two'], value: ['one', 'two'], type: 'checkbox' }, { emit })
        result.toggle()
        expect(result.model).toStrictEqual(['two', 'one'])
      })

      it('should remove the value when the model contains the value', () => {
        const emit = vi.fn()
        // @ts-expect-error: ignore
        const result = useBaseInputToggle({ modelValue: ['one', 'two'], value: 'one', type: 'checkbox' }, { emit })
        result.toggle()
        expect(result.model).toStrictEqual(['two'])
      })

      it('should remove the values when the model contains the values', () => {
        const emit = vi.fn()
        // @ts-expect-error: ignore
        const result = useBaseInputToggle({ modelValue: ['one', 'two', 'three'], value: ['one', 'two'], type: 'checkbox' }, { emit })
        result.toggle()
        expect(result.model).toStrictEqual(['three'])
      })
    })

    describe('emit', () => {
      it('should push the value when the model is undefined', async() => {
        const emit = vi.fn()
        // @ts-expect-error: ignore
        const result = useBaseInputToggle({ modelValue: undefined, value: 'one', type: 'checkbox' }, { emit })
        result.toggle()
        await nextTick()
        expect(emit).toHaveBeenNthCalledWith(1, 'toggle')
        expect(emit).toHaveBeenNthCalledWith(2, 'off')
        expect(emit).toHaveBeenNthCalledWith(3, 'update:modelValue', ['one'])
      })

      it('should push the value when the model does not contain the value', async() => {
        const emit = vi.fn()
        // @ts-expect-error: ignore
        const result = useBaseInputToggle({ modelValue: ['two'], value: 'one', type: 'checkbox' }, { emit })
        result.toggle()
        await nextTick()
        expect(emit).toHaveBeenNthCalledWith(1, 'toggle')
        expect(emit).toHaveBeenNthCalledWith(2, 'off')
        expect(emit).toHaveBeenNthCalledWith(3, 'update:modelValue', ['two', 'one'])
      })

      it('should push the values when the model does not contain all the values', async() => {
        const emit = vi.fn()
        // @ts-expect-error: ignore
        const result = useBaseInputToggle({ modelValue: ['two'], value: ['one', 'two'], type: 'checkbox' }, { emit })
        result.toggle()
        await nextTick()
        expect(emit).toHaveBeenNthCalledWith(1, 'toggle')
        expect(emit).toHaveBeenNthCalledWith(2, 'off')
        expect(emit).toHaveBeenNthCalledWith(3, 'update:modelValue', ['two', 'one'])
      })

      it('should remove the value when the model contains the value', async() => {
        const emit = vi.fn()
        // @ts-expect-error: ignore
        const result = useBaseInputToggle({ modelValue: ['one', 'two'], value: 'one', type: 'checkbox' }, { emit })
        result.toggle()
        await nextTick()
        expect(emit).toHaveBeenNthCalledWith(1, 'toggle')
        expect(emit).toHaveBeenNthCalledWith(2, 'on')
        expect(emit).toHaveBeenNthCalledWith(3, 'update:modelValue', ['two'])
      })
    })

    describe('attributes', () => {
      it('should set the attribute when active and tag `input`', () => {
        const result = useBaseInputToggle({ modelValue: ['one', 'two'], value: 'one', type: 'checkbox', as: 'input' })
        expect(result.attributes).toStrictEqual({
          checked: true,
          onClick: result.toggle,
          type: 'checkbox',
        })
      })

      it('should set the attribute when mixed and tag `input`', () => {
        const result = useBaseInputToggle({ modelValue: ['one'], value: ['one', 'two'], type: 'checkbox', as: 'input' })
        expect(result.attributes).toStrictEqual({
          checked: true,
          onClick: result.toggle,
          type: 'checkbox',
        })
      })

      it('should set the attribute when inactive and tag is `input`', () => {
        const result = useBaseInputToggle({ modelValue: ['two'], value: 'one', type: 'checkbox', as: 'input' })
        expect(result.attributes).toStrictEqual({
          onClick: result.toggle,
          type: 'checkbox',
        })
      })

      it('should set the attribute when active and tag is `button`', () => {
        const result = useBaseInputToggle({ modelValue: ['one', 'two'], value: 'one', type: 'checkbox', as: 'button' })
        expect(result.attributes).toStrictEqual({
          'aria-checked': true,
          'aria-selected': true,
          'onClick': result.toggle,
          'role': 'checkbox',
          'selected': true,
          'tabindex': 0,
        })
      })

      it('should set the attribute when mixed and tag is `button`', () => {
        const result = useBaseInputToggle({ modelValue: ['one'], value: ['one', 'two'], type: 'checkbox', as: 'button' })
        expect(result.attributes).toStrictEqual({
          'aria-checked': 'mixed',
          'aria-selected': true,
          'onClick': result.toggle,
          'role': 'checkbox',
          'selected': true,
          'tabindex': 0,
        })
      })

      it('should set the attribute when inactive and tag is `button`', () => {
        const result = useBaseInputToggle({ modelValue: ['two'], value: 'one', type: 'checkbox', as: 'button' })
        expect(result.attributes).toStrictEqual({
          'aria-checked': false,
          'onClick': result.toggle,
          'role': 'checkbox',
          'tabindex': 0,
        })
      })
    })
  })

  describe('classes', () => {
    it('should return the active class when the model is true', () => {
      const result = useBaseInputToggle({ modelValue: true, classActive: 'active', type: 'switch' })
      expect(result.classes).toStrictEqual({ active: true })
    })

    it('should return the inactive class when the model is false', () => {
      const result = useBaseInputToggle({ modelValue: false, classInactive: 'inactive', type: 'switch' })
      expect(result.classes).toStrictEqual({ inactive: true })
    })

    it('should return the mixed class when the model is mixed', () => {
      const result = useBaseInputToggle({ modelValue: ['one'], value: ['one', 'two'], classMixed: 'mixed', type: 'checkbox' })
      expect(result.classes).toStrictEqual({ mixed: true })
    })
  })
})
