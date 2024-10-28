<script setup lang="ts">
import { BaseMenu } from '@unshared/vue/BaseMenu'
</script>

<template>
  <BaseMenu x="left" y="below">

    <!-- Trigger -->
    <template #default="{ isOpen, open }">
      <div
        class="bg-blue/5 border border-blue/10 rounded-lg"
        :class="{ '!bg-blue/10': isOpen }"
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
        class="transition-all ease-in-out duration-100 bg-blue/5 border border-blue/10 rounded-lg backdrop-blur-2xl">
        <div class="flex flex-col space-y-1 p-4 w-48">
          <BaseButton
            v-for="i in 5"
            :key="i"
            class="block w-full p-2 text-left whitespace-nowrap hover:bg-blue/10 rounded-lg"
            @click="() => { close(); return 1 }">
            Item {{ i }}
          </BaseButton>
        </div>
      </BaseCollapse>
    </template>
  </BaseMenu>
</template>
