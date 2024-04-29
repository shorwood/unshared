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
export function useAlert() {
  const alerts = reactive([]) as Alert[]

  // --- Dismiss an alert.
  const dismiss = (alert: Alert) => {
    const index = alerts.findIndex(x => x.id === alert.id)
    alerts.splice(index, 1)
  }

  // --- Create an alert.
  const alert = (alert: Alert): Dismiss => {
    alert.id = alert.id ?? Math.random().toString(36).slice(2, 11)
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
}

/* v8 ignore start */

if (import.meta.vitest) {
  const { sleep } = await import('@unshared/functions/sleep')

  describe('useAlert', () => {
    it('should register a new alert', () => {
      const { alert, alerts } = useAlert()
      alert({
        text: 'This is an alert',
        type: 'info',
      })
      expect(alerts).toMatchObject([{
        id: expect.stringMatching(/[\da-z]{9}/) as string,
        text: 'This is an alert',
        type: 'info',
      }])
    })

    it('should allow a custom id', () => {
      const { alert, alerts } = useAlert()
      alert({
        id: '1',
        text: 'This is an alert',
        type: 'info',
      })
      expect(alerts).toMatchObject([{
        id: '1',
        text: 'This is an alert',
        type: 'info',
      }])
    })
  })

  describe('success', () => {
    it('should register a new success', () => {
      const { alerts, success } = useAlert()
      success('This is a success')
      expect(alerts).toMatchObject([{
        id: expect.stringMatching(/[\da-z]{9}/) as string,
        text: 'This is a success',
        type: 'success',
      }])
    })

    it('should register a new success from an object', () => {
      const { alerts, success } = useAlert()
      success({ text: 'This is a success', title: 'Great news !' })
      expect(alerts).toMatchObject([{
        id: expect.stringMatching(/[\da-z]{9}/) as string,
        text: 'This is a success',
        title: 'Great news !',
        type: 'success',
      }])
    })
  })

  describe('info', () => {
    it('should register a new info', () => {
      const { alert, alerts } = useAlert()
      alert({ text: 'This is an info', type: 'info' })
      expect(alerts).toMatchObject([{
        id: expect.stringMatching(/[\da-z]{9}/) as string,
        text: 'This is an info',
        type: 'info',
      }])
    })

    it('should register a new info from an object', () => {
      const { alerts, info } = useAlert()
      info({ text: 'This is an info', title: 'Information' })
      expect(alerts).toMatchObject([{
        id: expect.stringMatching(/[\da-z]{9}/) as string,
        text: 'This is an info',
        title: 'Information',
        type: 'info',
      }])
    })
  })

  describe('warn', () => {
    it('should register a new warning from a string', () => {
      const { alerts, warn } = useAlert()
      warn('This is a warning')
      expect(alerts).toMatchObject([{
        id: expect.stringMatching(/[\da-z]{9}/) as string,
        text: 'This is a warning',
        type: 'warning',
      }])
    })

    it('should register a new warning from an error', () => {
      const { alerts, warn } = useAlert()
      warn(new Error('This is an error'))
      expect(alerts).toMatchObject([{
        id: expect.stringMatching(/[\da-z]{9}/) as string,
        text: 'This is an error',
        type: 'warning',
      }])
    })

    it('should register a new warning from an object', () => {
      const { alerts, warn } = useAlert()
      warn({ text: 'This is a warning', title: 'Warning!' })
      expect(alerts).toMatchObject([{
        id: expect.stringMatching(/[\da-z]{9}/) as string,
        text: 'This is a warning',
        title: 'Warning!',
        type: 'warning',
      }])
    })
  })

  describe('error', () => {
    it('should register a new error from a string', () => {
      const { alerts, error } = useAlert()
      error('This is an error')
      expect(alerts).toMatchObject([{
        id: expect.stringMatching(/[\da-z]{9}/) as string,
        text: 'This is an error',
        type: 'error',
      }])
    })

    it('should register a new warning from an error', () => {
      const { alerts, warn } = useAlert()
      warn(new Error('This is an error'))
      expect(alerts).toMatchObject([{
        id: expect.stringMatching(/[\da-z]{9}/) as string,
        text: 'This is an error',
        type: 'warning',
      }])
    })

    it('should register a new error from an object', () => {
      const { alerts, error } = useAlert()
      error({ text: 'This is an error', title: 'Error!' })
      expect(alerts).toMatchObject([{
        id: expect.stringMatching(/[\da-z]{9}/) as string,
        text: 'This is an error',
        title: 'Error!',
        type: 'error',
      }])
    })
  })

  describe('dismiss', () => {
    it('should register a new alert and dismiss it after 10ms', async() => {
      const { alert, alerts } = useAlert()
      alert({ duration: 10, text: 'This is an alert', type: 'info' })
      await sleep(15)
      expect(alerts).toMatchObject([])
    })

    it('should be dismissed once we call the returned "dismiss" function', () => {
      const { alerts, warn } = useAlert()
      const dismiss = warn('This is a warning')
      dismiss()
      expect(alerts).toMatchObject([])
    })

    it('should dismiss all alerts', () => {
      const { alerts, warn, clear } = useAlert()
      warn('This is a warning')
      warn('This is a warning 2')
      clear()
      expect(alerts).toMatchObject([])
    })

    it('should dismiss a specific alert', () => {
      const { alert, alerts, dismiss } = useAlert()
      alert({ id: '1', text: 'Hello, World' })
      alert({ id: '2', text: 'Goodbye, World' })
      dismiss({ id: '1' })
      expect(alerts).toMatchObject([{ id: '2', text: 'Goodbye, World' }])
    })
  })
}
