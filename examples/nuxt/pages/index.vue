<script setup lang="ts">
import { Button, InputToggle } from '@unshared/vue'
import '@unocss/reset/sanitize'

const state = ref<'bar' | 'foo' | symbol>('foo')
</script>

<template>
  <main class="flex flex-col items-center justify-center h-screen w-screen">
    <InputToggle
      v-slot="{ isActive }"
      v-model="state"
      class-active="bg-red"
      type="radio"
      value="bar">
      {{ isActive }}
    </InputToggle>

    <InputToggle
      v-slot="{ isActive }"
      v-model="state"
      class-active="bg-red"
      type="radio"
      value="foo">
      {{ isActive }}
    </InputToggle>

    <Button
      v-slot="{ isLink }"
      :debounce="500"
      :disabled="state === 'foo'"
      class="bg-blue gradient-mask-tr-50/80 text-black active:text-black p-4 cursor-pointer"
      label="YES">
      {{ isLink }}
    </Button>

    <div class="flex flex-col items-center justify-center">
      <p>Hello, world!</p>
      <p>Hello, world!</p>
      <p>Hello, world!</p>
    </div>
  </main>
  <NuxtPage />
</template>

<style>
html {
  background: #222;
  color: white;
}
</style>
