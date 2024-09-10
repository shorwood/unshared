<script setup lang="ts">
defineProps<{
  title?: string
}>()

const isOpen = ref(false)
</script>

<template>
  <div class="bg-blue/5 border border-blue/10 rounded-lg w-full h-full">

    <!-- Header -->
    <BaseButton
      as="h3"
      class="flex items-center space-x-4 cursor-pointer p-4"
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
      :isOpen="isOpen"
      :class="{ 'opacity-0': !isOpen }"
      class="transition-all ease-in-out duration-200">
      <div class="flex space-x-3 p-4 pt-px">
        <slot/>
      </div>
    </BaseCollapse>
  </div>
</template>
