import type { Prop, VNode } from 'vue'
import type { DefineComponentContext } from './defineSetupComponent'
import type { BaseRenderableOptions } from './useBaseRenderable'
import { h, mergeProps, onMounted, onScopeDispose, ref, watch } from 'vue'
import { defineSetupComponent } from './defineSetupComponent'
import { BASE_RENDERABLE_OPTIONS, useBaseRenderable } from './useBaseRenderable'

/** The base props for the `BaseCollapse` component. */
export const BASE_COLLAPSE_PROPS = {
  ...BASE_RENDERABLE_OPTIONS,
  isOpen: Boolean,
  vertical: Boolean,
  horizontal: Boolean,
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
   * @default true
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
}

/** The context of the `BaseCollapse` component. */
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type BaseCollapseSlots = {
  default: () => VNode
}

export const BaseCollapse = /* #__PURE__ */ defineSetupComponent(
  (props: BaseCollapseProps, { attrs, slots }: DefineComponentContext<BaseCollapseSlots>) => {
    const element = ref<HTMLElement>()
    const renderable = useBaseRenderable(props)
    const style = ref({})

    function setStyleContent() {
      if (!element.value) return {}
      const { isOpen, vertical, horizontal } = props
      style.value = {
        overflowY: vertical ? (isOpen ? undefined : 'hidden') : undefined,
        overflowX: horizontal ? (isOpen ? undefined : 'hidden') : undefined,
        maxHeight: vertical ? (isOpen ? `${element.value.scrollHeight}px` : '0') : undefined,
        maxWidth: horizontal ? (isOpen ? `${element.value.scrollWidth}px` : '0') : undefined,
      }
    }

    let observer: MutationObserver | undefined
    if (globalThis.MutationObserver) observer = new MutationObserver(setStyleContent)
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
    onMounted(setStyleContent)

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
