<script setup lang="ts">
import { InputToggle } from '@unshared/vue';
const state = ref(false)
</script>

<template>
  <main class="flex items-center justify-center h-screen w-screen">
    <InputToggle
      v-slot="{ isActive, modelValue }"
      v-model="state"
      type="checkbox"
      class-active="!bg-blue/10">
      <p>
        <pre>{{ { isActive, modelValue } }}</pre>
        {{ isActive ? 'Active' : 'Inactive' }}
      </p>
    </InputToggle>

    <p>Hello, world!</p>

    <p>Hello, world!</p>

    <p>Hello, world!</p>
  </main>
</template>

<style>
html {
  background: #222;
  color: white;
}
</style>
