// @vitest-environment happy-dom
import { expect, it } from 'vitest'
import { nextTick, ref } from 'vue-demi'
import { until } from '@vueuse/shared'
import { useIconify } from './useIconify'

it('updates the svg when props change', async() => {
  const iconName = ref('mdi:check')
  const { svg: icon, update } = useIconify(iconName)
  expect(icon.value).toBeUndefined()

  await update()
  const firstIcon = icon.value
  expect(icon.value).toBeDefined()
  expect(icon.value).toMatch('<svg xmlns=')

  iconName.value = 'mdi:account'
  await nextTick()
  await until(icon).changed()
  expect(icon.value).toBeDefined()
  expect(icon.value).toMatch('<svg xmlns=')
  expect(icon.value).not.toEqual(firstIcon)
})
