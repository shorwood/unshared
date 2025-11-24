<script setup lang="ts">
defineProps<{
  label?: string
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
}>()
</script>

<template>
  <BaseButton
    :class="[
      'button',
      `button-${variant ?? 'primary'}`,
      `button-${size ?? 'md'}`,
    ]">
    <slot>{{ label }}</slot>
  </BaseButton>
</template>

<style scoped>
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-weight: 500;
  border-radius: 0.5rem;
  transition: all 200ms ease-in-out;
  cursor: pointer;
  border: none;
  outline: none;
}

.button:focus-visible {
  outline: 2px solid var(--color-primary-interactive-focus-border);
  outline-offset: 2px;
}

/* Sizes */
.button-sm {
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
}

.button-md {
  padding: 0.5rem 1rem;
  font-size: 1rem;
}

.button-lg {
  padding: 0.75rem 1.5rem;
  font-size: 1.125rem;
}

/* Primary variant */
.button-primary {
  background-color: var(--color-primary-interactive-bg);
  color: var(--color-primary-interactive-fg);
  border: 1px solid var(--color-primary-interactive-border);
}

.button-primary:hover {
  background-color: var(--color-primary-interactive-hover-bg);
  color: var(--color-primary-interactive-hover-fg);
  border-color: var(--color-primary-interactive-hover-border);
}

.button-primary:active {
  background-color: var(--color-primary-interactive-active-bg);
  color: var(--color-primary-interactive-active-fg);
  border-color: var(--color-primary-interactive-active-border);
}

.button-primary:disabled {
  background-color: var(--color-primary-interactive-disabled-bg);
  color: var(--color-primary-interactive-disabled-fg);
  border-color: var(--color-primary-interactive-disabled-border);
  cursor: not-allowed;
}

/* Secondary variant (outline style using muted) */
.button-secondary {
  background-color: transparent;
  color: var(--color-primary-interactive-fg);
  border: 2px solid var(--color-primary-muted-border);
}

.button-secondary:hover {
  background-color: var(--color-primary-surface-hover-bg);
  color: var(--color-primary-surface-hover-fg);
  border-color: var(--color-primary-muted-hover-border);
}

.button-secondary:active {
  background-color: var(--color-primary-surface-active-bg);
  color: var(--color-primary-surface-active-fg);
  border-color: var(--color-primary-muted-active-border);
}

.button-secondary:disabled {
  background-color: transparent;
  color: var(--color-primary-muted-disabled-fg);
  border-color: var(--color-primary-muted-disabled-border);
  cursor: not-allowed;
}

/* Accent variant */
.button-accent {
  background-color: var(--color-accent-interactive-bg);
  color: var(--color-accent-interactive-fg);
  border: 1px solid var(--color-accent-interactive-border);
}

.button-accent:hover {
  background-color: var(--color-accent-interactive-hover-bg);
  color: var(--color-accent-interactive-hover-fg);
  border-color: var(--color-accent-interactive-hover-border);
}

.button-accent:active {
  background-color: var(--color-accent-interactive-active-bg);
  color: var(--color-accent-interactive-active-fg);
  border-color: var(--color-accent-interactive-active-border);
}

.button-accent:disabled {
  background-color: var(--color-accent-interactive-disabled-bg);
  color: var(--color-accent-interactive-disabled-fg);
  border-color: var(--color-accent-interactive-disabled-border);
  cursor: not-allowed;
}

/* Ghost variant (uses surface for subtle background) */
.button-ghost {
  background-color: transparent;
  color: var(--color-primary-normal-fg);
  border: 1px solid transparent;
}

.button-ghost:hover {
  background-color: var(--color-primary-surface-hover-bg);
  color: var(--color-primary-surface-hover-fg);
  border-color: var(--color-primary-surface-hover-border);
}

.button-ghost:active {
  background-color: var(--color-primary-surface-active-bg);
  color: var(--color-primary-surface-active-fg);
  border-color: var(--color-primary-surface-active-border);
}

.button-ghost:disabled {
  background-color: transparent;
  color: var(--color-base-muted-disabled-fg);
  border-color: transparent;
  cursor: not-allowed;
}
</style>
