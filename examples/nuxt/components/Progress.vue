<script setup lang="ts">
defineProps<{
  value: number
  message: string
}>()
</script>

<template>
  <Transition
    enter-active-class="transition ease-out duration-300"
    enter-from-class="opacity-0"
    leave-active-class="transition ease-in duration-300"
    leave-to-class="opacity-0">
    <div v-if="value > 0" class="progress-container">
      <div class="progress-header">
        <p class="text-xs">
          {{ message }}
        </p>
        <p class="text-xs">
          {{ value.toFixed(1) }}%
        </p>
      </div>
      <div class="progress-track">
        <div
          :style="{ width: `${value}%` }"
          class="progress-bar"
        />
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.progress-container {
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.progress-track {
  flex: 1;
  height: 0.25rem;
  background-color: var(--color-base-muted-bg);
  border: 1px solid var(--color-base-muted-border);
  border-radius: 0.375rem;
  width: 100%;
}

.progress-bar {
  height: 100%;
  background: linear-gradient(to right, var(--color-primary-interactive-bg), var(--color-accent-interactive-bg));
  transition: all 300ms;
  border-radius: 0.375rem;
}
</style>
