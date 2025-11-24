<script setup lang="ts">
import type { Color } from '../../../../packages/color/createColor'

interface Props {
  stateName: string
  stateColor: Color
  contrastColor: Color
  borderColor: Color
  roleName: string
}

const props = defineProps<Props>()
</script>

<template>
  <div
    class="h-10 rounded flex items-center justify-center text-xs font-semibold transition-transform hover:scale-105 cursor-pointer"
    :style="{ 
      backgroundColor: stateColor?.hex,
      color: contrastColor?.hex,
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: borderColor?.hex
    }"
    :title="`${roleName} Button ${stateName}`"
  >
    Button
  </div>
</template>

<style scoped>
* {
  transition-property: background-color, color, transform, opacity;
  transition-duration: 200ms;
  transition-timing-function: ease-in-out;
}
</style>
