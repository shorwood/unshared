// eslint-disable vue/no-unused-emit-declarations
import type { Prop, VNode } from 'vue'
import type { DefineComponentContext } from './defineSetupComponent'
import type { Alert } from './useAlerts'
import type { BaseRenderableOptions } from './useBaseRenderable'
import { computed, h, mergeProps } from 'vue'
import { defineSetupComponent } from './defineSetupComponent'
import { useAlerts } from './useAlerts'
import { BASE_RENDERABLE_OPTIONS, useBaseRenderable } from './useBaseRenderable'

export const BASE_ALERTS_PROPS = {
  ...BASE_RENDERABLE_OPTIONS,
  'alerts': Array,
  'onUpdate:alerts': [Function, Array],
  'onDismiss': [Function, Array],
} satisfies Record<keyof BaseAlertsProps, Prop<unknown>>

/** The properties of the `BaseAlerts` component. */
export interface BaseAlertsProps extends BaseRenderableOptions {

  /**
   * The alert message to be displayed. It is an array of `Alert` objects
   * or strings that represent the alert message. It can be two-way bound.
   *
   * @default []
   */
  alerts?: Alert[]
  'onUpdate:alerts'?: (alerts: Alert[]) => void

  /**
   * The callback function to call when an alert is dismissed. This is used to
   * remove the alert from the DOM.
   *
   * @example (alert) => console.log('Alert dismissed!', alert)
   */
  onDismiss?: (alert: Alert) => void
}

export interface BaseAlertsSlotProps {
  alerts: Alert[]
  dismiss: (alert: Alert) => void
}

export interface BaseAlertsSlotAlertProps {
  alert: Alert
  dismiss: () => void
}

/** The slot properties of the `BaseAlerts` component. */
// oxlint-disable-next-line @typescript-eslint/consistent-type-definitions
export type BaseAlertsSlots = {
  default: (props: BaseAlertsSlotProps) => VNode
  alert: (props: BaseAlertsSlotAlertProps) => VNode

}

export const BaseAlerts = /* #__PURE__ */ defineSetupComponent(
  (props: BaseAlertsProps, { attrs, slots }: DefineComponentContext<BaseAlertsSlots>) => {
    const alerts = useAlerts()
    const renderable = useBaseRenderable(props)

    // --- Build the slot properties.
    const slotProps = computed<BaseAlertsSlotProps>(() => ({
      alerts: alerts.alerts,
      dismiss: alerts.dismiss,
    }))

    // --- Build the props object.
    const attributes = computed(() => mergeProps(
      attrs,
      {
        'aria-live': 'assertive',
        'aria-atomic': 'true',
        'role': 'alert',
      },
    ))

    // --- Get the slot content.
    const getSlots = () => {
      if (slots.default) return slots.default(slotProps.value)
      if (slots.alert) {
        return alerts.alerts.map(alert => slots.alert?.({
          alert,
          dismiss: () => alerts.dismiss(alert),
        }))
      }
    }

    // --- Return virtual DOM node.
    return () => h(
      renderable.is ?? 'aside',
      attributes.value,
      getSlots(),
    )
  },
  {
    name: 'BaseAlerts',
    props: BASE_ALERTS_PROPS as unknown as undefined,
  },
)
