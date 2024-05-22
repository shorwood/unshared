<script setup lang="ts">
import { dedent } from '@unshared/string/dedent'

const values = [
  { label: 'Cooking', value: 'cooking' },
  { label: 'Reading', value: 'reading' },
  { label: 'Running', value: 'running' },
]

const valueSwitch = ref(false)
const valueRadio = ref('cooking')
const valueCheckbox = ref(['cooking'])
const valueList = ref(['TEST', 'Sincere@april.biz'])

const valueEditor = ref(dedent(`
  program odd_even
  implicit none
  integer :: number

  ! Read or attribute value to number before test
  read*,number
      if (MOD(number,2) .eq. 0) then
          print*, 'number is even.'
          ELSE
          print*,'number is odd'
      end if

  end program odd_even
`))
</script>

<template>
  <div class="w-screen min-h-screen bg-secondary-900 text-white flex items-center justify-center pb-48">
    <main class="grid grid-cols-2 gap-4 items-center justify-stretch max-w-3xl mx-auto my-24">

      <!-- Checkbox -->
      <Card title="Checkbox">
        <InputCheckbox
          v-for="value in values"
          v-model="valueCheckbox"
          :value="value.value"
          :label="value.label"
        />
      </Card>

      <!-- Radio -->
      <Card title="Radio">
        <InputRadio
          v-for="value in values"
          v-model="valueRadio"
          :value="value.value"
          :label="value.label"
        />
      </Card>

      <!-- Switch -->
      <Card title="Switch">
        <InputSwitch
          v-model="valueSwitch"
          label="Switch"
        />
      </Card>

      <!-- Progress -->
      <Card title="Progress">
        <Progress
          :value="100"
          message="Downloading..."
        />
      </Card>

      <!-- Editor -->
      <Card title="Editor" class="col-span-2">
        <div class="w-full">
          <InputEditor v-model="valueEditor"/>
        </div>
      </Card>

      <!-- File -->
      <Card title="File" class="col-span-2">
        <InputFile/>
      </Card>

      <!-- List -->
      <Card title="List" class="col-span-2">
        <InputList v-model="valueList"/>
      </Card>
    </main>
  </div>
</template>
