<script setup lang="ts">
defineProps<{
  value: number
  message: string
}>()
</script>

<template>
  <Transition
    name="fade"
    enter-active-class="transition ease-out duration-300"
    leave-active-class="transition ease-in duration-300"
    enter-from-class="opacity-0"
    leave-to-class="opacity-0">
    <div v-if="value > 0" class="flex-1 w-full space-y-2">
      <div class="flex justify-between items-center">
        <p class="text-xs">
          {{ message }}
        </p>
        <p class="text-xs">
          {{ value.toFixed(1) }}%
        </p>
      </div>
      <div class="flex-1 h-1 bg-app-500 rounded-md w-full">
        <div
          class="h-full bg-gradient-to-r from-primary-500 to-secondary-700 transition-all duration-300 rounded-md"
          :style="{ width: `${value}%` }"
        />
      </div>
    </div>
  </Transition>
</template>
