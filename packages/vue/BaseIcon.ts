import type { Prop } from 'vue'
import type { DefineComponentContext } from './defineSetupComponent'
import type { BaseRenderableOptions } from './useBaseRenderable'
import { useLocalStorage } from '@vueuse/core'
import { computed, h, mergeProps, onMounted, ref, watch } from 'vue'
import { defineSetupComponent } from './defineSetupComponent'
import { exposeToDevtool } from './exposeToDevtool'
import { BASE_RENDERABLE_OPTIONS, useBaseRenderable } from './useBaseRenderable'

/** The base props for the `BaseIcon` component. */
export const BASE_ICON_PROPS = {
  ...BASE_RENDERABLE_OPTIONS,
  icon: String,
  label: String,
  keepSize: Boolean,
  load: Boolean,
  inline: Boolean,
} satisfies Record<keyof Props, Prop<unknown>>

/** The properties of the `BaseIcon` component. */
interface Props extends BaseRenderableOptions {

  /**
   * The icon to display. It can be an URL to an SVG file, a class name of an
   * icon font or the raw SVG content. If the icon is an URL, it must be prefixed
   * with `https://`, `http://`, or `/`.
   *
   * @example 'i-mdi:home' or 'https://example.com/icon.svg'
   */
  icon?: string

  /**
   * The label of the icon. This is used to set the `aria-label` attribute of the
   * icon element for accessibility and SEO purposes. If no `label` is provided,
   * the `icon` prop is used as the label.
   */
  label?: string

  /**
   * If `true`, keep the `width` and `height` attributes of the icon. This is
   * useful when the icon is used as a background image.
   *
   * @default false
   */
  keepSize?: boolean

  /**
   * If `true` and the `icon` prop is an URL, the icon will be loaded using the
   * `fetch` API. The result data will be used as the icon content. This allows
   * more control over the icon content such as the color and size.
   *
   * Be aware that this can be a security risk if the URL is not trusted or if
   * the URL is user-provided as the content is injected into the DOM.
   *
   * @default false
   */
  load?: boolean

  /**
   * If `true` the `display: inline-block;` style will be applied to the icon.
   *
   * @default false
   */
  inline?: boolean
}

export const BaseIcon = /* #__PURE__ */ defineSetupComponent(
  (props: Props, { attrs }: DefineComponentContext) => {
    const renderable = useBaseRenderable(props)
    const iconSvg = ref<string>()
    const cache = useLocalStorage('__Icon_Cache', {} as Record<string, string>)

    // --- Detect what kind of icon we have.
    const type = computed(() => {
      if (!props.icon) return 'none'
      if (props.icon.startsWith('<svg')) return 'svg'
      if (props.icon.startsWith('data:image/svg+xml')) return 'data-uri'
      if (props.icon.startsWith('/')) return 'url'
      if (props.icon.startsWith('http://')) return 'url'
      if (props.icon.startsWith('https://')) return 'url'
      return 'class'
    })

    // --- Compute the label based on the icon type.
    const label = computed(() => {
      if (props.label) return props.label
      if (type.value === 'svg') return 'svg'
      if (type.value === 'data-uri') return 'data-uri'
      if (type.value === 'url') return (/[^/]+([^#?]+)/.exec((props.icon!)))?.[1]
      return props.icon
    })

    // --- Compute the tag based on the icon type.
    const is = computed(() => {
      if (props.as) return renderable.is
      if (type.value === 'svg') return 'div'
      if (type.value === 'url') return props.load ? 'div' : 'img'
      if (type.value === 'data-uri') return 'img'
      return 'i'
    })

    // --- Compute the inner HTML based on the icon type.
    const innerHTML = computed(() => {
      if (!props.icon) return
      if (type.value === 'svg') return cleanSvgSize(props.icon)
      if (type.value === 'url' && props.load) return iconSvg.value
      return
    })

    // --- Compute the `src` attribute based on the icon type.
    const source = computed(() => {
      if (props.load) return
      if (type.value === 'url' || type.value === 'data-uri') return props.icon
      return
    })

    /**
     * Load the icon content using the `fetch` API and use it as the inner HTML
     * of the icon element. This allows more control over the icon content such
     * as the color and size.
     *
     * @returns A promise that resolves when the icon content is loaded.
     */
    async function loadIcon(): Promise<void> {
      if (type.value !== 'url') return iconSvg.value = undefined
      if (!props.load) return iconSvg.value = undefined
      if (!props.icon) return iconSvg.value = undefined

      // --- Check if the icon is already in the cache.
      if (cache.value[props.icon]) {
        iconSvg.value = cache.value[props.icon]
        return
      }

      // --- Load the icon content.
      const response = await fetch(props.icon)
      if (!response.ok) return
      const svg = await response.text()
      const svgClean = cleanSvgSize(svg)
      iconSvg.value = svgClean
      cache.value[props.icon] = svgClean
    }

    /**
     * Given an SVG string, remove the `width` and `height` attributes.
     * This allows the icon to be styled using CSS without the need to
     * override the `width` and `height` attributes.
     *
     * @param svg The SVG string to clean.
     * @returns The cleaned SVG string.
     */
    function cleanSvgSize(svg: string) {
      if (props.keepSize) return svg
      return svg.replaceAll(/(width|height)="[^"]+"/g, '')
    }

    // --- Load the icon content if the `load` prop is `true`.
    watch([() => props.icon], loadIcon)
    onMounted(loadIcon)

    // --- Build the attributes.
    const attributes = computed(() => mergeProps(attrs, {
      'role': is.value === 'img' ? undefined : 'img',
      'aria-hidden': 'true',
      'aria-label': label.value,
      'innerHTML': innerHTML.value,
      'class': type.value === 'class' ? props.icon : undefined,
      'src': source.value,
      'style': { display: props.inline ? 'inline-block' : 'block' },
    }))

    // --- Expose properties.
    exposeToDevtool({
      is,
      label,
      source,
      innerHTML,
      iconSvg,
    })

    // --- Return virtual DOM node.
    return () => h(is.value ?? 'div', attributes.value)
  },
  {
    name: 'BaseIcon',
    props: BASE_ICON_PROPS as unknown as undefined,
  },
)
