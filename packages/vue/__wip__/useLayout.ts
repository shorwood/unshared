import { templateRef, useElementSize, useWindowScroll, createSharedComposable } from '@vueuse/core'
import { Ref } from 'vue-demi'

interface UseLayoutOptions {
  root?: Ref<HTMLElement | SVGElement>
  header?: Ref<HTMLElement | SVGElement>
  footer?: Ref<HTMLElement | SVGElement>
}

/**
 * Returns an object with various information related to the layout of an element.
 *
 * @param options
 * @returns
 */
export const useLayout = createSharedComposable((options: UseLayoutOptions = {}) => {
  const { y: scroll } = useWindowScroll()

  // --- Destructure and default the options.
  const {
    root = templateRef('root'),
    header = templateRef('header'),
    footer = templateRef('footer'),
  } = options

  // --- Get the element sizes.
  const { height, width } = useElementSize(root)
  const { height: headerHeight, width: widthHeight } = useElementSize(header)
  const { height: footerHeight, width: footerWidth } = useElementSize(footer)

  // --- Return the reactive layout state.
  return {
    root,
    header,
    footer,
    scroll,
    height,
    width,
    headerHeight,
    widthHeight,
    footerHeight,
    footerWidth,
  }
})
