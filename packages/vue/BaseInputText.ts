import { Prop, computed, getCurrentInstance, h, mergeProps } from 'vue'
import { BASE_STATE_OPTIONS, BaseStateOptions, useBaseState } from './useBaseState'
import { BASE_RENDERABLE_OPTIONS, BaseRenderableOptions } from './useBaseRenderable'
import { BASE_INPUT_TEXT_OPTIONS, BaseInputTextOptions, useBaseInputText } from './useBaseInputText'
import { exposeToDevtool } from './exposeToDevtool'
import { DefineComponentContext, defineSetupComponent } from './defineSetupComponent'

/** The base props for the `BaseInputText` component. */
export const BASE_INPUT_TEXT_PROPS = {
  ...BASE_INPUT_TEXT_OPTIONS,
  ...BASE_RENDERABLE_OPTIONS,
  ...BASE_STATE_OPTIONS,
} satisfies Record<keyof Props, Prop<unknown>>

/** The properties of the `BaseInputText` component. */
interface Props<T = unknown> extends
  BaseStateOptions,
  BaseRenderableOptions,
  BaseInputTextOptions<T> {}

/** The properties of the `BaseInputText` component. */
export const BaseInputText = /* #__PURE__ */ defineSetupComponent(
  <T>(props: Props<T>, { attrs }: DefineComponentContext) => {
    const instance = getCurrentInstance()
    const inputText = useBaseInputText<T>(props, instance)
    const state = useBaseState(props, instance)

    // --- Build the attributes.
    const attributes = computed(() => mergeProps(
      attrs,
      state.attributes,
      inputText.attributes,
    ))

    // --- Expose properties to DevTools.
    exposeToDevtool({
      state,
      attributes,
      inputText,
    })

    // --- Return virtual DOM node.
    return () => h(inputText.is, attributes.value)
  },
  {
    name: 'BaseInputText',
    props: BASE_INPUT_TEXT_PROPS,
  },
)
