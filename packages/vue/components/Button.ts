import { VNode, computed, defineComponent, h, mergeProps } from 'vue'
import {
  BASE_CLICKABLE_PROPS,
  BASE_LINKABLE_PROPS,
  BASE_RENDERABLE_PROPS,
  BASE_STATE_PROPS,
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

export const Button = /* #__PURE__ */ defineComponent(
  (props, { attrs, slots }) => {
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
    emits: [
      'click',
      'update:loading',
      'update:error',
      'update:disabled',
      'update:readonly',
    ] as unknown as undefined,
    name: 'Button',
    props: {
      label: [String],
      ...BASE_STATE_PROPS,
      ...BASE_LINKABLE_PROPS,
      ...BASE_CLICKABLE_PROPS,
      ...BASE_RENDERABLE_PROPS,
    },
    slots: {
      [Symbol()]: {
        default: {} as (props: SlotProps) => VNode,
      },
    },
  },
)
