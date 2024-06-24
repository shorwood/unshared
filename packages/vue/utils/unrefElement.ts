import { ComponentPublicInstance, MaybeRef, unref } from 'vue'

/**
 * Given a ref or raw value of an HTMLElement or ComponentInstance, this function
 * will extract the HTMLElement from the ComponentInstance or return the HTMLElement
 * directly.
 *
 * @param element The element to extract the HTMLElement from.
 * @returns The HTMLElement or undefined if the element is not provided.
 */
function unrefElement(element?: MaybeRef<ComponentPublicInstance | HTMLElement | undefined>): HTMLElement | undefined {
  if (!element) return
  const elementValue = unref(element)
  if (!elementValue) return
  if (elementValue instanceof HTMLElement) return elementValue
  return elementValue.$el as HTMLElement
}

/* v8 ignore start */
if (import.meta.vitest) {

  // @vitest-environment happy-dom
  const { defineComponent } = await import('vue')
  const { mount } = await import('@vue/test-utils')

  test('should return undefined if the element is not provided', () => {
    const result = unrefElement()
    expect(result).toBeUndefined()
  })

  test('should return the HTMLElement directly', () => {
    const element = document.createElement('div')
    const result = unrefElement(element)
    expect(result).toBe(element)
    expect(result).toBeInstanceOf(HTMLDivElement)
  })

  test('should return the HTMLElement from the ComponentInstance', () => {
    const component = defineComponent({ template: '<div />' })
    const instance = mount(component).vm
    const result = unrefElement(instance)
    // expect(result).toBe(instance)
    expect(result).toBeInstanceOf(HTMLDivElement)
  })

  test('should return undefined if the element is not an HTMLElement', () => {
    // @ts-expect-error: Test case for invalid element type.
    const result = unrefElement({})
    expect(result).toBeUndefined()
  })
}
