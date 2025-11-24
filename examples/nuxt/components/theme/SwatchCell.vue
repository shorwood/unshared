<script setup lang="ts">
import type { Color } from '../../../../packages/color/createColor'

interface Props {
  stateName: string
  stateColor?: Color
  contrastColor?: Color
  borderColor?: Color
  borderContrast?: Color
  roleName: string
}

const props = defineProps<Props>()
</script>

<template>
  <div
    v-if="stateColor && contrastColor && borderColor"
    class="relative h-20 rounded overflow-hidden group cursor-pointer"
    :title="`${roleName} ${stateName}`"
    :style="{ 
      backgroundColor: stateColor.hex(),
      borderWidth: '2px',
      borderStyle: 'solid',
      borderColor: borderColor.hex()
    }"
  >
    <!-- Label text using contrast color -->
    <div
      class="absolute inset-0 flex flex-col items-center justify-center text-center px-1"
      :style="{ color: contrastColor.hex() }"
    >
      <span class="text-[11px] font-semibold tracking-wide capitalize">{{ stateName }}</span>
      <span class="text-[10px] font-mono opacity-80">{{ stateColor.hex() }}</span>
    </div>

    <!-- Contrast preview box bottom-right -->
    <div
      class="absolute bottom-1 right-1 w-7 h-7 rounded flex items-center justify-center"
      :style="{ 
        backgroundColor: contrastColor.hex(),
      }"
    >
      <span class="text-[9px] font-bold" :style="{ color: stateColor.hex() }">Aa</span>
    </div>
    
    <!-- Hover overlay: show both colors full info -->
    <div class="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-1">
      <div class="text-[10px] font-mono text-white">FG: {{ contrastColor.hex() }}</div>
      <div class="text-[10px] font-mono text-white">BG: {{ stateColor.hex() }}</div>
      <div class="text-[10px] font-mono text-white">Border: {{ borderColor.hex() }}</div>
    </div>
  </div>
</template>
