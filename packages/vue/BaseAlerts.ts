// eslint-disable vue/no-unused-emit-declarations
import { Prop, VNode, computed, h, mergeProps } from 'vue'
import { pick } from '@unshared/collection/pick'
import { BASE_RENDERABLE_OPTIONS, BaseRenderableOptions, useBaseRenderable } from './useBaseRenderable'
import { Alert, useAlerts } from './useAlerts'
import { DefineComponentContext, defineSetupComponent } from './defineSetupComponent'

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
  'alerts': Array,
  'onUpdate:alerts': [Function, Array],
  'onDismiss': [Function, Array],
} satisfies Record<keyof Props, Prop<unknown>>

/** The properties of the `BaseAlerts` component. */
interface Props extends BaseRenderableOptions {

  /**
   * The alert message to be displayed. It is an array of `Alert` objects
   * or strings that represent the alert message. It can be two-way bound.
   *
   * @default []
   */
  alerts: Alert[]
  'onUpdate:alerts': (alerts: Alert[]) => void

  /**
   * The callback function to call when an alert is dismissed. This is used to
   * remove the alert from the DOM.
   *
   * @example (alert) => console.log('Alert dismissed!', alert)
   */
  onDismiss?: (alert: Alert) => void
}

/** The slot properties of the `BaseAlerts` component. */
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type Slots = {
  default: (props: SlotDefaultProps) => VNode
  alert: (props: SlotAlertProps) => VNode

}

export const BaseAlerts = /* #__PURE__ */ defineSetupComponent(
  (props: Props, { attrs, slots }: DefineComponentContext<Slots>) => {
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
