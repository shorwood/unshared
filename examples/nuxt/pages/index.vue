<script setup lang="ts">
import { Button, InputToggle } from '@unshared/vue';
const state = ref<'bar' | 'foo' | symbol>('foo')
</script>

<template>
  <main class="flex flex-col items-center justify-center h-screen w-screen">
    <InputToggle
      class-active="bg-red"
      type="checkbox"
      v-model="state"
      v-slot="{ isActive }"
      value="bar">
      {{ isActive }}
    </InputToggle>

    <InputToggle
      class-active="bg-red"
      type="radio"
      v-model="state"
      v-slot="{ isActive }"
      value="foo">
      {{ isActive }}
    </InputToggle>

    <Button
      :as="state.value === 'foo' ? 'a' : 'button'"
      :debounce="500"
      :disabled="state === 'foo'"
      class="bg-blue text-black active:text-black p-4 cursor-pointer"
      label="YES"
      v-slot="{ isLink }">
      {{ isLink }}
    </Button>

    <div>
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
