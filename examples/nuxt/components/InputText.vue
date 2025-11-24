<!-- eslint-disable vue/prop-name-casing -->
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
    class="input-text"
  />
</template>

<style scoped>
.input-text {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: var(--color-base-surface-bg);
  color: var(--color-base-surface-fg);
  width: 100%;
  border-radius: 0.375rem;
  border: 1px solid var(--color-base-muted-border);
  transition: all 200ms ease-in-out;
}

.input-text:hover {
  background-color: var(--color-base-surface-hover-bg);
  border-color: var(--color-primary-muted-hover-border);
}

.input-text:focus {
  outline: 2px solid var(--color-primary-interactive-focus-border);
  outline-offset: 2px;
  border-color: var(--color-primary-interactive-border);
}

.input-text::placeholder {
  color: var(--color-base-muted-fg);
}
</style>
