<script setup lang="ts">
import { createParser, isStringEmail, isStringEmpty, isStringNumber } from '@unshared/validation'

const values = [
  { label: 'Foo', value: 'foo' },
  { label: 'Bar', value: 'bar' },
  { label: 'Baz', value: 'baz' },
]

type Value = typeof values[number]['value']

const valueSwitch = ref(false)
const valueRadio = ref<Value>('foo')
const valueCheckbox = ref<Value[]>(['foo'])

const valueText = ref('')
const valueParser = createParser(
  [x => x.trim(), isStringEmpty],
  [x => x.trim(), isStringEmail, (x: string) => x.toUpperCase()],
  [x => x.trim(), isStringNumber],
)
</script>

<template>
  <main class="flex flex-col items-center justify-center h-screen w-screen">

    <!-- Checkbox -->
    <div class="flex space-x-4">
      <BaseInputToggle
        as="div"
        v-for="value in values"
        v-slot="{ isActive }"
        v-model="valueCheckbox"
        class="bg-blue w-12 h-12"
        class-active="bg-red"
        type="checkbox"
        :value="value.value">
        {{ isActive }}
      </BaseInputToggle>
    </div>

    <!-- Radio -->
    <div class="flex space-x-4">
      <BaseInputToggle
        as="div"
        v-for="value in values"
        v-slot="{ isActive }"
        v-model="valueRadio"
        class="bg-blue w-12 h-12"
        class-active="bg-red"
        type="radio"
        :value="value.value">
        {{ isActive }}
      </BaseInputToggle>
    </div>

    <!-- Switch -->
    <BaseInputToggle
      as="div"
      v-model="valueSwitch"
      class="bg-blue w-12 h-12"
      class-active="bg-red"
      type="switch">
      {{ valueSwitch }}
    </BaseInputToggle>

    <hr class="w-1/2 my-4" />

    <!-- Text input -->
    <div>

      <BaseIcon
        as="div"
        icon="i-carbon:search"
      />

      <BaseInputText
        v-model="valueText"
        v-bind:parse="(x: string) => valueParser(x)"
        class="bg-blue/20 text-white p-4"
        placeholder="Type something..."
        type="text"
        :parse="valueParser"
      />

      <!-- Value -->
      <p>{{ valueText }}</p>
    </div>

    <!--
      <BaseButton
      v-slot="{ isLink }"
      :debounce="500"
      :disabled="valueRadio === 'foo'"
      class="bg-blue text-black active:text-black p-4 cursor-pointer"
      class-disabled="bg-gray text-gray"
      label="YES">
      {{ isLink }}
      </BaseButton>
    -->

    <div class="flex flex-col items-center justify-center">
      <p>Hello, world!</p>
      <p>Hello, world!</p>
      <p>Hello, world!</p>
    </div>

    <NuxtPage />
  </main>
</template>

<style>
html {
  background: #222;
  color: white;
}
</style>
