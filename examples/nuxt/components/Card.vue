<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>

<template>
  <div class="bg-blue/5 border border-blue/10 p-4 rounded-lg w-full h-full">
    <h3 class="text-lg font-bold mb-4">
      {{ title }}
    </h3>
    <div class="flex space-x-3">
      <slot></slot>
    </div>
  </div>
</template>
