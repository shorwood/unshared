/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { reactive } from 'vue-demi'

export interface Alert {
  /** Unique id for lifecycle handling. Defaults to auto-generated one. */
  id?: string
  /** Content of the alert. */
  text?: string
  /** Type of alert. Defines the design of the toast. */
  type?: 'error' | 'info' | 'success' | 'warning'
  /** Duration of the alert in ms. */
  duration?: number
}

type Dismiss = () => void

export interface UseAlertReturnType {
  /** The active alerts pool. */
  alerts: Alert[]
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
  /**
   * Dismiss an alert or all allerts
   *
   * @param alert The alert to dismiss. If undefined, all alerts will be dismissed
   */
  dismiss: (alert: Alert) => void
  /**
   * Clear all alerts
   */
  clear: () => void
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
    alerts,
    alert,
    alertError,
    alertSuccess,
    alertWarning,
    dismiss,
    clear,
  }
}

/* v8 ignore start */
if (import.meta.vitest) {
  const { sleep } = await import('@unshared/functions/sleep')

  it('should register a new alert', () => {
    const { alertError, alerts } = useAlert()
    alertError('This is an error')
    expect(alerts).toEqual([{
      id: expect.stringMatching(/[\da-z]{9}/),
      text: 'This is an error',
      type: 'error',
    }])
  })

  it('should register a new success', () => {
    const { alertSuccess, alerts } = useAlert()
    alertSuccess('This is a success')
    expect(alerts).toEqual([{
      id: expect.stringMatching(/[\da-z]{9}/),
      text: 'This is a success',
      type: 'success',
    }])
  })

  it('should register a new warning', () => {
    const { alertWarning, alerts } = useAlert()
    alertWarning('This is a warning')
    expect(alerts).toEqual([{
      id: expect.stringMatching(/[\da-z]{9}/),
      text: 'This is a warning',
      type: 'warning',
    }])
  })

  it('should register a new info', () => {
    const { alert, alerts } = useAlert()
    alert({ text: 'This is an info', type: 'info' })
    expect(alerts).toEqual([{
      id: expect.stringMatching(/[\da-z]{9}/),
      text: 'This is an info',
      type: 'info',
    }])
  })

  it('should register a new alert and dismiss it after 10ms', async() => {
    const { alert, alerts } = useAlert()
    alert({ text: 'This is an alert', type: 'info', duration: 10 })
    await sleep(15)
    expect(alerts).toEqual([])
  })

  it('should be dismissed once we call the returned "dismiss" function', () => {
    const { alertWarning, alerts } = useAlert()
    const dismiss = alertWarning('This is a warning')
    dismiss()
    expect(alerts).toEqual([])
  })

  it('should dismiss all alerts', () => {
    const { alertWarning, alerts, clear } = useAlert()
    alertWarning('This is a warning')
    alertWarning('This is a warning 2')
    clear()
    expect(alerts).toEqual([])
  })

  it('should dismiss a specific alert', () => {
    const { alert, alerts, dismiss } = useAlert()
    alert({ text: 'Hello, World', id: '1' })
    alert({ text: 'Goodbye, World', id: '2' })
    dismiss({ id: '1' })
    expect(alerts).toEqual([{ text: 'Goodbye, World', id: '2' }])
  })
}
