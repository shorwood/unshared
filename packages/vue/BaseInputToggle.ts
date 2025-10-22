import type { Prop, VNode } from 'vue'
import type { DefineComponentContext } from './defineSetupComponent'
import type { BaseInputToggleOptions, ToggleType } from './useBaseInputToggle'
import type { BaseRenderableOptions } from './useBaseRenderable'
import type { BaseStateOptions } from './useBaseState'
import { computed, h, mergeProps } from 'vue'
import { defineSetupComponent } from './defineSetupComponent'
import { exposeToDevtool } from './exposeToDevtool'
import { BASE_INPUT_TOGGLE_OPTIONS, useBaseInputToggle } from './useBaseInputToggle'
import { BASE_RENDERABLE_OPTIONS } from './useBaseRenderable'
import { BASE_STATE_OPTIONS, useBaseState } from './useBaseState'

/** The base props for the `BaseInputToggle` component. */
export const BASE_INPUT_TOGGLE_PROPS = {
  ...BASE_INPUT_TOGGLE_OPTIONS,
  ...BASE_STATE_OPTIONS,
  ...BASE_RENDERABLE_OPTIONS,
} satisfies Record<keyof BaseInputToggleProps<unknown, ToggleType>, Prop<unknown>>

/** The properties of the `BaseInputToggle` component. */
export interface BaseInputToggleProps<T, U extends ToggleType> extends
  BaseStateOptions,
  BaseInputToggleOptions<T, U>,
  BaseRenderableOptions {}

/** The properties of the `BaseInputToggle` default slot. */
export interface BaseInputToggleSlotProps {
  error?: Error | string
  errorMessage?: string
  isActive: 'mixed' | boolean
  isDisabled: boolean
  isLoading: boolean
  isReadonly: boolean
}

// oxlint-disable-next-line @typescript-eslint/consistent-type-definitions
export type BaseInputToggleSlots = {
  default?: (props: BaseInputToggleSlotProps) => VNode
}

export const BaseInputToggle = /* #__PURE__ */ defineSetupComponent(
  <T, U extends ToggleType>(props: BaseInputToggleProps<T, U>, { attrs, slots }: DefineComponentContext<BaseInputToggleSlots>) => {
    const state = useBaseState(props)
    const toggle = useBaseInputToggle<T, U>(props)

    // --- Build the props object.
    const attributes = computed(() => mergeProps(
      attrs,
      state.attributes,
      toggle.attributes,
    ))

    // --- Build the slot properties.
    const slotProps = computed<BaseInputToggleSlotProps>(() => ({
      error: state.error,
      errorMessage: state.errorMessage,
      isActive: toggle.isActive,
      isDisabled: state.disabled,
      isLoading: state.loading,
      isReadonly: state.readonly,
    }))

    // --- Expose to Vue Devtools for debugging.
    exposeToDevtool({
      attributes,
      state,
      toggle,
    })

    // --- Return virtual DOM node.
    return () => h(
      toggle.is,
      attributes.value,
      slots.default?.(slotProps.value),
    )
  },
  {
    name: 'BaseInputToggle',
    props: BASE_INPUT_TOGGLE_PROPS,
  },
)
