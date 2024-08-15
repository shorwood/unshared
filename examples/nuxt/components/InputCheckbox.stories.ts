/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import type { Meta, StoryObj } from '@storybook/vue3'
import InputCheckbox from './InputCheckbox.vue'

type Story = StoryObj<typeof InputCheckbox>

/**
 * The `InputCheckbox` component is a component that allows the user to select multiple options from
 * a list of options. It is a checkbox that can be used in forms to select multiple values.
 */
export default {
  title: 'Elements/InputCheckbox',
  component: InputCheckbox,
  tags: ['autodocs'],
  argTypes: {
    id: {
      description: 'The ID of the input that should be unique to the page.',
      control: { type: 'text' },
    },
    label: {
      description: 'The label of the input that should be displayed next to the input.',
      control: { type: 'text' },
    },
    value: {
      description: 'The value to set the `v-model` to when the input is selected.',
      control: { type: 'text' },
    },
    modelValue: {
      description: 'The value of the input.',
      control: { type: 'text' },
    },
  },
} satisfies Meta<typeof InputCheckbox>

export const Default: Story = {
  render: () => ({
    components: { InputCheckbox },
    setup: () => {
      const value = ref(['value-1'])
      return { value }
    },
    template: `
      <div class="flex space-x-2">
        <InputCheckbox id="value-1" label="Value 1" v-model="value" value="value-1"/>
        <InputCheckbox id="value-2" label="Value 2" v-model="value" value="value-2"/>
        <InputCheckbox id="value-3" label="Value 3" v-model="value" value="value-3"/>
      </div>
    `,
  }),
}
