<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  title?: string
}>()

const isOpen = ref(false)
</script>

<template>
  <div class="themed-card rounded-lg w-full h-full border">
    <!-- Header -->
    <BaseButton
      as="h3"
      class="flex items-center space-x-4 cursor-pointer p-4 themed-card-header"
      @click="() => { isOpen = !isOpen }">
      <span class="text-lg font-bold">
        {{ title }}
      </span>
      <BaseIcon
        icon="i-carbon:chevron-down"
        class="transform transition-transform"
        :class="{ 'rotate-180': isOpen }"
      />
    </BaseButton>

    <!-- Content -->
    <BaseCollapse
      vertical
      :is-open="isOpen"
      :class="{ 'opacity-0': !isOpen }"
      class="transition-all ease-in-out duration-200">
      <div class="flex space-x-3 p-4 pt-px overflow-clip">
        <slot />
      </div>
    </BaseCollapse>
  </div>
</template>

<style scoped>
.themed-card {
  background-color: var(--color-base-surface-bg);
  border-color: var(--color-base-surface-border);
  transition: all 0.3s ease;
}

.themed-card-header {
  transition: background-color 0.2s ease;
}

.themed-card-header:hover {
  background-color: var(--color-base-surface-hover-bg);
}
</style>
