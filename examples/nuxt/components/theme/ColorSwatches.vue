<script setup lang="ts">
import { computed } from 'vue'
import { useTheme } from '../../utils/useTheme'
import SwatchRoleRow from './SwatchRoleRow.vue'

const { currentTheme } = useTheme()

// Get color names dynamically from the theme
const colorNames = computed(() => {
  if (!currentTheme.value) return []
  return Object.keys(currentTheme.value.colors)
})
</script>

<template>
  <div class="space-y-8">
    <!-- Role rows showing variant states with contrast preview -->
    <div class="space-y-4">
      <SwatchRoleRow
        v-for="colorName in colorNames"
        :key="colorName"
        :role-name="colorName"
        :role-colors="currentTheme?.colors[colorName]!"
      />
    </div>

    <!-- Color Statistics -->
    <div class="space-y-2 border-t border-white/10 pt-6">
      <h3 class="text-lg font-bold opacity-80">
        Theme Statistics
      </h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
        <div class="space-y-1">
          <p class="text-xs opacity-60">
            Semantic Colors
          </p>
          <p class="text-2xl font-bold">
            {{ colorNames.length }}
          </p>
        </div>
        <div class="space-y-1">
          <p class="text-xs opacity-60">
            Roles per Color
          </p>
          <p class="text-2xl font-bold">
            {{ currentTheme ? Object.keys(Object.values(currentTheme.colors)[0] || {}).length : 0 }}
          </p>
        </div>
        <div class="space-y-1">
          <p class="text-xs opacity-60">
            States per Role
          </p>
          <p class="text-2xl font-bold">
            {{ currentTheme ? Object.keys(Object.values(Object.values(currentTheme.colors)[0] || {})[0] || {}).length : 0 }}
          </p>
        </div>
        <div class="space-y-1">
          <p class="text-xs opacity-60">
            Targets per State
          </p>
          <p class="text-2xl font-bold">
            4
          </p>
          <p class="text-xs opacity-50">
            (background, foreground, border, muted)
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

