import type { Prop, VNode } from 'vue'
import type { DefineComponentContext } from './defineSetupComponent'
import type { BaseRenderableOptions } from './useBaseRenderable'
import { h, mergeProps, onScopeDispose, ref, watch } from 'vue'
import { defineSetupComponent } from './defineSetupComponent'
import { BASE_RENDERABLE_OPTIONS, useBaseRenderable } from './useBaseRenderable'

/** The base props for the `BaseCollapse` component. */
export const BASE_COLLAPSE_PROPS = {
  ...BASE_RENDERABLE_OPTIONS,
  isOpen: Boolean,
  vertical: Boolean,
  horizontal: Boolean,
  duration: Number,
} satisfies Record<keyof BaseCollapseProps, Prop<unknown>>

/** The properties & context of the `BaseCollapse` component. */
export interface BaseCollapseProps extends BaseRenderableOptions {

  /**
   * The value of the collapse. If `true`, the collapse is open. If `false`, the
   * collapse is closed. This prop is used to control the state of the collapse.
   */
  isOpen?: boolean

  /**
   * Defines if the collapse should be vertical. Meaning that when open, the
   * collapse will expand vertically and set the maximum height to `0` when
   * closed.
   *
   * @default false
   */
  vertical?: boolean

  /**
   * Defines if the collapse should be horizontal. Meaning that when open, the
   * collapse will expand horizontally and set the maximum width to `0` when
   * closed.
   *
   * @default false
   */
  horizontal?: boolean

  /**
   * Defines after how many milliseconds the styles should be removed after the
   * transition ends. This is used to remove the `max-height` and `max-width`
   * styles after the state has changed and allow the transition to end.
   *
   * @default 100
   */
  duration?: number
}

/** The context of the `BaseCollapse` component. */
// oxlint-disable-next-line @typescript-eslint/consistent-type-definitions
export type BaseCollapseSlots = {
  default: () => VNode
}

export const BaseCollapse = /* #__PURE__ */ defineSetupComponent(
  (props: BaseCollapseProps, { attrs, slots }: DefineComponentContext<BaseCollapseSlots>) => {
    const element = ref<HTMLElement>()
    const renderable = useBaseRenderable(props)
    const style = ref({
      maxHeight: props.vertical && !props.isOpen ? '0' : undefined,
      maxWidth: props.horizontal && !props.isOpen ? '0' : undefined,
    })

    /**
     * Set the style content of the collapse element in several steps. The first
     * step is to set the initial size of the element so transitions can work. Then,
     * wait for the next frame to set the final size. Finally, after the transition
     * ends, let the original styles take over so automatic resizing can work.
     *
     * @returns A promise that resolves when the style content is set.
     */
    async function setStyleContent() {
      if (!element.value) return {}
      const { isOpen, vertical, horizontal, duration = 100 } = props

      // --- Set the initial size so transitions can work.
      style.value = {
        maxHeight: vertical ? `${element.value.scrollHeight}px` : undefined,
        maxWidth: horizontal ? `${element.value.scrollWidth}px` : undefined,
      }

      // --- Wait for the next frame to set the final size.
      await new Promise(resolve => setTimeout(resolve, 0))
      const maxHeight = isOpen ? `${element.value.scrollHeight}px` : '0'
      const maxWidth = isOpen ? `${element.value.scrollWidth}px` : '0'
      style.value = {
        maxHeight: vertical ? maxHeight : undefined,
        maxWidth: horizontal ? maxWidth : undefined,
      }

      // --- After the transition ends, let original styles take over.
      await new Promise(resolve => setTimeout(resolve, duration))
      style.value = {
        maxHeight: vertical && !isOpen ? '0' : undefined,
        maxWidth: horizontal && !isOpen ? '0' : undefined,
      }
    }

    let observer: MutationObserver | undefined
    if (globalThis.MutationObserver) observer = new MutationObserver(() => void setStyleContent())
    onScopeDispose(() => observer?.disconnect())

    // --- If the element VNode changes, re-observe the new element.
    watch(element, (element) => {
      if (!element) return
      if (!observer) return
      observer.disconnect()
      observer.observe(element, {
        subtree: true,
        childList: true,
        characterData: true,
      })
    })

    // --- Watch the model value and update the style content.
    watch(() => props.isOpen, setStyleContent)

    // --- Return virtual DOM node.
    return () => h(
      renderable.is ?? 'div',
      mergeProps(attrs, { style: style.value, ref: element }),
      slots.default?.(),
    )
  },
  {
    name: 'BaseCollapse',
    props: BASE_COLLAPSE_PROPS,
  },
)
