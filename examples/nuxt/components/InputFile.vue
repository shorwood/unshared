<script setup lang="ts">
import type { InputFiles } from '@unshared/vue'

const props = defineProps<{ modelValue?: InputFiles }>()
const model = useVModel(props, 'modelValue')
</script>

<template>
  <BaseInputFile
    v-slot="{ thumbnails }"
    v-model="model"
    class="input-file">

    <!-- Dashed square -->
    <div
      v-if="thumbnails.length === 0"
      class="file-dropzone">
      Drop File
    </div>

    <!-- Thumbnails -->
    <div v-else class="file-thumbnails">
      <div
        v-for="thumbnail in thumbnails"
        :key="thumbnail"
        :style="{ backgroundImage: `url(${thumbnail})` }"
        class="file-thumbnail"
      />
    </div>

  </BaseInputFile>
</template>

<style scoped>
.input-file {
  width: 100%;
  min-height: 16rem;
  padding: 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  background-color: color-mix(in srgb, var(--color-primary) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--color-primary) 40%, transparent);
  transition: all 200ms ease-in-out;
}

.input-file:hover {
  background-color: color-mix(in srgb, var(--color-primary) 20%, transparent);
}

.input-file:active {
  background-color: color-mix(in srgb, var(--color-primary) 30%, transparent);
}

.file-dropzone {
  border: 2px dashed color-mix(in srgb, var(--color-primary) 40%, transparent);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

.file-thumbnails {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.file-thumbnail {
  min-width: 33.333%;
  height: 16rem;
  flex-grow: 1;
  border-radius: 0.5rem;
  background-size: cover;
  background-position: center;
}
</style>
