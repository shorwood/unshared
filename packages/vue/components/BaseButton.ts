// eslint-disable vue/no-unused-emit-declarations
import { ExtractPropTypes, Prop, VNode, computed, defineComponent, h, mergeProps } from 'vue'
import {
  BASE_CLICKABLE_OPTIONS,
  BASE_LINKABLE_OPTIONS,
  BASE_RENDERABLE_OPTIONS,
  BASE_STATE_OPTIONS,
  useBaseClickable,
  useBaseLinkable,
  useBaseRenderable,
  useBaseState,
} from '../composables'

interface SlotProps {
  error: Error | string | undefined
  errorMessage: string | undefined
  isExternalLink: boolean
  isInternalLink: boolean
  isLink: boolean
  isLoading: boolean
}

/** The props for the `BaseButton` component. */
export const BASE_BUTTON_PROPS = {
  label: String as Prop<string>,
  ...BASE_STATE_OPTIONS,
  ...BASE_LINKABLE_OPTIONS,
  ...BASE_CLICKABLE_OPTIONS,
  ...BASE_RENDERABLE_OPTIONS,
}

/** The props for the `BaseButton` component. */
export type BaseButtonProps = ExtractPropTypes<typeof BASE_BUTTON_PROPS>

export const BaseButton = /* #__PURE__ */ defineComponent(
  (props: BaseButtonProps, { attrs, slots }) => {
    const state = useBaseState(props)
    const linkable = useBaseLinkable(props)
    const clickable = useBaseClickable(props)
    const renderable = useBaseRenderable(props)

    // --- Build the attributes.
    const attributes = computed(() => mergeProps(
      attrs,
      { 'aria-labelledby': props.label },
      state.attributes,
      linkable.attributes,
      clickable.attributes,
    ))

    // --- Build the slot properties.
    const slotProps = computed<SlotProps>(() => ({
      error: state.error,
      errorMessage: state.errorMessage,
      isExternalLink: linkable.isExternalLink,
      isInternalLink: linkable.isInternalLink,
      isLink: linkable.isLink,
      isLoading: state.loading,
    }))

    // --- Return virtual DOM node.
    return () => h(
      linkable.is ?? renderable.is ?? 'button',
      attributes.value,
      () => slots.default?.(slotProps.value) ?? props.label,
    )
  },
  {
    name: 'BaseButton',
    props: BASE_BUTTON_PROPS as unknown as undefined,
    emits: [
      'click',
      'update:loading',
      'update:error',
      'update:disabled',
      'update:readonly',
    ] as unknown as undefined,
    slots: {
      [Symbol()]: {
        default: {} as (props: SlotProps) => VNode,
      },
    },
  },
)
