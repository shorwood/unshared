/* oxlint-disable @typescript-eslint/no-unsafe-call */
/* oxlint-disable @typescript-eslint/no-unsafe-assignment */

import type { Meta, StoryObj } from '@storybook/vue3'
import InputRadio from './InputRadio.vue'

type Story = StoryObj<typeof InputRadio>

/**
 * The `InputRadio` component is a component that allows the user to select a single option from a
 * list of options. It is a radio button that can be used in forms to select a single value.
 */
export default {
  title: 'Elements/InputRadio',
  component: InputRadio,
  tags: ['autodocs'],
  argTypes: {
    id: {
      description: 'The ID of the input that should be unique to the page.',
    },
    label: {
      description: 'The label of the input that should be displayed next to the input.',
    },
    value: {
      description: 'The value to set the `v-model` to when the input is selected.',
    },
    modelValue: {
      description: 'The value of the input.',
    },
  },
} satisfies Meta<typeof InputRadio>

export const Default: Story = {
  render: () => ({
    components: { InputRadio },
    setup: () => {
      const value = ref('value-1')
      return { value }
    },
    template: `
      <div class="flex space-x-2">
        <InputRadio id="value-1" label="Value 1" v-model="value" value="value-1"/>
        <InputRadio id="value-2" label="Value 2" v-model="value" value="value-2"/>
        <InputRadio id="value-3" label="Value 3" v-model="value" value="value-3"/>
      </div>
    `,
  }),
}
