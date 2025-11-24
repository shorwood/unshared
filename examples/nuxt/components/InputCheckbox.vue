<script setup lang="ts">
const props = defineProps<{
  id?: string
  label?: string
  value?: string
  modelValue?: string[]
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
    type="checkbox"
    class="input-checkbox">

    <!-- Circle when active -->
    <div
      class="checkbox-box"
      :class="{
        'inactive': isActive === false,
        'active': isActive === true,
      }">
      <i v-if="isActive === true" class="i-carbon:checkmark checkbox-icon" />
      <i v-if="isActive === 'mixed'" class="i-carbon:close checkbox-icon" />
    </div>

    <!-- Label -->
    <label v-if="label" :for="id" class="checkbox-label">
      {{ label }}
    </label>
  </BaseInputToggle>
</template>

<style scoped>
.input-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  background-color: var(--color-base-surface-bg);
  border: 1px solid var(--color-base-surface-border);
  transition: all 200ms ease-in-out;
}

.input-checkbox:hover {
  background-color: var(--color-base-surface-hover-bg);
  border-color: var(--color-primary-muted-hover-border);
}

.input-checkbox.active {
  background-color: var(--color-primary-surface-bg);
  border-color: var(--color-primary-surface-border);
}

.checkbox-box {
  border-radius: 0.125rem;
  width: 1rem;
  height: 1rem;
  position: relative;
  padding: 0.125rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 200ms ease-in-out;
}

.checkbox-box.inactive {
  border: 1px solid var(--color-base-muted-border);
  background-color: var(--color-base-surface-bg);
}

.checkbox-box.active {
  background-color: var(--color-primary-interactive-bg);
  border: 1px solid var(--color-primary-interactive-border);
}

.checkbox-icon {
  color: var(--color-primary-interactive-fg);
}

.checkbox-label {
  font-size: 0.875rem;
  user-select: none;
  color: var(--color-fg);
}
</style>
