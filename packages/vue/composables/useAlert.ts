import { reactive } from 'vue-demi'

export interface Alert {
  /** Unique id for lifecycle handling. Defaults to auto-generated one. */
  id?: string
  /** Content of the alert. */
  text?: string
  /** Type of alert. Defines the design of the toast. */
  type?: 'error' | 'success' | 'warning' | 'info'
  /** Duration of the alert in ms. */
  duration?: number
}

type Dismiss = () => void

export interface UseAlertReturnType {
  /** The active alerts pool. */
  alerts: Alert[]
  /**
   * Create an alert that is displayed for a duration, then automatically dismissed.
   * @param alert The alert to be displayed
   * @return A function that can be used to dismiss the alert manually
   */
  alert: (alert: Alert) => Dismiss
  /**
   * Create an error alert that is displayed for a duration, then automatically dismissed.
   * @param text The text to be displayed in the error alert
   * @returns A function that can be used to dismiss the alert manually
   */
  alertError: (text: string) => Dismiss
  /**
   * Create a success alert that is displayed for a duration, then automatically dismissed.
   * @param text The text to be displayed in the success alert
   * @returns A function that can be used to dismiss the alert manually
   */
  alertSuccess: (text: string) => Dismiss
  /**
   * Create a warning alert that is displayed for a duration, then automatically dismissed.
   * @param text The text to be displayed in the warning alert
   * @returns A function that can be used to dismiss the alert manually
   */
  alertWarning: (text: string) => Dismiss
  /**
   * Dismiss an alert or all allerts
   * @param alert The alert to dismiss. If undefined, all alerts will be dismissed
   */
  dismiss: (alert?: Alert) => void
}

// --- Global index.
let index = 0

/**
 * Return a composable to manage the global alert pool.
 * @return A composable to manage the global alert pool.
 */
export const useAlert = (): UseAlertReturnType => {
  // --- Initialize global alert pool.
  const alerts = reactive<Alert[]>([])

  // --- Dismiss an alert.
  const dismiss = (alert?: Alert) => {
    if (alert === undefined) { alerts.length = 0; return }
    const index = alerts.findIndex(x => x.id !== alert.id)
    alerts.splice(index, 1)
  }

  // --- Create an alert.
  const alert = (alert: Alert) => {
    alert.id = alert.id ?? (index++).toString()
    alerts.push(alert)
    const dismissThisAlert = () => dismiss(alert)
    setTimeout(dismissThisAlert, alert.duration ?? 5000)
    return dismissThisAlert
  }

  // --- Shortcut methods.
  const alertError = (text: string) => alert({ text, type: 'error' })
  const alertSuccess = (text: string) => alert({ text, type: 'success' })
  const alertWarning = (text: string) => alert({ text, type: 'warning' })

  // --- Return pool and methods.
  return { alerts, alert, alertError, alertSuccess, alertWarning, dismiss }
}
