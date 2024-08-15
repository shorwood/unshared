import type { Prop } from 'vue'
import type { DefineComponentContext } from './defineSetupComponent'
import type { BaseInputTextOptions } from './useBaseInputText'
import type { BaseRenderableOptions } from './useBaseRenderable'
import type { BaseStateOptions } from './useBaseState'
import { computed, getCurrentInstance, h, mergeProps } from 'vue'
import { defineSetupComponent } from './defineSetupComponent'
import { exposeToDevtool } from './exposeToDevtool'
import { BASE_INPUT_TEXT_OPTIONS, useBaseInputText } from './useBaseInputText'
import { BASE_RENDERABLE_OPTIONS } from './useBaseRenderable'
import { BASE_STATE_OPTIONS, useBaseState } from './useBaseState'

/** The base props for the `BaseInputText` component. */
export const BASE_INPUT_TEXT_PROPS = {
  ...BASE_INPUT_TEXT_OPTIONS,
  ...BASE_RENDERABLE_OPTIONS,
  ...BASE_STATE_OPTIONS,
} satisfies Record<keyof BaseInputTextProps, Prop<unknown>>

/** The properties of the `BaseInputText` component. */
export interface BaseInputTextProps<T = unknown> extends
  BaseStateOptions,
  BaseRenderableOptions,
  BaseInputTextOptions<T> {}

/** The properties of the `BaseInputText` component. */
export const BaseInputText = /* #__PURE__ */ defineSetupComponent(
  <T>(props: BaseInputTextProps<T>, { attrs }: DefineComponentContext) => {
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
