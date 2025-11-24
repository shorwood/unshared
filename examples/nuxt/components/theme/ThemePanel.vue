<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTheme } from '../../utils/useTheme'

const { themeConfig, resetTheme, toggleDarkMode, currentTheme } = useTheme()

const isExpanded = ref(false)

// Color presets
const colorPresets = [
  { name: 'Blue', color: '#3b82f6' },
  { name: 'Purple', color: '#8b5cf6' },
  { name: 'Green', color: '#10b981' },
  { name: 'Orange', color: '#f97316' },
  { name: 'Red', color: '#ef4444' },
  { name: 'Pink', color: '#ec4899' },
  { name: 'Cyan', color: '#06b6d4' },
  { name: 'Indigo', color: '#6366f1' },
]

// Get current theme colors for preview
const baseColor = computed(() => {
  const base = currentTheme.value?.colors?.base
  if (!base) return '#808080'
  const firstRole = Object.values(base)[0]
  if (!firstRole) return '#808080'
  const defaultState = firstRole['default']
  return defaultState?.background.hex().slice(0, 7) ?? '#808080'
})

const primaryColor = computed(() => {
  const primary = currentTheme.value?.colors?.primary
  if (!primary) return '#3b82f6'
  const firstRole = Object.values(primary)[0]
  if (!firstRole) return '#3b82f6'
  const defaultState = firstRole['default']
  return defaultState?.background.hex().slice(0, 7) ?? '#3b82f6'
})

const accentColor = computed(() => {
  const accent = currentTheme.value?.colors?.accent
  if (!accent) return '#8b5cf6'
  const firstRole = Object.values(accent)[0]
  if (!firstRole) return '#8b5cf6'
  const defaultState = firstRole['default']
  return defaultState?.background.hex().slice(0, 7) ?? '#8b5cf6'
})
</script>

<template>
  <div class="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm border-b border-white/10">
    <div class="max-w-7xl mx-auto px-4 py-3">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-4">
          <h2 class="text-lg font-bold text-white">🎨 Theme Designer</h2>
          <!-- Color Preview -->
          <div class="flex items-center gap-2">
            <div class="w-8 h-8 rd b border-white/20" :style="{ backgroundColor: baseColor }" title="Base" />
            <div class="w-8 h-8 rd b border-white/20" :style="{ backgroundColor: primaryColor }" title="Primary" />
            <div class="w-8 h-8 rd b border-white/20" :style="{ backgroundColor: accentColor }" title="Accent" />
          </div>
          <!-- Dark Mode Toggle -->
          <button
            class="px-4 py-2 rounded bg-white/10 hover:bg-white/20 text-sm font-medium text-white"
            @click="toggleDarkMode"
          >
            {{ themeConfig.isDark ? '🌙 Dark' : '☀️ Light' }}
          </button>
        </div>
        <div class="flex items-center gap-2">
          <button
            class="px-4 py-2 rounded bg-white/10 hover:bg-white/20 text-sm font-medium text-white"
            @click="resetTheme"
          >Reset</button>
          <button
            class="px-4 py-2 rounded bg-white/10 hover:bg-white/20 text-sm font-medium text-white"
            @click="isExpanded = !isExpanded"
          >{{ isExpanded ? 'Hide' : 'Configure' }}</button>
        </div>
      </div>

      <!-- Expanded Configuration -->
      <div v-if="isExpanded" class="mt-4 pt-4 border-t border-white/10 space-y-6">
        <!-- Primary Color -->
        <div>
          <label class="block text-sm font-medium text-white/80 mb-2">Primary Color</label>
          <div class="flex gap-2 flex-wrap">
            <button
              v-for="preset in colorPresets"
              :key="preset.name"
              class="px-4 py-2 rounded border-2 hover:scale-105"
              :class="themeConfig.primary === preset.color ? 'border-white' : 'border-white/20'"
              :style="{ backgroundColor: preset.color }"
              @click="themeConfig.primary = preset.color"
            >
              <span class="text-white text-xs font-medium drop-shadow">{{ preset.name }}</span>
            </button>
            <input v-model="themeConfig.primary" type="color" class="w-20 h-10 rounded cursor-pointer border-2 border-white/20" />
          </div>
        </div>
        <!-- Accent Color -->
        <div>
          <label class="block text-sm font-medium text-white/80 mb-2">Accent Color (optional)</label>
          <div class="flex gap-2 items-center">
            <input v-model="themeConfig.accent" type="color" class="w-20 h-10 rounded cursor-pointer border-2 border-white/20" />
            <button
              v-if="themeConfig.accent"
              class="px-3 py-2 text-xs rounded bg-white/10 hover:bg-white/20 text-white"
              @click="themeConfig.accent = undefined"
            >Clear</button>
          </div>
        </div>
        <!-- Other Semantic Colors -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-white/80 mb-2">Success Color (optional)</label>
            <input v-model="themeConfig.success" type="color" class="w-20 h-10 rounded cursor-pointer border-2 border-white/20" />
          </div>
          <div>
            <label class="block text-sm font-medium text-white/80 mb-2">Warning Color (optional)</label>
            <input v-model="themeConfig.warning" type="color" class="w-20 h-10 rounded cursor-pointer border-2 border-white/20" />
          </div>
          <div>
            <label class="block text-sm font-medium text-white/80 mb-2">Error Color (optional)</label>
            <input v-model="themeConfig.error" type="color" class="w-20 h-10 rounded cursor-pointer border-2 border-white/20" />
          </div>
          <div>
            <label class="block text-sm font-medium text-white/80 mb-2">Info Color (optional)</label>
            <input v-model="themeConfig.info" type="color" class="w-20 h-10 rounded cursor-pointer border-2 border-white/20" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
