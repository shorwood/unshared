<script setup lang="ts">
import { dedent } from '@unshared/string/dedent'
import InputText from '../components/InputText.vue'

const values = [
  { label: 'Cooking', value: 'cooking' },
  { label: 'Reading', value: 'reading' },
  { label: 'Running', value: 'running' },
]

const valueSwitch = ref(false)
const valueRadio = ref('cooking')
const valueCheckbox = ref(['cooking'])
const valueList = ref(['TEST', 'Sincere@april.biz'])
const valueText = ref<string>('Hello, <b>World</b>!')
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
          :label="value.label"
          :value="value.value"
        />
      </Card>

      <!-- Radio -->
      <Card title="Radio">
        <InputRadio
          v-for="value in values"
          v-model="valueRadio"
          :label="value.label"
          :value="value.value"
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
      <Card class="col-span-2" title="Editor">
        <div class="w-full">
          <InputEditor v-model="valueEditor"/>
        </div>
      </Card>

      <!-- File -->
      <Card class="col-span-2" title="File">
        <InputFile/>
      </Card>

      <!-- List -->
      <Card class="col-span-2" title="List">
        <InputList v-model="valueList"/>
      </Card>

      <!-- Input Text -->
      <Card class="col-span-2" title="Input Text">
        <InputText
          v-model="valueText"
          :parse="(value) => value.toUpperCase()"
          :serialize="(value) => value.toLowerCase()"
        />
      </Card>

      <!-- Content Editable -->
      <Card class="col-span-2" title="Content Editable">
        <ContentEditable v-model="valueText"/>
      </Card>
    </main>
  </div>
</template>
