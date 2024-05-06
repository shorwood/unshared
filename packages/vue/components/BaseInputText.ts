import { ExtractPropTypes, computed, defineComponent, getCurrentInstance, h, mergeProps } from 'vue'
import { BASE_STATE_OPTIONS, useBaseState } from '../composables/useBaseState'
import { BASE_RENDERABLE_OPTIONS } from '../composables/useBaseRenderable'
import { BASE_INPUT_TEXT_OPTIONS, useBaseInputText } from '../composables/useBaseInputText'

/** The base props for the `BaseInputText` component. */
export const BASE_INPUT_TEXT_PROPS = {
  ...BASE_INPUT_TEXT_OPTIONS,
  ...BASE_RENDERABLE_OPTIONS,
  ...BASE_STATE_OPTIONS,
}

/** The properties of the `BaseInputText` component. */
export type BaseInputTextProps = ExtractPropTypes<typeof BASE_INPUT_TEXT_PROPS>

export const BaseInputText = /* #__PURE__ */ defineComponent(
  (props: BaseInputTextProps, { attrs }) => {
    const instance = getCurrentInstance()
    const inputText = useBaseInputText(props, instance)
    const state = useBaseState(props, instance)

    // --- Build the attributes.
    const attributes = computed(() => mergeProps(
      attrs,
      state.attributes,
      inputText.attributes,
    ))

    // --- Return virtual DOM node.
    return () => h(inputText.is, attributes.value)
  },
  {
    name: 'BaseInputText',
    props: BASE_INPUT_TEXT_PROPS as unknown as undefined,
  },
)
