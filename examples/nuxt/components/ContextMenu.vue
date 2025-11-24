<script setup lang="ts">
import { BaseMenu } from '@unshared/vue/BaseMenu'
</script>

<template>
  <BaseMenu x="left" y="below">

    <!-- Trigger -->
    <template #default="{ isOpen, open }">
      <div
        class="context-trigger"
        :class="{ 'open': isOpen }"
        @contextmenu.prevent="() => open()">
        <slot />
      </div>
    </template>

    <!-- Menu -->
    <template #menu="{ close, isOpen }">
      <BaseCollapse
        vertical
        :is-open="isOpen"
        :class="{ 'opacity-0': !isOpen }"
        class="context-menu">
        <div class="context-items">
          <BaseButton
            v-for="i in 5"
            :key="i"
            class="context-item"
            @click="() => { close(); return 1 }">
            Item {{ i }}
          </BaseButton>
        </div>
      </BaseCollapse>
    </template>
  </BaseMenu>
</template>

<style scoped>
.context-trigger {
  background-color: var(--color-base-surface-bg);
  border: 1px solid var(--color-base-surface-border);
  border-radius: 0.5rem;
  transition: all 200ms ease-in-out;
}

.context-trigger.open {
  background-color: var(--color-primary-surface-bg);
  border-color: var(--color-primary-surface-border);
}

.context-menu {
  transition: all 100ms ease-in-out;
  background-color: var(--color-base-muted-bg);
  border: 1px solid var(--color-base-muted-border);
  border-radius: 0.5rem;
  backdrop-filter: blur(2rem);
}

.context-items {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 1rem;
  width: 12rem;
}

.context-item {
  display: block;
  width: 100%;
  padding: 0.5rem;
  text-align: left;
  white-space: nowrap;
  border-radius: 0.5rem;
  color: var(--color-fg);
  transition: all 200ms ease-in-out;
}

.context-item:hover {
  background-color: var(--color-primary-surface-hover-bg);
  color: var(--color-primary-surface-hover-fg);
}
</style>
