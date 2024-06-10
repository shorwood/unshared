// eslint-disable vue/no-unused-emit-declarations
import { Prop, VNode, computed, h, mergeProps } from 'vue'
import { BASE_STATE_OPTIONS, BaseStateOptions, useBaseState } from './useBaseState'
import { BASE_RENDERABLE_OPTIONS, BaseRenderableOptions, useBaseRenderable } from './useBaseRenderable'
import { BASE_LINKABLE_OPTIONS, BaseLinkableOptions, useBaseLinkable } from './useBaseLinkable'
import { BASE_CLICKABLE_OPTIONS, BaseClickableOptions, useBaseClickable } from './useBaseClickable'
import { exposeToDevtool } from './exposeToDevtool'
import { DefineComponentContext, defineSetupComponent } from './defineSetupComponent'

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

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
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
      {
        default: is.value === 'button'
          ? () => slots.default?.(slotProps.value) ?? props.label
          : slots.default?.(slotProps.value) ?? props.label,
      },
    )
  },
  {
    name: 'BaseButton',
    props: BASE_BUTTON_PROPS as unknown as undefined,
  },
)
