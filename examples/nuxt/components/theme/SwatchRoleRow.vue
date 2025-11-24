<script setup lang="ts">
import type { Theme } from '../../../../packages/color/createTheme'
import { computed } from 'vue'
import SwatchCell from './SwatchCell.vue'

interface Props {
  roleName: string
  roleColors: Theme.ColorRoleSet
}

const props = defineProps<Props>()

// Get role names (muted, default, surface, emphasis, interactive) dynamically from the theme
const roleNames = computed(() => Object.keys(props.roleColors))

// Get state names (default, hover, active, focus, disabled) dynamically from first role
const stateNames = computed(() => {
  const firstRole = Object.values(props.roleColors)[0]
  return firstRole ? Object.keys(firstRole) : []
})
</script>

<template>
  <div class="space-y-2">
    <h3 class="text-lg font-bold opacity-80 capitalize">{{ roleName }}</h3>
    
    <!-- Each role (intensity) level gets a row of state cells -->
    <div v-for="roleName in roleNames" :key="roleName" class="space-y-1">
      <div class="text-xs font-semibold opacity-60 capitalize">{{ roleName }}</div>
      <div class="grid gap-2" :style="{ gridTemplateColumns: `repeat(${stateNames.length}, minmax(0, 1fr))` }">
        <SwatchCell
          v-for="stateName in stateNames"
          :key="`${roleName}-${stateName}`"
          :state-name="stateName"
          :state-color="roleColors[roleName]?.[stateName]?.background"
          :contrast-color="roleColors[roleName]?.[stateName]?.foreground"
          :border-color="roleColors[roleName]?.[stateName]?.border"
          :border-contrast="roleColors[roleName]?.[stateName]?.foreground"
          :role-name="`${props.roleName} ${roleName}`"
        />
      </div>
    </div>
  </div>
</template>
