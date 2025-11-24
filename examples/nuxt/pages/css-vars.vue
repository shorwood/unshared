<script setup lang="ts">
import ThemeWrapper from '../components/theme/ThemeWrapper.vue'
import ThemePanel from '../components/theme/ThemePanel.vue'
import CssVarsDemo from '../components/theme/CssVarsDemo.vue'
</script>

<template>
  <ThemeWrapper>
    <ThemePanel />
    
    <div class="page-container">
      <CssVarsDemo />
    </div>
  </ThemeWrapper>
</template>

<style scoped>
.page-container {
  padding-top: 120px; /* Space for ThemePanel */
  min-height: 100vh;
}
</style>
