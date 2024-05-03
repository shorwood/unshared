// eslint-disable vue/no-unused-emit-declarations
import { ExtractPropTypes, Prop, VNode, computed, defineComponent, h, mergeProps } from 'vue'
import { pick } from '@unshared/collection/pick'
import { Alert, BASE_RENDERABLE_PROPS, useAlerts, useBaseRenderable } from '../composables'

interface SlotDefaultProps {
  alerts: Alert[]
  dismiss: (alert: Alert) => void
}

interface SlotAlertProps {
  alert: Alert
  dismiss: () => void
}

const PROPS = {
  ...BASE_RENDERABLE_PROPS,

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

type Props = ExtractPropTypes<typeof PROPS>

export const Alerts = /* #__PURE__ */ defineComponent(
  (props: Props, { attrs, slots }) => {
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

    // --- Return virtual DOM node.
    return () => h(
      renderable.is ?? 'aside',
      attributes.value,
      () => {
        if (slots.default) return slots.default(slotProps.value)
        if (slots.alert) {
          return alerts.alerts.map(alert => slots.alert({
            alert,
            dismiss: () => alerts.dismiss(alert),
          }))
        }
      },
    )
  },
  {
    name: 'Alerts',
    props: PROPS as unknown as undefined,
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
