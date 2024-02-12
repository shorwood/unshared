/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable unicorn/no-null */
import { MaybeArray, ValidateRuleSetResult, ValidationRule, ValidationRulePipe, ValidationRuleSet, arrayify, debounce, isTruthy, omit, pick, throttle, toCamelCase, validateRuleSet } from '@hsjm/shared'
import { IconifyIconCustomisations } from '@iconify/iconify'
import { useVModel } from '@vueuse/core'
import { PropType, computed, defineComponent, h, markRaw, mergeProps, nextTick, ref } from 'vue-demi'
import { exposeToDevtool } from '../utils'
import Icon from './Icon'
import InputEditor from './InputEditor'
import InputList from './InputList'
import InputText from './InputText'

export default defineComponent({
  // eslint-disable-next-line vue/no-reserved-component-names
  name: 'Input',
  inheritAttrs: true,
  props: {
    ...InputList.props,
    ...InputText.props,
    ...InputEditor.props,

    // --- Base options.
    type: { type: String as PropType<HTMLInputElement['type'] | 'list' | 'listbox' | 'select'>, default: 'text' },
    name: String,
    label: String,

    // --- State.
    modelValue: {} as PropType<any>,
    disabled: Boolean,
    readonly: Boolean,
    loading: Boolean,

    // --- Message/error.
    message: String,
    error: String as PropType<string>,
    errorLocalize: Function as PropType<(error: string) => string>,

    // --- Validation.
    rules: [Object, Array, Function] as PropType<ValidationRule | ValidationRulePipe | ValidationRuleSet>,
    validateOn: String as PropType<MaybeArray<keyof GlobalEventHandlersEventMap>>,
    validateThrottle: { type: [Number, String] as PropType<number | `${number}`>, default: 0 },
    validateDebounce: { type: [Number, String] as PropType<number | `${number}`>, default: 0 },
    validationContext: { type: Object as PropType<any>, default: () => ({}) },

    // --- Icon
    icon: String,
    iconAppend: String,
    iconPrepend: String,
    iconOptions: Object as PropType<IconifyIconCustomisations>,

    // --- Classes.
    classInput: {} as PropType<any>,
    classLabel: {} as PropType<any>,
    classGroup: {} as PropType<any>,
    classError: {} as PropType<any>,
    classMessage: {} as PropType<any>,
    classIcon: {} as PropType<any>,

    // --- Events.
    onInput: Function,
    onBlur: Function,
    onFocus: Function,
    onChange: Function,
    onClickAppend: Function,
    onClickPrepend: Function,
  },
  setup: (props, { attrs, slots, emit }) => {
    // --- Initialize state.
    const modelValue = useVModel(props, 'modelValue', emit, { passive: true })
    const modelDisabled = useVModel(props, 'disabled', emit, { passive: true })
    const modelReadonly = useVModel(props, 'readonly', emit, { passive: true })
    const modelLoading = useVModel(props, 'loading', emit, { passive: true })
    const modelError = useVModel(props, 'error', emit, { passive: true })
    const validationResults = ref<ValidateRuleSetResult>()

    // --- Compute final component.
    const inputComponent = markRaw(computed(() => {
      switch (props.type) {
        case 'listbox': { return InputList }
        case 'editor': { return InputEditor }
        default: { return InputText }
      }
    }))
    const inputPropKeys = markRaw(computed(() => Object.keys(inputComponent.value.props)))
    const inputElement = ref()

    // --- Methods to manage input cursor.
    const getCursor = (): number | undefined => inputElement.value?.$el?.selectionStart
    const setCursor = (cursor: number | undefined) => cursor && inputElement.value?.$el?.setSelectionRange?.(cursor, cursor)

    // --- Expose to Vue Devtools for debugging.
    const slotProps = exposeToDevtool({
      inputComponent,
      inputPropKeys,
      validationResults,
      modelValue,
      modelDisabled,
      modelReadonly,
      modelLoading,
      modelError,
    })

    // --- Validate the input.
    const validate = async() => {
      // --- Handle missing rules.
      if (!props.rules) return console.warn('Could not validate input: No validation rules provided.', inputElement.value)
      modelLoading.value = true
      await nextTick()

      // --- Validate and transform the value.
      const value = inputElement.value?.modelValue.value
      validationResults.value = await validateRuleSet(value, props.rules, props.validationContext)
      modelError.value = validationResults.value.error?.message

      // --- If the value was transformed, update the model.
      if (validationResults.value.isValid && value !== validationResults.value.value) {
        const cursor = getCursor()
        modelValue.value = validationResults.value.value
        setCursor(cursor)
      }

      // --- Emit the `validate` event.
      emit('validate', validationResults.value)
      modelLoading.value = false
    }

    // --- Validate debounced or throttled.
    const validateWithEffect = computed(() => {
      if (+props.validateThrottle > 0) return throttle(validate, +props.validateThrottle)
      if (+props.validateDebounce > 0) return debounce(validate, +props.validateDebounce)
      return validate
    })

    // --- Return virtual DOM node.
    return () => {
      const validateOnEvents = arrayify(props.validateOn).map(eventName => [toCamelCase(`on-${eventName}`), validateWithEffect.value])
      const inputEventHandlers = Object.fromEntries(validateOnEvents)

      // --- Create input/textarea/select.
      const vNodeinput = slots.input?.(slotProps) ?? h(inputComponent.value, mergeProps(
        omit(attrs, ['class', 'style']),
        pick(props, inputPropKeys.value),
        pick({
          'ref': inputElement,
          'role': 'input',
          'class': props.classInput,
          'modelValue': modelValue.value,
          'onUpdate:modelValue': (value: any) => modelValue.value = value,
        }, isTruthy),
        inputEventHandlers,
      ), slots )

      // --- Decompose icon props.
      const iconAppend = props.iconAppend
      const iconPrepend = props.icon ?? props.iconPrepend
      const iconProps = { options: props.iconOptions, class: props.classIcon }

      // --- Create child nodes.
      const vNodeAppend = slots.append?.(slotProps) ?? (iconAppend && h(Icon, { icon: iconAppend, ...iconProps }))
      const vNodePrepend = slots.prepend?.(slotProps) ?? (iconPrepend && h(Icon, { icon: iconPrepend, ...iconProps }))
      const vNodeMessage = slots.message?.(slotProps) ?? (typeof props.message === 'string' && h('span', { class: props.classMessage }, props.message))
      const vNodeError = slots.error?.(slotProps) ?? (typeof modelError.value === 'string' && h('span', { class: props.classError }, modelError.value))
      const vNodeLabel = slots.label?.(slotProps) ?? (typeof props.label === 'string' && h('label', { class: props.classLabel, for: props.name }, props.label))
      const vNodeinputGroup = h('div', { class: props.classGroup }, [vNodePrepend, vNodeinput, vNodeAppend])

      return h('div', pick({
        'aria-invalid': !!modelError.value,
        'aria-readonly': modelReadonly.value,
        'aria-disabled': modelDisabled.value,
      }, isTruthy), [
        vNodeLabel,
        vNodeinputGroup,
        vNodeError ?? vNodeMessage,
      ])
    }
  },
})
