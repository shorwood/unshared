<!-- eslint-disable @typescript-eslint/consistent-type-imports -->
<script setup lang="ts" generic="T">
import type { BaseInputTextOptions } from '@unshared/vue'
const props = defineProps<BaseInputTextOptions<T>>()
</script>

<template>
  <BaseInputText
    v-bind="props"
    label="Text"
    placeholder="Type something..."
    class="
      flex items-center space-x-2 px-2 outline-none
      hover:bg-primary-600/30 bg-primary-600/20
      placeholder-primary-300
      ring-1 ring-primary-900/10 hover:ring-primary-600/100
      transition-all duration-200 ease-in-out
      px-4 py-2 rounded-md w-full
    "
  />
</template>
