import { useAlerts } from './useAlerts'

describe('useAlerts', () => {
  beforeEach(() => {
    const { clear } = useAlerts()
    clear()
  })

  describe('useAlert', () => {
    it('should register a new alert', () => {
      const { alert, alerts } = useAlerts()
      alert({
        text: 'This is an alert',
        type: 'info',
      })
      expect(alerts).toMatchObject([{
        id: expect.stringMatching(/\d+/) as string,
        text: 'This is an alert',
        type: 'info',
      }])
    })

    it('should allow a custom id', () => {
      const { alert, alerts } = useAlerts()
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
      const { alerts, success } = useAlerts()
      success('This is a success')
      expect(alerts).toMatchObject([{
        id: expect.stringMatching(/\d+/) as string,
        text: 'This is a success',
        type: 'success',
      }])
    })

    it('should register a new success from an object', () => {
      const { alerts, success } = useAlerts()
      success({ text: 'This is a success', title: 'Great news !' })
      expect(alerts).toMatchObject([{
        id: expect.stringMatching(/\d+/) as string,
        text: 'This is a success',
        title: 'Great news !',
        type: 'success',
      }])
    })
  })

  describe('info', () => {
    it('should register a new info', () => {
      const { alert, alerts } = useAlerts()
      alert({ text: 'This is an info', type: 'info' })
      expect(alerts).toMatchObject([{
        id: expect.stringMatching(/\d+/) as string,
        text: 'This is an info',
        type: 'info',
      }])
    })

    it('should register a new info from an object', () => {
      const { alerts, info } = useAlerts()
      info({ text: 'This is an info', title: 'Information' })
      expect(alerts).toMatchObject([{
        id: expect.stringMatching(/\d+/) as string,
        text: 'This is an info',
        title: 'Information',
        type: 'info',
      }])
    })
  })

  describe('warn', () => {
    it('should register a new warning from a string', () => {
      const { alerts, warn } = useAlerts()
      warn('This is a warning')
      expect(alerts).toMatchObject([{
        id: expect.stringMatching(/\d+/) as string,
        text: 'This is a warning',
        type: 'warning',
      }])
    })

    it('should register a new warning from an error', () => {
      const { alerts, warn } = useAlerts()
      warn(new Error('This is an error'))
      expect(alerts).toMatchObject([{
        id: expect.stringMatching(/\d+/) as string,
        text: 'This is an error',
        type: 'warning',
      }])
    })

    it('should register a new warning from an object', () => {
      const { alerts, warn } = useAlerts()
      warn({ text: 'This is a warning', title: 'Warning!' })
      expect(alerts).toMatchObject([{
        id: expect.stringMatching(/\d+/) as string,
        text: 'This is a warning',
        title: 'Warning!',
        type: 'warning',
      }])
    })
  })

  describe('error', () => {
    it('should register a new error from a string', () => {
      const { alerts, error } = useAlerts()
      error('This is an error')
      expect(alerts).toMatchObject([{
        id: expect.stringMatching(/\d+/) as string,
        text: 'This is an error',
        type: 'error',
      }])
    })

    it('should register a new warning from an error', () => {
      const { alerts, warn } = useAlerts()
      warn(new Error('This is an error'))
      expect(alerts).toMatchObject([{
        id: expect.stringMatching(/\d+/) as string,
        text: 'This is an error',
        type: 'warning',
      }])
    })

    it('should register a new error from an object', () => {
      const { alerts, error } = useAlerts()
      error({ text: 'This is an error', title: 'Error!' })
      expect(alerts).toMatchObject([{
        id: expect.stringMatching(/\d+/) as string,
        text: 'This is an error',
        title: 'Error!',
        type: 'error',
      }])
    })
  })

  describe('dismiss', () => {
    it('should register a new alert and dismiss it after 10ms', async() => {
      const { alert, alerts } = useAlerts()
      alert({ duration: 10, text: 'This is an alert', type: 'info' })
      await new Promise(resolve => setTimeout(resolve, 15))
      expect(alerts).toMatchObject([])
    })

    it('should be dismissed once we call the returned "dismiss" function', () => {
      const { alerts, warn } = useAlerts()
      const dismiss = warn('This is a warning')
      dismiss()
      expect(alerts).toMatchObject([])
    })

    it('should dismiss all alerts', () => {
      const { alerts, warn, clear } = useAlerts()
      warn('This is a warning')
      warn('This is a warning 2')
      clear()
      expect(alerts).toMatchObject([])
    })

    it('should dismiss a specific alert', () => {
      const { alert, alerts, dismiss } = useAlerts()
      alert({ id: '1', text: 'Hello, World' })
      alert({ id: '2', text: 'Goodbye, World' })
      dismiss({ id: '1' })
      expect(alerts).toMatchObject([{ id: '2', text: 'Goodbye, World' }])
    })
  })
})
