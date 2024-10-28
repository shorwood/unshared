<script setup lang="ts">
import type { InputFiles } from '@unshared/vue'

const props = defineProps<{ modelValue?: InputFiles }>()
const model = useVModel(props, 'modelValue')
</script>

<template>
  <BaseInputFile
    v-slot="{ thumbnails }"
    v-model="model"
    class="
      w-full min-h-64 p-4 rounded-lg cursor-pointer
      bg-primary-600/10 hover:bg-primary-600/20 active:bg-primary-600/30
      border border-primary-600/40
      transition-all duration-200 ease-in-out
    ">

    <!-- Dashed square -->
    <div
      v-if="thumbnails.length === 0"
      class="border-dashed border-2 border-primary-600/40 rounded-lg flex items-center justify-center h-full">
      Drop File
    </div>

    <!-- Thumbnails -->
    <div v-else class="flex flex-wrap gap-4">
      <div
        v-for="thumbnail in thumbnails"
        :key="thumbnail"
        :style="{ backgroundImage: `url(${thumbnail})` }"
        class="min-w-1/3 h-64 grow rounded-lg bg-cover bg-center"
      />
    </div>

  </BaseInputFile>
</template>
