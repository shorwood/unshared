import { Component, Ref, computed, getCurrentInstance } from 'vue'
import { toReactive, useVModel } from '@vueuse/core'
import { MaybeArray } from '@unshared/types'
import { BASE_RENDERABLE_OPTIONS, BaseRenderableOptions, useBaseRenderable } from './useBaseRenderable'
import { cleanClasses } from '../utils/cleanClasses'
import { cleanAttributes } from '../utils/cleanAttributes'

/** The type of the toggle. */
export type ToggleType = 'checkbox' | 'radio' | 'switch'

/** The value of the toggle based on the type. */
export type ToggleValue<T, U extends ToggleType> =
  U extends 'switch' ? 'mixed' | boolean :
    U extends 'checkbox' ? T[] :
      U extends 'radio' ? T :
        never

export interface BaseInputToggleOptions<
  T = unknown,
  U extends ToggleType = ToggleType,
> extends BaseRenderableOptions {

  /**
   * The type of the toggle. This can be either `checkbox`, `radio`, or `switch`.
   * This will determine how the toggle will behave when it is clicked.
   *
   * @default 'switch'
   */
  type?: U

  /**
   * The model value of the toggle. This holds the current state of the toggle
   * and should be updated when the toggle is clicked.
   *
   * @default undefined
   */
  modelValue?: ToggleValue<T, U>
  'onUpdate:modelValue'?: (value: ToggleValue<T, U>) => void

  /**
   * The value to set or push when the toggle is active. This is only used when
   * the type of the toggle is either `checkbox` or `radio`. By default, it
   * will use the `key` of the current instance.
   *
   * @default useCurrentInstance().key
   */
  value?: U extends 'switch' ? void : MaybeArray<T>
  onToggle?: () => void
  onOff?: () => void
  onOn?: () => void

  // /**
  //  * Override the default function to check if the model is active. This allows
  //  * you to customize the behavior of the toggle when it is active.
  //  *
  //  * For example, if the component is used in a tree view and is the parent of some
  //  * children, it can check if all children are checked to set the parent as
  //  * checked.
  //  *
  //  * @example (modelValue, value) => modelValue.includes(value)
  //  */
  // isActive?: (modelValue: ToggleValue<T, U>, value: V) => boolean

  // /**
  //  * A function to check if the model is mixed when the type is a checkbox or
  //  * switch. For example, if the component is used in a tree view, it can check
  //  * if this element is partially checked by checking if some children are
  //  * checked and some are not.
  //  *
  //  * @example (model, value) => model.includes(value)
  //  */
  // isMixed?: (modelValue: ToggleValue<T, U>, value: V) => boolean

  /**
   * The class to apply when the toggle is active. This allows you to customize
   * the appearance of the toggle when it is active without handling the CSS in
   * the component itself.
   *
   * @example 'active'
   */
  classActive?: string

  /**
   * The class to apply when the toggle is inactive. This allows you to customize
   * the appearance of the toggle when it is inactive without handling the CSS in
   * the component itself.
   *
   * @example 'inactive'
   */
  classInactive?: string

  /**
   * The class to apply when the toggle is mixed. This allows you to customize
   * the appearance of the toggle when it is mixed without handling the CSS in
   * the component itself.
   *
   * @example 'mixed'
   */
  classMixed?: string
}

export const BASE_INPUT_TOGGLE_OPTIONS = {
  ...BASE_RENDERABLE_OPTIONS,
  type: { type: String, default: 'switch' },
  modelValue: [Boolean, Array, String, Number, Object],
  value: [Boolean, Array, String, Number],
  // isMixed: Function,
  // isActive: Function,
  classActive: { type: String, default: '' },
  classInactive: { type: String, default: '' },
}

/** The symbol to provide the base toggle composable. */
export const BASE_INPUT_TOGGLE_SYMBOL = Symbol('baseToggle')

/** The composable properties returned by the `useBaseInputToggle` composable. */
export interface BaseInputToggleComposable<T = unknown, U extends ToggleType = ToggleType> {
  attributes: Record<string, unknown>
  classes: Record<string, unknown>
  isActive: 'mixed' | boolean
  model: ToggleValue<T, U>
  toggle: () => void
  is: Component | string
}

declare module '@vue/runtime-core' {
  interface ComponentInternalInstance {
    [BASE_INPUT_TOGGLE_SYMBOL]?: BaseInputToggleComposable<unknown, ToggleType>
  }
}

/**
 * Create a toggle composable given the provided type. The composable will
 * return a corresponding `isActive` computed property and a `toggle` method
 * to handle the click event based on the provided type of toggle.
 *
 * @param props The properties of the component passed by the `setup` function.
 * @param instance The instance of the component to provide the composable.
 * @returns The computed properties and methods to use in the toggle component.
 * @example
 * defineComponent({
 *   mixins: [BaseToggle],
 *   setup(props, context) {
 *     return useBaseToggle(props, context)
 *   }
 * })
 */
export function useBaseInputToggle<T, U extends ToggleType>(
  props: BaseInputToggleOptions<T, U> = {} as BaseInputToggleOptions<T, U>,
  instance = getCurrentInstance(),
): BaseInputToggleComposable<T, U> {
  if (instance?.[BASE_INPUT_TOGGLE_SYMBOL])
    return instance[BASE_INPUT_TOGGLE_SYMBOL] as BaseInputToggleComposable<T, U>

  // --- Create a v-model for the provided options.
  // --- Default the `value` property to undefined if it is not provided.
  const emit = instance?.emit
  const value = computed(() => props.value ?? instance?.props.key)
  const model = useVModel(props, 'modelValue', emit, { passive: true }) as Ref<unknown>
  const renderable = useBaseRenderable(props, instance)

  // --- Check if, based on the type, the model is active.
  const isActive = computed(() => {
    if (props.type === 'radio') return model.value === value.value
    if (props.type === 'switch') return model.value === true
    if (props.type !== 'checkbox') return false

    const modelValue = Array.isArray(model.value) ? model.value : []
    const valueValue = Array.isArray(value.value) ? value.value : [value.value]
    const isMixed = valueValue.some(x => modelValue.includes(x))
    const isActive = valueValue.every(x => modelValue.includes(x))
    return isActive || (isMixed && 'mixed')
  })

  function emitChange() {
    if (!emit) return
    emit('toggle')
    emit(isActive.value ? 'off' : 'on')
  }

  function toggleSwitch() {
    model.value = model.value !== true
    emitChange()
  }

  function toggleRadio() {
    if (model.value === value.value) return
    model.value = value.value
    emitChange()
  }

  function toggleCheckbox() {
    const valueValue: unknown[] = Array.isArray(value.value) ? value.value : [value.value]
    let modelValue: unknown[] = Array.isArray(model.value) ? model.value : []

    // --- Push or remove the value from the model based on the current state.
    modelValue = isActive.value === true
      ? [...modelValue].filter(x => !valueValue.includes(x))
      : [...modelValue, ...valueValue]

    // --- Deduplicate the model value and set it.
    model.value = [...new Set(modelValue)]
    emitChange()
  }

  function toggle() {
    if (props.type === 'radio') toggleRadio()
    if (props.type === 'switch') toggleSwitch()
    if (props.type === 'checkbox') toggleCheckbox()
  }

  // --- Compute the classes based on the active state.
  const classes = computed(() => cleanClasses({
    [props.classActive!]: props.classActive && isActive.value === true,
    [props.classInactive!]: props.classInactive && isActive.value === false,
    [props.classMixed!]: props.classMixed && isActive.value === 'mixed',
  }))

  // --- Default the component to `input` if no component is provided.
  const is = computed(() => renderable.is ?? 'input')

  // --- Properties to assign to the element.
  const attributes = computed(() => cleanAttributes({
    'onClick': toggle,
    'aria-pressed': (is.value !== 'input' && props.type !== 'checkbox') ? isActive.value : undefined,
    'aria-checked': (is.value !== 'input' && props.type === 'checkbox') ? isActive.value : undefined,
    'role': is.value !== 'input' && (props.type === 'radio' ? 'radio' : 'checkbox') || undefined,
    'type': is.value === 'input' && (props.type === 'radio' ? 'radio' : 'checkbox') || undefined,
    'class': classes.value,
    'tabindex': is.value === 'input' ? undefined : 0,
    'checked': (is.value === 'input' && isActive.value) ? true : undefined,
  }))

  // --- Provide the composable into the component and return it.
  const composable = toReactive({ attributes, classes, isActive, model, is, toggle })
  if (instance) instance[BASE_INPUT_TOGGLE_SYMBOL] = composable
  return composable as BaseInputToggleComposable<T, U>
}

/* v8 ignore next */
// @vitest-environment happy-dom
if (import.meta.vitest) {
  const { isReactive, reactive } = await import('vue')
  const { mount } = await import('@vue/test-utils')
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { nextTick } = await import('node:process')

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
        await new Promise(nextTick)
        expect(result.isActive).toBe(true)
      })

      it('should change `model` to `true` when `modelValue` changes to `true`', async() => {
        const props = reactive({ modelValue: false, type: 'switch' }) as BaseInputToggleOptions
        const result = useBaseInputToggle(props)
        props.modelValue = true
        await new Promise(nextTick)
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
        await new Promise(nextTick)
        expect(emit).toHaveBeenNthCalledWith(1, 'toggle')
        expect(emit).toHaveBeenNthCalledWith(2, 'off')
        expect(emit).toHaveBeenNthCalledWith(3, 'update:modelValue', true)
      })

      it('should emit when toggling the model to false', async() => {
        const emit = vi.fn()
        // @ts-expect-error: ignore
        const result = useBaseInputToggle({ modelValue: true, type: 'switch' }, { emit })
        result.toggle()
        await new Promise(nextTick)
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
          'onClick': result.toggle,
          'role': 'checkbox',
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
        await new Promise(nextTick)
        expect(result.isActive).toBe(true)
      })

      it('should change `model` to the provided value when `modelValue` changes to the provided value', async() => {
        const props = reactive({ modelValue: 'two', value: 'one', type: 'radio' }) as BaseInputToggleOptions
        const result = useBaseInputToggle(props)
        props.modelValue = 'one'
        await new Promise(nextTick)
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
        await new Promise(nextTick)
        expect(emit).toHaveBeenNthCalledWith(1, 'toggle')
        expect(emit).toHaveBeenNthCalledWith(2, 'off')
        expect(emit).toHaveBeenNthCalledWith(3, 'update:modelValue', 'one')
      })

      it('should set the model to the provided value when the model is undefined', async() => {
        const emit = vi.fn()
        // @ts-expect-error: ignore
        const result = useBaseInputToggle({ modelValue: undefined, value: 'one', type: 'radio' }, { emit })
        result.toggle()
        await new Promise(nextTick)
        expect(emit).toHaveBeenNthCalledWith(1, 'toggle')
        expect(emit).toHaveBeenNthCalledWith(2, 'off')
        expect(emit).toHaveBeenNthCalledWith(3, 'update:modelValue', 'one')
      })

      it('should not emit when the model is the same as the provided value', async() => {
        const emit = vi.fn()
        // @ts-expect-error: ignore
        const result = useBaseInputToggle({ modelValue: 'one', value: 'one', type: 'radio' }, { emit })
        result.toggle()
        await new Promise(nextTick)
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
          'onClick': result.toggle,
          'role': 'radio',
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
        await new Promise(nextTick)
        expect(result.isActive).toBe(true)
      })

      it('should change `model` to the provided value when `modelValue` changes to the provided value', async() => {
        const props = reactive({ modelValue: ['two'], value: 'one', type: 'checkbox' }) as BaseInputToggleOptions
        const result = useBaseInputToggle(props)
        props.modelValue = ['one']
        await new Promise(nextTick)
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
        await new Promise(nextTick)
        expect(emit).toHaveBeenNthCalledWith(1, 'toggle')
        expect(emit).toHaveBeenNthCalledWith(2, 'off')
        expect(emit).toHaveBeenNthCalledWith(3, 'update:modelValue', ['one'])
      })

      it('should push the value when the model does not contain the value', async() => {
        const emit = vi.fn()
        // @ts-expect-error: ignore
        const result = useBaseInputToggle({ modelValue: ['two'], value: 'one', type: 'checkbox' }, { emit })
        result.toggle()
        await new Promise(nextTick)
        expect(emit).toHaveBeenNthCalledWith(1, 'toggle')
        expect(emit).toHaveBeenNthCalledWith(2, 'off')
        expect(emit).toHaveBeenNthCalledWith(3, 'update:modelValue', ['two', 'one'])
      })

      it('should push the values when the model does not contain all the values', async() => {
        const emit = vi.fn()
        // @ts-expect-error: ignore
        const result = useBaseInputToggle({ modelValue: ['two'], value: ['one', 'two'], type: 'checkbox' }, { emit })
        result.toggle()
        await new Promise(nextTick)
        expect(emit).toHaveBeenNthCalledWith(1, 'toggle')
        expect(emit).toHaveBeenNthCalledWith(2, 'off')
        expect(emit).toHaveBeenNthCalledWith(3, 'update:modelValue', ['two', 'one'])
      })

      it('should remove the value when the model contains the value', async() => {
        const emit = vi.fn()
        // @ts-expect-error: ignore
        const result = useBaseInputToggle({ modelValue: ['one', 'two'], value: 'one', type: 'checkbox' }, { emit })
        result.toggle()
        await new Promise(nextTick)
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
          'onClick': result.toggle,
          'role': 'checkbox',
          'tabindex': 0,
        })
      })

      it('should set the attribute when mixed and tag is `button`', () => {
        const result = useBaseInputToggle({ modelValue: ['one'], value: ['one', 'two'], type: 'checkbox', as: 'button' })
        expect(result.attributes).toStrictEqual({
          'aria-checked': 'mixed',
          'onClick': result.toggle,
          'role': 'checkbox',
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
}
