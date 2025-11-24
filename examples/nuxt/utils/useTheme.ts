import type { Theme } from '../../../packages/color/createTheme'
import { Color } from '../../../packages/color/createColor'
import { createTheme } from '../../../packages/color/createTheme'
import { computed, ref, watch } from 'vue'

export interface ThemeConfig {
  primary: string
  accent?: string
  success?: string
  warning?: string
  error?: string
  info?: string
  isDark: boolean
}

const defaultConfig: ThemeConfig = {
  primary: '#3b82f6',
  isDark: false,
}

const themeConfig = useLocalStorage<ThemeConfig>('themeConfig', { ...defaultConfig })
const lightTheme = ref<Theme>()
const darkTheme = ref<Theme>()

// Generate initial theme
function regenerateTheme() {
  const colors = {
    base: Color.fromHex(themeConfig.value.primary),
    primary: Color.fromHex(themeConfig.value.primary),
    accent: themeConfig.value.accent ? Color.fromHex(themeConfig.value.accent) : Color.fromHex(themeConfig.value.primary).complementary(),
    success: themeConfig.value.success ? Color.fromHex(themeConfig.value.success) : Color.fromHex('#10b981'),
    warning: themeConfig.value.warning ? Color.fromHex(themeConfig.value.warning) : Color.fromHex('#f59e0b'),
    error: themeConfig.value.error ? Color.fromHex(themeConfig.value.error) : Color.fromHex('#ef4444'),
    info: themeConfig.value.info ? Color.fromHex(themeConfig.value.info) : Color.fromHex('#3b82f6'),
  }
  
  lightTheme.value = createTheme({ colors, isDark: false })
  darkTheme.value = createTheme({ colors, isDark: true })
}

// Watch for config changes
watch(themeConfig, regenerateTheme, { deep: true, immediate: true })

export function useTheme() {
  const currentTheme = computed(() => {
    return themeConfig.value.isDark
      ? darkTheme.value
      : lightTheme.value
  })

  const setThemeConfig = (config: Partial<ThemeConfig>) => {
    themeConfig.value = { ...themeConfig.value, ...config }
  }

  const resetTheme = () => {
    themeConfig.value = { ...defaultConfig }
  }

  const toggleDarkMode = () => {
    themeConfig.value.isDark = !themeConfig.value.isDark
  }

  return {
    themeConfig,
    lightTheme,
    darkTheme,
    currentTheme,
    setThemeConfig,
    resetTheme,
    toggleDarkMode,
  }
}
