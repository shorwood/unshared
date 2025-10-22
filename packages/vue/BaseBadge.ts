import type { Prop, VNode } from 'vue'
import type { DefineComponentContext } from './defineSetupComponent'
import type { BaseRenderableOptions } from './useBaseRenderable'
import { computed, h, mergeProps } from 'vue'
import { defineSetupComponent } from './defineSetupComponent'
import { BASE_RENDERABLE_OPTIONS, useBaseRenderable } from './useBaseRenderable'

/** The base props for the `BaseBadge` component. */
export const BASE_BADGE_PROPS = {
  ...BASE_RENDERABLE_OPTIONS,
  label: String,
} satisfies Record<keyof BaseBadgeProps, Prop<unknown>>

/** The properties & context of the `BaseBadge` component. */
export interface BaseBadgeProps extends BaseRenderableOptions {

  /**
   * The label of the icon. This is used to set the `aria-label` attribute of the
   * icon element for accessibility and SEO purposes. If no `label` is provided,
   * the `icon` prop is used as the label.
   */
  label?: string
}

/** The context of the `BaseBadge` component. */
// oxlint-disable-next-line @typescript-eslint/consistent-type-definitions
export type BaseBadgeSlots = {
  default: () => VNode
}

export const BaseBadge = /* #__PURE__ */ defineSetupComponent(
  (props: BaseBadgeProps, { attrs, slots }: DefineComponentContext<BaseBadgeSlots>) => {
    const renderable = useBaseRenderable(props)

    // --- Build the attributes.
    const attributes = computed(() => mergeProps(attrs, {
      'role': 'status',
      'aria-label': props.label,
    }))

    // --- Return virtual DOM node.
    return () => h(
      renderable.is ?? 'span',
      attributes.value,
      slots.default?.() ?? props.label,
    )
  },
  {
    name: 'BaseBadge',
    props: BASE_BADGE_PROPS,
  },
)
