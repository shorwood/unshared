import { SetupContext, computed, defineComponent, getCurrentInstance, h, mergeProps } from 'vue'
import { BASE_STATE_OPTIONS, BaseStateOptions, useBaseState } from './useBaseState'
import { BASE_RENDERABLE_OPTIONS, BaseRenderableOptions } from './useBaseRenderable'
import { BASE_INPUT_TEXT_OPTIONS, BaseInputTextOptions, useBaseInputText } from './useBaseInputText'

/** The base props for the `BaseInputText` component. */
export const BASE_INPUT_TEXT_PROPS = {
  ...BASE_INPUT_TEXT_OPTIONS,
  ...BASE_RENDERABLE_OPTIONS,
  ...BASE_STATE_OPTIONS,
}

/** The properties of the `BaseInputText` component. */
interface Props<T = unknown> extends
  BaseStateOptions,
  BaseRenderableOptions,
  BaseInputTextOptions<T> {}

/** The context of the `BaseInputText` component. */
type Context = SetupContext<[], Record<symbol, {}>>

/** The properties of the `BaseInputText` component. */
export const BaseInputText = /* #__PURE__ */ defineComponent(
  <T>(props: Props<T>, { attrs }: Context) => {
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
