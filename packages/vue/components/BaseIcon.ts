import { ExtractPropTypes, Prop, computed, defineComponent, h, mergeProps } from 'vue'
import { BASE_RENDERABLE_PROPS, useBaseRenderable } from '../composables/useBaseRenderable'

/** The base props for the `Icon` component. */
const PROPS = {
  ...BASE_RENDERABLE_PROPS,

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
type Props = ExtractPropTypes<typeof PROPS>

export const BaseIcon = /* #__PURE__ */ defineComponent(
  (props: Props, { attrs }) => {
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
    name: 'Icon',
    props: PROPS as unknown as undefined,
  },
)
