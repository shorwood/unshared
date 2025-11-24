<script setup lang="ts">
const props = defineProps<{
  id?: string
  label?: string
  value?: string
  modelValue?: string
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
    :value="value"
    class-active="active"
    type="radio"
    class="input-radio">

    <!-- Circle when active -->
    <div class="radio-circle">
      <div
        :class="{
          'opacity-0 scale-0': !isActive,
          'opacity-100 scale-100': isActive,
        }"
        class="radio-inner"
      />

    </div>

    <!-- Label -->
    <label v-if="label" :for="id" class="radio-label">
      {{ label }}
    </label>
  </BaseInputToggle>
</template>

<style scoped>
.input-radio {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  background-color: var(--color-base-surface-bg);
  border: 1px solid var(--color-base-surface-border);
  transition: all 200ms ease-in-out;
}

.input-radio:hover {
  background-color: var(--color-base-surface-hover-bg);
  border-color: var(--color-primary-muted-hover-border);
}

.input-radio.active {
  background-color: var(--color-primary-surface-bg);
  border-color: var(--color-primary-surface-border);
}

.radio-circle {
  border-radius: 0.5rem;
  width: 1rem;
  height: 1rem;
  position: relative;
  background-color: var(--color-primary-interactive-bg);
  border: 1px solid var(--color-primary-interactive-border);
  padding: 0.3rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.radio-inner {
  background-color: var(--color-primary-interactive-fg);
  border-radius: 0.375rem;
  width: 100%;
  height: 100%;
  transform: scale(1);
  transition: all 200ms ease-in-out;
}

.radio-label {
  font-size: 0.875rem;
  user-select: none;
  color: var(--color-fg);
}
</style>
