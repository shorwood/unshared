import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import { useOutsideEvent } from './useOutsideEvent'

// @vitest-environment happy-dom
describe('useOutsideEvent', () => {
  test('should call the callback when the event is emitted outside the element', () => {
    const callback = vi.fn()
    mount({
      template: '<div ref="element"></div>',
      setup() {
        const element = ref()
        useOutsideEvent(element, 'click', callback)
        return { element }
      },
    })

    document.body.click()
    expect(callback).toHaveBeenCalledOnce()
  })

  test('should not call the callback when the event is emitted from the element', () => {
    const callback = vi.fn()
    const wrapper = mount({
      template: '<div ref="element"></div>',
      setup() {
        const element = ref()
        useOutsideEvent(element, 'click', callback)
        return { element }
      },
    })

    wrapper.find('div').element.click()
    expect(callback).not.toHaveBeenCalled()
  })

  test('should not call the callback when the event is emitted inside the element', () => {
    const callback = vi.fn()
    const wrapper = mount({
      template: '<div ref="element"><button></button></div>',
      setup() {
        const element = ref()
        useOutsideEvent(element, 'click', callback)
        return { element }
      },
    })

    wrapper.find('button').element.click()
    expect(callback).not.toHaveBeenCalled()
  })
})
