import { expect, it } from 'vitest'
import { sleep } from '../../shared/misc/sleep'
import { useAlert } from './useAlert'

it('should register a new error', () => {
  const { alertError, alerts } = useAlert()
  const dismiss = alertError('This is an error')
  expect(alerts).toEqual([{ id: '0', text: 'This is an error', type: 'error' }])
  dismiss()
})

it('should register a new success', () => {
  const { alertSuccess, alerts } = useAlert()
  const dismiss = alertSuccess('This is a success')
  expect(alerts).toEqual([{ id: '1', text: 'This is a success', type: 'success' }])
  dismiss()
})

it('should register a new warning', () => {
  const { alertWarning, alerts } = useAlert()
  const dismiss = alertWarning('This is a warning')
  expect(alerts).toEqual([{ id: '2', text: 'This is a warning', type: 'warning' }])
  dismiss()
})

it('should register a new info', () => {
  const { alert, alerts } = useAlert()
  const dismiss = alert({ text: 'This is an info', type: 'info' })
  expect(alerts).toEqual([{ id: '3', text: 'This is an info', type: 'info' }])
  dismiss()
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

it('should dismiss all alerts when call the "dismiss" function', () => {
  const { alertWarning, alerts, dismiss } = useAlert()
  alertWarning('This is a warning')
  alertWarning('This is a warning 2')
  dismiss()
  expect(alerts).toEqual([])
})

it('should only one alert when call the "dismiss" function with the alert id as it\'s argument', () => {
  const { alertWarning, alerts, dismiss } = useAlert()
  alertWarning('This is a warning')
  alertWarning('This is a warning 2')
  dismiss({ id: '8' })
  expect(alerts.length).toEqual(1)
})
