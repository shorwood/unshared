// eslint-disable vue/no-unused-emit-declarations
import { ExtractPropTypes, Prop, VNode, computed, defineComponent, h, mergeProps } from 'vue'
import { pick } from '@unshared/collection/pick'
import { BASE_RENDERABLE_OPTIONS, useBaseRenderable } from './useBaseRenderable'
import { Alert, useAlerts } from './useAlerts'

interface SlotDefaultProps {
  alerts: Alert[]
  dismiss: (alert: Alert) => void
}

interface SlotAlertProps {
  alert: Alert
  dismiss: () => void
}

const BASE_ALERTS_PROPS = {
  ...BASE_RENDERABLE_OPTIONS,

  /**
   * The alert message to be displayed. It is an array of `Alert` objects
   * or strings that represent the alert message. It can be two-way bound.
   *
   * @default []
   */
  'alerts': [Array] as Prop<Alert[]>,
  'onUpdate:alerts': Function as Prop<(alerts: Alert[]) => void>,
  'onDismiss': Function as Prop<(alert: Alert) => void>,
}

/** The properties of the `BaseAlerts` component. */
type BaseAlertsProps = ExtractPropTypes<typeof BASE_ALERTS_PROPS>

export const BaseAlerts = /* #__PURE__ */ defineComponent(
  (props: BaseAlertsProps, { attrs, slots }) => {
    const alerts = useAlerts()
    const renderable = useBaseRenderable(props)

    // --- Build the slot properties.
    const slotProps = computed<SlotDefaultProps>(() => ({
      alerts: alerts.alerts,
      dismiss: alerts.dismiss,
    }))

    // --- Build the props object.
    const attributes = computed(() => pick(mergeProps(
      attrs,
      {
        'aria-live': 'assertive',
        'aria-atomic': 'true',
        'role': 'alert',
      },
    ), Boolean))

    // --- Get the slot content.
    const getSlots = () => {
      if (slots.default) return slots.default(slotProps.value)
      if (slots.alert) {
        return alerts.alerts.map(alert => slots.alert({
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
    emits: [
      'update:alerts',
      'dismiss',
    ],
    slots: {
      [Symbol()]: {
        default: {} as (props: SlotDefaultProps) => VNode,
        alert: {} as (props: SlotAlertProps) => VNode,
      },
    },
  },
)
