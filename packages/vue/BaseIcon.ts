import { ExtractPropTypes, Prop, computed, defineComponent, h, mergeProps } from 'vue'
import { BASE_RENDERABLE_OPTIONS, useBaseRenderable } from './useBaseRenderable'

/** The base props for the `Icon` component. */
export const BASE_ICON_PROPS = {
  ...BASE_RENDERABLE_OPTIONS,

  /**
   * The class name of the icon to display. This is expected to be a valid
   * UnoCSS icon class name comming from the `@unocss/icons` package. The
   * `icon` prop is also used to set the `aria-labelledby` attribute of the icon
   * element.
   *
   * @example 'i-mdi:home'
   */
  icon: String as Prop<string>,

  /**
   * The label of the icon. This is used to set the `aria-label` attribute of the
   * icon element for accessibility and SEO purposes. If no `label` is provided,
   * the `icon` prop is used as the label.
   */
  label: String as Prop<string>,
}

/** The properties of the `Icon` component. */
export type BaseIconProps = ExtractPropTypes<typeof BASE_ICON_PROPS>

export const BaseIcon = /* #__PURE__ */ defineComponent(
  (props: BaseIconProps, { attrs }) => {
    const renderable = useBaseRenderable(props)

    // --- Build the attributes.
    const attributes = computed(() => mergeProps(attrs, {
      'role': 'img',
      'aria-hidden': 'true',
      'aria-label': props.label ?? props.icon,
      'class': props.icon,
    }))

    // --- Return virtual DOM node.
    return () => h(renderable.is ?? 'div', attributes.value)
  },
  {
    name: 'BaseIcon',
    props: BASE_ICON_PROPS as unknown as undefined,
  },
)
