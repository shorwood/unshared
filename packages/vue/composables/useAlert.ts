import { reactive } from 'vue'

export interface Alert {
  /** Duration of the alert in ms. */
  duration?: number
  /** Unique id for lifecycle handling. Defaults to auto-generated one. */
  id?: string
  /** Content of the alert. */
  text?: string
  /** Type of alert. Defines the design of the toast. */
  type?: 'error' | 'info' | 'success' | 'warning'
}

type Dismiss = () => void

export interface UseAlertReturnType {
  /**
   * Create an alert that is displayed for a duration, then automatically dismissed.
   *
   * @param alert The alert to be displayed
   * @returns A function that can be used to dismiss the alert manually
   */
  alert: (alert: Alert) => Dismiss
  /**
   * Create an error alert that is displayed for a duration, then automatically dismissed.
   *
   * @param text The text to be displayed in the error alert
   * @returns A function that can be used to dismiss the alert manually
   */
  alertError: (text: string) => Dismiss
  /**
   * Create a success alert that is displayed for a duration, then automatically dismissed.
   *
   * @param text The text to be displayed in the success alert
   * @returns A function that can be used to dismiss the alert manually
   */
  alertSuccess: (text: string) => Dismiss
  /**
   * Create a warning alert that is displayed for a duration, then automatically dismissed.
   *
   * @param text The text to be displayed in the warning alert
   * @returns A function that can be used to dismiss the alert manually
   */
  alertWarning: (text: string) => Dismiss
  /** The active alerts pool. */
  alerts: Alert[]
  /**
   * Clear all alerts
   */
  clear: () => void
  /**
   * Dismiss an alert or all allerts
   *
   * @param alert The alert to dismiss. If undefined, all alerts will be dismissed
   */
  dismiss: (alert: Alert) => void
}

/**
 * Return a composable to manage the global alert pool.
 *
 * @returns A composable to manage the global alert pool.
 */
export function useAlert(): UseAlertReturnType {
  const alerts = reactive<Alert[]>([])

  // --- Clear all alerts.
  const clear = () => alerts.length = 0

  // --- Dismiss an alert.
  const dismiss = (alert: Alert) => {
    const index = alerts.findIndex(x => x.id === alert.id)
    alerts.splice(index, 1)
  }

  // --- Create an alert.
  const alert = (alert: Alert) => {
    alert.id = alert.id ?? Math.random().toString(36).slice(2, 11)
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
  return {
    alert,
    alertError,
    alerts,
    alertSuccess,
    alertWarning,
    clear,
    dismiss,
  }
}

/* v8 ignore start */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
if (import.meta.vitest) {
  const { sleep } = await import('@unshared/functions/sleep')

  test('should register a new alert', () => {
    const { alertError, alerts } = useAlert()
    alertError('This is an error')
    expect(alerts).toStrictEqual([{
      id: expect.stringMatching(/[\da-z]{9}/),
      text: 'This is an error',
      type: 'error',
    }])
  })

  test('should register a new success', () => {
    const { alerts, alertSuccess } = useAlert()
    alertSuccess('This is a success')
    expect(alerts).toStrictEqual([{
      id: expect.stringMatching(/[\da-z]{9}/),
      text: 'This is a success',
      type: 'success',
    }])
  })

  test('should register a new warning', () => {
    const { alerts, alertWarning } = useAlert()
    alertWarning('This is a warning')
    expect(alerts).toStrictEqual([{
      id: expect.stringMatching(/[\da-z]{9}/),
      text: 'This is a warning',
      type: 'warning',
    }])
  })

  test('should register a new info', () => {
    const { alert, alerts } = useAlert()
    alert({ text: 'This is an info', type: 'info' })
    expect(alerts).toStrictEqual([{
      id: expect.stringMatching(/[\da-z]{9}/),
      text: 'This is an info',
      type: 'info',
    }])
  })

  test('should register a new alert and dismiss it after 10ms', async() => {
    const { alert, alerts } = useAlert()
    alert({ duration: 10, text: 'This is an alert', type: 'info' })
    await sleep(15)
    expect(alerts).toStrictEqual([])
  })

  test('should be dismissed once we call the returned "dismiss" function', () => {
    const { alerts, alertWarning } = useAlert()
    const dismiss = alertWarning('This is a warning')
    dismiss()
    expect(alerts).toStrictEqual([])
  })

  test('should dismiss all alerts', () => {
    const { alerts, alertWarning, clear } = useAlert()
    alertWarning('This is a warning')
    alertWarning('This is a warning 2')
    clear()
    expect(alerts).toStrictEqual([])
  })

  test('should dismiss a specific alert', () => {
    const { alert, alerts, dismiss } = useAlert()
    alert({ id: '1', text: 'Hello, World' })
    alert({ id: '2', text: 'Goodbye, World' })
    dismiss({ id: '1' })
    expect(alerts).toStrictEqual([{ id: '2', text: 'Goodbye, World' }])
  })
}
