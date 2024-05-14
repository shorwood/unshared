import { Prop, computed, h, mergeProps } from 'vue'
import { BASE_RENDERABLE_OPTIONS, BaseRenderableOptions, useBaseRenderable } from './useBaseRenderable'
import { defineSetupComponent } from './defineSetupComponent'

/** The base props for the `BaseIcon` component. */
export const BASE_ICON_PROPS = {
  ...BASE_RENDERABLE_OPTIONS,
  icon: String,
  label: String,
} satisfies Record<keyof Props, Prop<unknown>>

/** The properties of the `BaseIcon` component. */
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
   * The label of the icon. This is used to set the `aria-label` attribute of the
   * icon element for accessibility and SEO purposes. If no `label` is provided,
   * the `icon` prop is used as the label.
   */
  label?: string
}

export const BaseIcon = /* #__PURE__ */ defineSetupComponent(
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
    name: 'BaseIcon',
    props: BASE_ICON_PROPS as unknown as undefined,
  },
)
