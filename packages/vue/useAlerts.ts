import { createSharedComposable } from '@vueuse/core'
import { reactive } from 'vue'

export interface Alert {

  /** Duration of the alert in ms. */
  duration?: number

  /** Unique id for lifecycle handling. Defaults to auto-generated one. */
  id?: string

  /** Content of the alert. */
  text?: string

  /** Title of the alert. */
  title?: string

  /** Type of alert. Defines the design of the toast. */
  type?: 'error' | 'info' | 'success' | 'warning'
}

type Dismiss = () => void

/**
 * Return a composable to manage the global alert pool.
 *
 * @returns A composable to manage the global alert pool.
 */
export const useAlerts = createSharedComposable(() => {
  const alerts = reactive([]) as Alert[]
  let id = 0

  // --- Dismiss an alert.
  const dismiss = (alert: Alert) => {
    const index = alerts.findIndex(x => x.id === alert.id)
    alerts.splice(index, 1)
  }

  // --- Create an alert.
  const alert = (alert: Alert): Dismiss => {
    alert.id = alert.id ?? String(id++)
    alerts.push(alert)
    const dismissThisAlert = () => dismiss(alert)
    setTimeout(dismissThisAlert, alert.duration ?? 5000)
    return dismissThisAlert
  }

  // --- Return pool and methods.
  return {

    /** The active alerts pool. */
    alerts,

    /**
     * Create an alert that is displayed for a duration, then automatically dismissed.
     *
     * @param alert The alert to be displayed
     * @returns A function that can be used to dismiss the alert manually
     */
    alert,

    /**
     * Dismiss an alert or all allerts
     *
     * @param alert The alert to dismiss. If undefined, all alerts will be dismissed
     */
    dismiss,

    /**
     * Create an info alert that is displayed for a duration.
     *
     * @param text The text to be displayed in the info alert
     * @returns A function that can be used to dismiss the alert manually
     */
    success: (text: Alert | string): Dismiss => alert({
      type: 'success',
      title: 'Success',
      ...typeof text === 'string' ? { text } : text,
    }),

    /**
     * Create an info alert that is displayed for a duration.
     *
     * @param text The text to be displayed in the info alert
     * @returns A function that can be used to dismiss the alert manually
     */
    info: (text: Alert | string): Dismiss => alert({
      type: 'info',
      title: 'Info',
      ...typeof text === 'string' ? { text } : text,
    }),

    /**
     * Create an error alert that is displayed for a duration.
     *
     * @param error The error to be displayed in the error alert.
     * @returns A function that can be used to dismiss the alert manually
     */
    error: (error: Alert | Error | string) => {
      const alertObject = { type: 'error', title: 'Error' } as Alert
      if (error instanceof Error) return alert({ ...alertObject, text: error.message })
      if (typeof error === 'string') return alert({ ...alertObject, text: error })
      return alert({ ...alertObject, ...error })
    },

    /**
     * Create a warning alert that is displayed for a duration.
     *
     * @param error The error to be displayed in the warning alert.
     * @returns A function that can be used to dismiss the alert manually
     */
    warn: (error: Alert | Error | string): Dismiss => {
      const alertObject = { type: 'warning', title: 'Warning' } as Alert
      if (error instanceof Error) return alert({ ...alertObject, text: error.message })
      if (typeof error === 'string') return alert({ ...alertObject, text: error })
      return alert({ ...alertObject, ...error })
    },

    /**
     * Clear all alerts from the pool.
     */
    clear: () => {
      alerts.length = 0
    },

  }
})
