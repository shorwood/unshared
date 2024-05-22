import { Prop, VNode, computed, h, mergeProps } from 'vue'
import { BASE_RENDERABLE_OPTIONS, BaseRenderableOptions, useBaseRenderable } from './useBaseRenderable'
import { DefineComponentContext, defineSetupComponent } from './defineSetupComponent'

/** The base props for the `BaseBadge` component. */
export const BASE_BADGE_PROPS = {
  ...BASE_RENDERABLE_OPTIONS,
  label: String,
} satisfies Record<keyof Props, Prop<unknown>>

/** The properties & context of the `BaseBadge` component. */
interface Props extends BaseRenderableOptions {

  /**
   * The label of the icon. This is used to set the `aria-label` attribute of the
   * icon element for accessibility and SEO purposes. If no `label` is provided,
   * the `icon` prop is used as the label.
   */
  label?: string
}

/** The context of the `BaseBadge` component. */
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type Slots = {
  default: () => VNode
}

export const BaseBadge = /* #__PURE__ */ defineSetupComponent(
  (props: Props, { attrs, slots }: DefineComponentContext<Slots>) => {
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
