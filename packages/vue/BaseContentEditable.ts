import type { Prop } from 'vue'
import type { DefineComponentContext } from './defineSetupComponent'
import type { BaseContentEditableOptions } from './useBaseContentEditable'
import type { BaseRenderableOptions } from './useBaseRenderable'
import type { BaseStateOptions } from './useBaseState'
import { computed, getCurrentInstance, h, mergeProps } from 'vue'
import { defineSetupComponent } from './defineSetupComponent'
import { exposeToDevtool } from './exposeToDevtool'
import { BASE_CONTENT_EDITABLE_OPTIONS, useBaseContentEditable } from './useBaseContentEditable'
import { BASE_RENDERABLE_OPTIONS } from './useBaseRenderable'
import { BASE_STATE_OPTIONS, useBaseState } from './useBaseState'

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
