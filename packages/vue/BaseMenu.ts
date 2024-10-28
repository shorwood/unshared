import type { CSSProperties, Prop } from 'vue'
import type { DefineComponentContext } from './defineSetupComponent'
import type { BaseRenderableOptions } from './useBaseRenderable'
import { useVModel } from '@vueuse/core'
import { computed, h, mergeProps, ref, type VNode, watch } from 'vue'
import { defineSetupComponent } from './defineSetupComponent'
import { exposeToDevtool } from './exposeToDevtool'
import { BASE_RENDERABLE_OPTIONS, useBaseRenderable } from './useBaseRenderable'

/** The base props for the `BaseMenu` component. */
export const BASE_MENU_PROPS = {
  ...BASE_RENDERABLE_OPTIONS,
  'modelValue': Boolean,
  'onUpdate:modelValue': [Function, Array],
  'onOpen': [Function, Array],
  'onClose': [Function, Array],
  'onToggle': [Function, Array],
  'persistent': Boolean,
  'x': String,
  'y': String,
  'classMenu': {},
} satisfies Record<keyof BaseMenuProps, Prop<unknown>>

/** The properties & context of the `BaseMenu` component. */
export interface BaseMenuProps extends BaseRenderableOptions {

  /**
   * The state of the menu. If `true`, the menu is visible. If `false`, the
   * menu is hidden.
   */
  modelValue?: boolean
  'onUpdate:modelValue'?: (value: boolean) => void

  /**
   * The callback function to call when the menu is opened.
   *
   * @example () => console.log('Menu opened!')
   */
  onOpen?: () => void

  /**
   * The callback function to call when the menu is closed.
   *
   * @example () => console.log('Menu closed!')
   */
  onClose?: () => void

  /**
   * The callback function to call when the menu is toggled.
   *
   * @example () => console.log('Menu toggled!')
   */
  onToggle?: (isOpen: boolean) => void

  /**
   * By default, the menu will close when the user clicks outside of the menu,
   * setting this prop to `true` will disable this behavior and the menu will
   * remain open even when the user clicks outside of the menu.
   *
   * @default false
   */
  persistent?: boolean

  /**
   * The alignment of the menu relative to the trigger on the x-axis.
   *
   * @default 'center'
   */
  x?: 'after' | 'before' | 'center' | 'left' | 'right'

  /**
   * The alignment of the menu relative to the trigger on the y-axis.
   *
   * @default 'bottom'
   */
  y?: 'above' | 'below' | 'bottom' | 'center' | 'top'

  /**
   * The classes to assign to the menu element.
   */
  classMenu?: string
}

/** The slot properties of the `BaseMenu` component. */
export interface BaseMenuSlotProps {

  /** Toggle the menu. */
  toggle(): void

  /** Close the menu. */
  close(): void

  /** Open the menu. */
  open(): void

  /** The state of the menu. */
  isOpen: boolean
}

/** The context of the `BaseMenu` component. */
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type BaseMenuSlots = {
  default: (props: BaseMenuSlotProps) => VNode
  menu: (props: BaseMenuSlotProps) => VNode
}

export const BaseMenu = /* #__PURE__ */ defineSetupComponent(
  (props: BaseMenuProps, { attrs, slots, emit }: DefineComponentContext<BaseMenuSlots>) => {
    const renderable = useBaseRenderable(props)
    const element = ref<HTMLElement>()
    const is = computed(() => renderable.is ?? 'div')
    const isOpen = useVModel(props, 'modelValue', emit, { passive: true, defaultValue: false })

    const top = computed(() => {
      if (props.y === 'top') return '0'
      if (props.y === 'below') return '100%'
      if (props.y === 'center') return '50%'
    })

    const bottom = computed(() => {
      if (props.y === 'above') return '100%'
      if (props.y === 'bottom') return '0'
    })

    const left = computed(() => {
      if (props.x === 'after') return '100%'
      if (props.x === 'left') return '0'
      if (props.x === 'center') return '50%'
    })

    const right = computed(() => {
      if (props.x === 'before') return '100%'
      if (props.x === 'right') return '0'
    })

    const transform = computed(() => {
      const translateX = props.x === 'center' ? '-50%' : 0
      const translateY = props.y === 'center' ? '-50%' : 0
      if (translateX === 0 && translateY === 0) return
      return `translate(${translateX}, ${translateY})`
    })

    const menuStyle = computed<CSSProperties>(() => ({
      position: (top.value ?? bottom.value ?? left.value ?? right.value) ? 'absolute' : undefined,
      top: top.value,
      bottom: bottom.value,
      left: left.value,
      right: right.value,
      transform: transform.value,
    }))

    const menuAttributes = computed(() => ({
      'aria-modal': 'true',
      'aria-hidden': isOpen.value,
      'role': 'menu',
      'style': menuStyle.value,
      'class': props.classMenu,
    }))

    const close = () => {
      isOpen.value = false
      emit('close')
      emit('toggle', false)
    }

    const open = () => {
      isOpen.value = true
      emit('open')
      emit('toggle', true)
    }

    const toggle = () => {
      isOpen.value = !isOpen.value
      emit(isOpen.value ? 'open' : 'close')
      emit('toggle', isOpen.value)
    }

    const attributes = computed(() => mergeProps(attrs, ({
      ref: element,
      style: { position: 'relative' },
    })))

    const handleWindowClick = (event: MouseEvent) => {
      if (!isOpen.value) return
      if (!element.value) return
      if (!element.value.contains(event.target as Node)) close()
    }

    // --- Watch the `closeOnClickOutside` property and add/remove the event listener.
    watch(() => props.persistent, (value) => {
      if (!document) return
      if (value) document.removeEventListener('click', handleWindowClick)
      else document.addEventListener('click', handleWindowClick)
    }, { immediate: true })

    // --- Build the slot properties.
    const slotProps = computed(() => ({
      isOpen: isOpen.value!,
      toggle,
      close,
      open,
    }) as BaseMenuSlotProps)

    // --- Expose properties.
    exposeToDevtool({
      is,
      isOpen,
      element,
      renderable,
      menuStyle,
      menuAttributes,
      attributes,
    })

    // --- Return virtual DOM node.
    return () => h(
      is.value,
      attributes.value,
      [
        slots.default?.(slotProps.value),
        h('menu', menuAttributes.value, slots.menu?.(slotProps.value)),
      ],
    )
  },
  {
    name: 'BaseMemu',
    props: BASE_MENU_PROPS,
  },
)
