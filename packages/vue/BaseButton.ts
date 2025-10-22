// eslint-disable vue/no-unused-emit-declarations
import type { Prop, VNode } from 'vue'
import type { DefineComponentContext } from './defineSetupComponent'
import type { BaseClickableOptions } from './useBaseClickable'
import type { BaseLinkableOptions } from './useBaseLinkable'
import type { BaseRenderableOptions } from './useBaseRenderable'
import type { BaseStateOptions } from './useBaseState'
import { computed, h, mergeProps } from 'vue'
import { defineSetupComponent } from './defineSetupComponent'
import { exposeToDevtool } from './exposeToDevtool'
import { BASE_CLICKABLE_OPTIONS, useBaseClickable } from './useBaseClickable'
import { BASE_LINKABLE_OPTIONS, useBaseLinkable } from './useBaseLinkable'
import { BASE_RENDERABLE_OPTIONS, useBaseRenderable } from './useBaseRenderable'
import { BASE_STATE_OPTIONS, useBaseState } from './useBaseState'

/** The props for the `BaseButton` component. */
export const BASE_BUTTON_PROPS = {
  ...BASE_STATE_OPTIONS,
  ...BASE_LINKABLE_OPTIONS,
  ...BASE_CLICKABLE_OPTIONS,
  ...BASE_RENDERABLE_OPTIONS,
  label: [String, Number],
} satisfies Record<keyof BaseButtonProps, Prop<unknown>>

/** The props for the `BaseButton` component. */
export interface BaseButtonProps extends
  BaseStateOptions,
  BaseLinkableOptions,
  BaseClickableOptions,
  BaseRenderableOptions {
}

interface SlotProps {

  /** The error that occurred when the button was clicked. */
  error: Error | string | undefined

  /** The message of the error that occurred when the button was clicked. */
  errorMessage: string | undefined

  /** Whether the button is an external link. */
  isExternalLink: boolean

  /** Whether the button is an internal link. */
  isInternalLink: boolean

  /** Whether the button is a link. */
  isLink: boolean

  /** Whether the action triggered by the button is loading. */
  isLoading: boolean

  /** Whether, if the button is a link, the link is active. */
  isActive: boolean
}

// oxlint-disable-next-line @typescript-eslint/consistent-type-definitions
export type BaseButtonSlots = {
  default: (props: SlotProps) => VNode
}

export const BaseButton = /* #__PURE__ */ defineSetupComponent(
  (props: BaseButtonProps, { attrs, slots }: DefineComponentContext<BaseButtonSlots>) => {
    const state = useBaseState(props)
    const linkable = useBaseLinkable(props)
    const clickable = useBaseClickable(props)
    const renderable = useBaseRenderable(props)
    const is = computed(() => linkable.is ?? renderable.is ?? 'button')

    // --- Build the attributes.
    const attributes = computed(() => mergeProps(
      { type: is.value === 'button' ? 'button' : undefined },
      state.attributes,
      linkable.attributes,
      clickable.attributes,
      attrs,
    ))

    // --- Build the slot properties.
    const slotProps = computed<SlotProps>(() => ({
      error: state.error,
      errorMessage: state.errorMessage,
      isExternalLink: linkable.isExternalLink,
      isInternalLink: linkable.isInternalLink,
      isLink: linkable.isLink,
      isLoading: state.loading,
      isActive: linkable.isActive,
    }))

    // --- Expose properties.
    exposeToDevtool({
      is,
      state,
      linkable,
      clickable,
      renderable,
    })

    // --- Return virtual DOM node.
    return () => h(
      is.value,
      attributes.value,
      typeof is.value === 'string'
        ? slots.default?.(slotProps.value) ?? props.label
        : () => slots.default?.(slotProps.value) ?? props.label,
    )
  },
  {
    name: 'BaseButton',
    props: BASE_BUTTON_PROPS as unknown as undefined,
  },
)
