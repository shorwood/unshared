import { ExtractPropTypes, computed, defineComponent, getCurrentInstance, h, mergeProps } from 'vue'
import { BASE_STATE_PROPS, useBaseState } from '../composables/useBaseState'
import { BASE_RENDERABLE_PROPS } from '../composables/useBaseRenderable'
import { BASE_INPUT_TEXT_PROPS, useBaseInputText } from '../composables/useBaseInputText'

/** The base props for the `BaseInputText` component. */
const PROPS = {
  ...BASE_INPUT_TEXT_PROPS,
  ...BASE_RENDERABLE_PROPS,
  ...BASE_STATE_PROPS,
}

/** The properties of the `BaseInputText` component. */
type Props = ExtractPropTypes<typeof PROPS>

export const BaseInputText = /* #__PURE__ */ defineComponent(
  (props: Props, { attrs }) => {
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
    props: PROPS as unknown as undefined,
  },
)
