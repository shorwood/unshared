<script setup lang="ts">
import { useElementSelection } from '@unshared/vue/useElementSelection';
import { ref } from 'vue';

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
      class="content-editable"
    />

    <pre>CURSOR: {{ cursor ?? 'NONE' }}</pre>

    <pre>V-MODEL: {{ model ?? 'undefined' }}</pre>
  </div>
</template>

<style scoped>
.content-editable {
  padding: 0.5rem 1rem;
  background-color: var(--color-base-surface-bg);
  color: var(--color-base-surface-fg);
  width: 100%;
  height: 6rem;
  border: 1px solid var(--color-base-muted-border);
  transition: all 200ms ease-in-out;
  border-radius: 0.375rem;
}

.content-editable:hover {
  border-color: var(--color-primary-muted-hover-border);
  background-color: var(--color-base-surface-hover-bg);
}

.content-editable:focus {
  outline: 2px solid var(--color-primary-interactive-focus-border);
  outline-offset: 2px;
  border-color: var(--color-primary-interactive-border);
}
</style>
