/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable unicorn/no-null */
import { isTruthy, pick } from '@hsjm/shared'
import { useVModel } from '@vueuse/core'
import { PropType, computed, defineComponent, h, mergeProps, toRefs } from 'vue-demi'
import { exposeToDevtool } from '../utils'

export default defineComponent({
  name: 'Switch',
  props: {
    as: { type: String as PropType<keyof HTMLElementTagNameMap>, default: 'button' },

    // --- State.
    disabled: Boolean,
    readonly: Boolean,
    loading: Boolean,

    // --- Input.
    modelValue: { type: [Boolean, Number, String, Array], default: false },
    value: { type: [Boolean, Number, String], default: true },
    multiple: Boolean,

    // --- Classes.
    classActive: String,

    // --- Events.
    onClick: Function,
  },
  setup: (props, { attrs, slots, emit }) => {
    // --- Destructure props.
    const { value, multiple, classActive } = toRefs(props)

    // --- Compute states variables.
    const model = useVModel(props, 'modelValue')
    const modelDisabled = useVModel(props, 'disabled', emit, { passive: true })
    const modelReadonly = useVModel(props, 'readonly', emit, { passive: true })
    const modelLoading = useVModel(props, 'loading', emit, { passive: true })

    // --- Compute reactive `isActive` state.
    const isActive = computed(() => {
      if (multiple.value && Array.isArray(model.value)) return model.value.includes(value.value)
      if (multiple.value && !Array.isArray(model.value)) return false
      return model.value === value.value
    })

    // --- Declar `toggle` method.
    const toggle = async() => {
      // --- If `multiple`, but value invalid, initialize array.
      if (multiple.value && !Array.isArray(model.value)) {
        model.value = [value.value]
      }

      // --- If `multiple`, add or remove value.
      else if (multiple.value && Array.isArray(model.value)) {
        model.value = isActive.value
          ? [...model.value].filter(x => x !== value.value)
          : [...model.value, value.value]
      }

      // --- If not, toggle or set value.
      else if (typeof value.value === 'boolean') { model.value = !model.value }
      else if (model.value !== value.value) { model.value = value.value }
    }

    // --- Expose to Vue Devtools for debugging.
    const slotProps = exposeToDevtool({
      isActive,
      modelDisabled,
      modelLoading,
      modelReadonly,
    })

    // --- Build the props object.
    const propsEntries = [
      ['disabled', modelDisabled.value],
      ['readonly', modelReadonly.value],
      ['aria-disabled', modelDisabled.value],
      ['aria-readonly', modelReadonly.value],
      ['aria-busy', modelLoading.value],
      ['class', isActive.value && classActive.value],
      ['onClick', toggle],
    ].filter(([, value]) => !!value)

    const propsObject = Object.fromEntries(propsEntries)

    // --- Return virtual DOM node.
    return () => h(props.as, mergeProps(attrs, propsObject), () => slots.default?.(slotProps))
  },
})
