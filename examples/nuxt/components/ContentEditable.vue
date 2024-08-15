<script setup lang="ts">
const props = defineProps<{ modelValue?: string }>()
const element = ref<HTMLElement>()
const model = useVModel(props, 'modelValue', undefined, { passive: true })
const cursor = useElementSelection(element)
</script>

<template>
  <div class="w-full space-y-4">

    <BaseContentEditable
      ref="element"
      v-model="model"
      class="
        px-2 outline-none
        bg-transparent w-full h-24
        ring-1 ring-primary-900/10 hover:ring-primary-600/100
        transition-all duration-200 ease-in-out
        px-4 py-2 rounded-md w-full
      "
    />

    <pre>CURSOR: {{ cursor ?? 'NONE' }}</pre>

    <pre>V-MODEL: {{ model ?? 'undefined' }}</pre>
  </div>
</template>
