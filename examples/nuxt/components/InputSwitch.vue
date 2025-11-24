<script setup lang="ts">
const props = defineProps<{
  id?: string
  label?: string
  value?: string
  modelValue?: boolean
}>()

const model = useVModel(props, 'modelValue')
</script>

<template>
  <!-- Input -->
  <BaseInputToggle
    :id="id"
    v-slot="{ isActive }"
    v-model="model"
    as="div"
    class-active="active"
    type="switch"
    class="input-switch">

    <!-- Circle when active -->
    <div class="switch-track">
      <div
        :class="{
          'translate-x-3': isActive,
          'translate-x-0': !isActive,
        }"
        class="switch-thumb"
      />

    </div>

    <!-- Label -->
    <label v-if="label" :for="id" class="switch-label">
      {{ label }}
    </label>
  </BaseInputToggle>
</template>

<style scoped>
.input-switch {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  background-color: var(--color-base-surface-bg);
  border: 1px solid var(--color-base-surface-border);
  transition: all 200ms ease-in-out;
}

.input-switch:hover {
  background-color: var(--color-base-surface-hover-bg);
  border-color: var(--color-primary-muted-hover-border);
}

.input-switch:active,
.input-switch.active {
  background-color: var(--color-primary-surface-bg);
  border-color: var(--color-primary-surface-border);
}

.switch-track {
  border-radius: 0.5rem;
  width: 2rem;
  height: 1rem;
  position: relative;
  background-color: var(--color-primary-interactive-bg);
  border: 1px solid var(--color-primary-interactive-border);
  padding: 0.25rem;
  display: flex;
  align-items: center;
}

.switch-thumb {
  background-color: var(--color-primary-interactive-fg);
  border-radius: 0.375rem;
  width: 0.75rem;
  height: 0.75rem;
  transform: translateX(0);
  transition: all 200ms ease-in-out;
}

.switch-label {
  font-size: 0.875rem;
  user-select: none;
  color: var(--color-fg);
}
</style>
