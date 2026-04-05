import type { Prop, VNode } from 'vue'
import type { DefineComponentContext } from './defineSetupComponent'
import type { BaseRenderableOptions } from './useBaseRenderable'
import { computed, h, mergeProps, nextTick, onMounted, onScopeDispose, ref, watch } from 'vue'
import { defineSetupComponent } from './defineSetupComponent'
import { exposeToDevtool } from './exposeToDevtool'
import { BASE_RENDERABLE_OPTIONS, useBaseRenderable } from './useBaseRenderable'

/** The base props for the `BaseSmoothDimensions` component. */
export const BASE_SMOOTH_DIMENSIONS_PROPS = {
  ...BASE_RENDERABLE_OPTIONS,
  vertical: Boolean,
  horizontal: Boolean,
  wrapperAttrs: Object,
  contentAttrs: Object,
} satisfies Record<keyof BaseSmoothDimensionsProps, Prop<unknown>>

/** The properties of the `BaseSmoothDimensions` component. */
export interface BaseSmoothDimensionsProps extends BaseRenderableOptions {

  /**
   * Defines if the height should be animated. When `true`, the container will
   * smoothly transition its height when the content changes.
   *
   * @default true
   */
  vertical?: boolean

  /**
   * Defines if the width should be animated. When `true`, the container will
   * smoothly transition its width when the content changes.
   *
   * @default false
   */
  horizontal?: boolean

  /**
   * Attributes to apply to the wrapper element. The one that directly
   * contains the content element and is inside the root element.
   *
   * @example { class: 'my-wrapper' }
   */
  wrapperAttrs?: Record<string, unknown>

  /**
   * Attributes to apply to the content element. The one that directly
   * contains the slotted content and is inside the wrapper.
   *
   * @example { class: 'my-content-wrapper' }
   */
  contentAttrs?: Record<string, unknown>
}

/** The slot properties of the `BaseSmoothDimensions` component. */
export interface BaseSmoothDimensionsSlotProps {

  /** The current width of the content. */
  width: number

  /** The current height of the content. */
  height: number
}

/** The slots of the `BaseSmoothDimensions` component. */
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type BaseSmoothDimensionsSlots = {
  default: (props: BaseSmoothDimensionsSlotProps) => VNode
}

export const BaseSmoothDimensions = /* #__PURE__ */ defineSetupComponent(
  (props: BaseSmoothDimensionsProps, { attrs, slots }: DefineComponentContext<BaseSmoothDimensionsSlots>) => {
    const renderable = useBaseRenderable(props)
    const wrapperRef = ref<HTMLElement>()
    const size = ref({ width: 0, height: 0 })

    /**
     * Update the size of the content element. This function is called when the
     * content element is resized or when the content element's children change.
     */
    function updateSize() {
      void nextTick(() => {
        if (!wrapperRef.value) return
        const rect = wrapperRef.value.getBoundingClientRect()
        size.value = { width: rect.width, height: rect.height }
      })
    }

    // --- Create observers for size changes.
    let resizeObserver: ResizeObserver | undefined
    let mutationObserver: MutationObserver | undefined
    if (globalThis.ResizeObserver) resizeObserver = new ResizeObserver(updateSize)
    if (globalThis.MutationObserver) mutationObserver = new MutationObserver(updateSize)

    // --- Cleanup observers on scope dispose.
    onScopeDispose(() => {
      resizeObserver?.disconnect()
      mutationObserver?.disconnect()
    })

    // --- If the content element changes, re-observe the new element.
    watch(wrapperRef, (element) => {
      if (!element) return
      resizeObserver?.disconnect()
      mutationObserver?.disconnect()
      resizeObserver?.observe(element)
      mutationObserver?.observe(element, { childList: true, subtree: true })
    })

    // --- Initial size update.
    onMounted(updateSize)

    // --- Compute the axis with default values.
    const vertical = computed(() => props.vertical ?? true)
    const horizontal = computed(() => props.horizontal ?? false)

    // --- Compute container styles based on axis.
    const containerStyle = computed(() => ({
      position: 'relative' as const,
      overflow: 'clip' as const,
      width: horizontal.value ? `${size.value.width}px` : undefined,
      height: vertical.value ? `${size.value.height}px` : undefined,
    }))

    // --- Compute content styles based on axis.
    const wrapperStyle = computed(() => ({
      position: 'absolute' as const,
      top: '0',
      left: '0',
      width: horizontal.value ? 'auto' : '100%',
      height: vertical.value ? 'auto' : '100%',
    }))

    // --- Build the slot properties.
    const slotProps = computed<BaseSmoothDimensionsSlotProps>(() => ({
      width: size.value.width,
      height: size.value.height,
    }))

    // --- Expose properties to DevTools.
    exposeToDevtool({
      size,
      vertical,
      horizontal,
      renderable,
    })

    // --- Return virtual DOM node.
    return () => h(
      renderable.is ?? 'div',
      mergeProps(attrs, { style: containerStyle.value }),
      h(
        'div',
        mergeProps(
          props.wrapperAttrs ?? {},
          {
            ref: wrapperRef,
            style: wrapperStyle.value,
          },
        ),
        h(
          'div',
          props.contentAttrs,
          slots.default?.(slotProps.value),
        ),
      ),
    )
  },
  {
    name: 'BaseSmoothDimensions',
    props: BASE_SMOOTH_DIMENSIONS_PROPS,
  },
)
