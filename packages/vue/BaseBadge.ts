import { Prop, VNode, computed, h, mergeProps } from 'vue'
import { BASE_RENDERABLE_OPTIONS, BaseRenderableOptions, useBaseRenderable } from './useBaseRenderable'
import { DefineComponentContext, defineSetupComponent } from './defineSetupComponent'
import { BaseIcon } from './BaseIcon'

/** The base props for the `BaseBadge` component. */
export const BASE_BADGE_PROPS = {
  ...BASE_RENDERABLE_OPTIONS,
  icon: String,
  iconClose: String,
  iconClass: String,
  label: String,
  onClose: [Function, Array],
} satisfies Record<keyof Props, Prop<unknown>>

/** The properties & context of the `BaseBadge` component. */
interface Props extends BaseRenderableOptions {

  /**
   * The class name of the icon to display. This is expected to be a valid
   * UnoCSS icon class name comming from the `@unocss/icons` package. The
   * `icon` prop is also used to set the `aria-labelledby` attribute of the icon
   * element.
   *
   * @example 'i-mdi:home'
   */
  icon: string

  /**
   * The class to apply to the icon element. This is used to style the icon
   * element with custom CSS classes.
   *
   * @example 'icon'
   */
  iconClass?: string

  /**
   * The label of the icon. This is used to set the `aria-label` attribute of the
   * icon element for accessibility and SEO purposes. If no `label` is provided,
   * the `icon` prop is used as the label.
   */
  label?: string

  /**
   * The class name of the icon to display when the badge is closable. This is
   * expected to be a valid UnoCSS icon class name comming from the `@unocss/icons`
   * package.
   *
   * @example 'i-mdi:close'
   */
  iconClose?: string

  /**
   * The callback function to call when the badge is closed. This is used to
   * remove the badge from the DOM. If no `onClose` is provided, no close
   * button is displayed.
   *
   * @example () => console.log('Badge closed!')
   */
  onClose?: () => void
}

/** The context of the `BaseBadge` component. */
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type Slots = {
  default: () => VNode
  close: () => VNode
}

export const BaseBadge = /* #__PURE__ */ defineSetupComponent(
  (props: Props, { attrs, slots }: DefineComponentContext<Slots>) => {
    const renderable = useBaseRenderable(props)

    // --- Build the attributes.
    const attributes = computed(() => mergeProps(attrs, {
      'role': 'status',
      'aria-label': props.label ?? props.icon,
      'class': props.icon,
    }))

    // --- Return virtual DOM node.
    return () => {
      const vNodeClose = h('button', { onClick: props.onClose }, slots.close?.())
      const vNodeIcon = props.icon ? h(BaseIcon, { icon: props.icon, label: props.label, class: props.iconClass }) : undefined
      const vNodeContent = slots.default?.() ?? props.label

      return h(
        renderable.is ?? 'div',
        attributes.value,
        () => [vNodeIcon, vNodeContent, vNodeClose],
      )
    }
  },
  {
    name: 'BaseBadge',
    props: BASE_BADGE_PROPS,
  },
)
