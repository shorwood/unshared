import type { Prop, VNode } from 'vue'
import type { DefineComponentContext } from './defineSetupComponent'
import type { BaseRenderableOptions } from './useBaseRenderable'
import { useVModel } from '@vueuse/core'
import { computed, h, mergeProps, ref, watch } from 'vue'
import { defineSetupComponent } from './defineSetupComponent'
import { exposeToDevtool } from './exposeToDevtool'
import { BASE_RENDERABLE_OPTIONS, useBaseRenderable } from './useBaseRenderable'

/** The base props for the `BaseDialog` component. */
export const BASE_DIALOG_PROPS = {
  ...BASE_RENDERABLE_OPTIONS,
  'modelValue': Boolean,
  'onUpdate:modelValue': [Function, Array],
  'onClose': [Function, Array],
  'onOpen': [Function, Array],
  'onReturn': [Function, Array],
} satisfies Record<keyof BaseDialogProps, Prop<unknown>>

/** The properties & context of the `BaseDialog` component. */
export interface BaseDialogProps<T = unknown> extends BaseRenderableOptions {

  /**
   * The state of the dialog. If `true`, the dialog is visible. If `false`, the
   * dialog is hidden.
   */
  modelValue?: boolean
  'onUpdate:modelValue'?: (value: boolean) => void

  /**
   * The event emitted when the dialog is closed. This is used to notify the parent
   * component that the dialog has been closed.
   */
  onClose?: () => void

  /**
   * The event emitted when the dialog is opened. This is used to notify the parent
   * component that the dialog has been opened.
   */
  onOpen?: () => void

  /**
   * Event emitted when the dialog returns a value. This is used to notify the parent
   * component that the dialog has returned a value.
   */
  onReturn?: (value: T) => void
}

export interface BaseDialogSlotProps<T = unknown> {

  /** Close and return a value from the dialog. */
  returnValue: (value: T) => void

  /** Close the dialog. */
  close(): void

  /** Open the dialog. */
  open(): void

  /** The state of the dialog. */
  isOpen: boolean
}

/** The context of the `BaseDialog` component. */
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type BaseDialogSlots<T = unknown> = {
  default: (props: BaseDialogSlotProps<T>) => VNode
}

export const BaseDialog = /* #__PURE__ */ defineSetupComponent(
  <T>(props: BaseDialogProps<T>, { attrs, slots, emit }: DefineComponentContext<BaseDialogSlots<T>>) => {
    const renderable = useBaseRenderable(props)
    const element = ref<HTMLElement>()
    const is = computed(() => renderable.is ?? 'dialog')
    const isOpen = useVModel(props, 'modelValue', emit, { passive: true, defaultValue: false })

    // --- Build the attributes.
    const attributes = computed(() => mergeProps(attrs, {
      'aria-modal': 'true',
      'aria-hidden': isOpen.value,
      'role': 'dialog',
      'ref': (value) => { element.value = value as HTMLElement },
    }))

    /**
     * Close the dialog and emit the `close` event. This is used to close the dialog
     * when the user clicks outside of the dialog or presses the escape key.
     */
    const close = () => {
      if (element.value instanceof HTMLDialogElement)
        element.value.close()
      isOpen.value = false
      emit('close')
    }

    /**
     * Open the dialog and emit the `open` event. This is used to open the dialog
     * when the user clicks on the button that opens the dialog.
     */
    const open = () => {
      if (element.value instanceof HTMLDialogElement)
        element.value.showModal()
      isOpen.value = true
      emit('open')
    }

    /**
     * Return a value from the dialog and emit the `return` event. This is used to
     * return a value from the dialog to the parent component.
     *
     * @param value The value to return from the dialog.
     */
    const returnValue = (value: string) => {
      emit('return', value)
      close()
      if (element.value instanceof HTMLDialogElement)
        element.value.returnValue = value
    }

    // --- Observe the model value and update the dialog state.
    watch(isOpen, (value) => {
      if (element.value instanceof HTMLDialogElement === false) return
      if (value && !element.value.open) return open()
      if (!value && element.value.open) return close()
    })

    // --- Build the slot properties.
    const slotProps = computed(() => ({
      isOpen: isOpen.value!,
      returnValue,
      close,
      open,
    }) as BaseDialogSlotProps<T>)

    // --- Expose properties.
    exposeToDevtool({
      is,
      isOpen,
      renderable,
    })

    // --- Return virtual DOM node.
    return () => h(
      renderable.is ?? 'dialog',
      attributes.value,
      slots.default?.(slotProps.value),
    )
  },
  {
    name: 'BaseDialog',
    props: BASE_DIALOG_PROPS,
    inheritAttrs: false,
  },
)
