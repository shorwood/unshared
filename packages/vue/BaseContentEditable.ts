import { Prop, computed, getCurrentInstance, h, mergeProps } from 'vue'
import { BASE_STATE_OPTIONS, BaseStateOptions, useBaseState } from './useBaseState'
import { BASE_RENDERABLE_OPTIONS, BaseRenderableOptions } from './useBaseRenderable'
import { BASE_CONTENT_EDITABLE_OPTIONS, BaseContentEditableOptions, useBaseContentEditable } from './useBaseContentEditable'
import { exposeToDevtool } from './exposeToDevtool'
import { DefineComponentContext, defineSetupComponent } from './defineSetupComponent'

/** The base props for the `BaseContentEditable` component. */
export const BASE_CONTENT_EDITABLE_PROPS = {
  ...BASE_CONTENT_EDITABLE_OPTIONS,
  ...BASE_RENDERABLE_OPTIONS,
  ...BASE_STATE_OPTIONS,
} satisfies Record<keyof BaseContentEditableProps, Prop<unknown>>

/** The properties of the `BaseContentEditable` component. */
export interface BaseContentEditableProps<T = unknown> extends
  BaseStateOptions,
  BaseRenderableOptions,
  BaseContentEditableOptions<T> {}

/** The properties of the `BaseContentEditable` component. */
export const BaseContentEditable = /* #__PURE__ */ defineSetupComponent(
  <T>(props: BaseContentEditableProps<T>, { attrs }: DefineComponentContext) => {
    const instance = getCurrentInstance()
    const contentEditable = useBaseContentEditable<T>(props, instance)
    const state = useBaseState(props, instance)

    // --- Build the attributes.
    const attributes = computed(() => mergeProps(
      attrs,
      state.attributes,
      contentEditable.attributes,
    ))

    // --- Expose properties to DevTools.
    exposeToDevtool({
      state,
      attributes,
      contentEditable,
    })

    // --- Return virtual DOM node.
    return () => h(props.as ?? 'div', attributes.value)
  },
  {
    name: 'BaseContentEditable',
    props: BASE_CONTENT_EDITABLE_PROPS,
  },
)
