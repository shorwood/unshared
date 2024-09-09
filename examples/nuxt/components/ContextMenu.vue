<script setup lang="ts">
import { BaseMenu } from '@unshared/vue/BaseMenu'
</script>

<template>
  <BaseMenu x="after" y="center">

    <template #default="{ isOpen, open }">
      <div @contextmenu.prevent="() => open()">
        <slot/>
      </div>
    </template>

    <template #menu="{ close, isOpen }">
      <Transition
        name="fade"
        :duration="200"
        enter-active-class="transition duration-100"
        enter-from-class="opacity-0 translate-x-1/2"
        enter-to-class="opacity-100"
        leave-active-class="transition duration-150"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0 translate-x-1/2">

        <p v-if="isOpen" class="p-4 bg-red/20">
          <button class="bg-red" @click="() => close()">Close</button>
        </p>

      </Transition>
    </template>
  </BaseMenu>
</template>
