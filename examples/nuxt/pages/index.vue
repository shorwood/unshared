<script setup lang="ts">
import { Button, InputToggle } from '@unshared/vue';
const state = ref<symbol | 'bar' | 'foo'>('foo')
</script>

<template>
  <main class="flex flex-col items-center justify-center h-screen w-screen">
    <InputToggle
      v-model="state"
      value="bar"
      type="radio"
      class-active="bg-red"
      v-slot="{ isActive }">
      {{ isActive }}
    </InputToggle>

    <InputToggle
      v-model="state"
      value="foo"
      type="radio"
      class-active="bg-red"
      v-slot="{ isActive }">
      {{ isActive }}
    </InputToggle>

    <Button
      class="bg-blue text-black active:text-black p-4 cursor-pointer"
      label="YES"
      :as="state === 'foo' ? 'a' : 'button'"
      :debounce="500"
      :disabled="state === 'foo'"
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
