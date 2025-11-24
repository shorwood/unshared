<script setup lang="ts">
import { basicSetup, EditorView } from 'codemirror'

const props = defineProps<{
  id?: string
  label?: string
  modelValue?: string
}>()

const theme = EditorView.theme(
  {
    '&': {
      backgroundColor: secondary[900],
      color: primary[50],
      fontSize: '14px',
      fontFamily: 'Fira Code, monospace',
    },
    '.cm-content': {
      caretColor: primary[300],
    },
    '.cm-cursor, .cm-dropCursor': {
      borderLeftColor: primary[500],
    },
    '&.cm-focused .cm-selectionBackgroundm .cm-selectionBackground, .cm-content ::selection': {
      backgroundColor: primary[600],
    },
    '.cm-activeLine': {
      backgroundColor: `${primary[600]}40`,
      transition: 'background-color 0.05s',
    },
    '.cm-gutters': {
      backgroundColor: secondary[900],
      color: `${primary[50]}40`,
      border: 'none',
    },
    '.cm-activeLineGutter': {
      backgroundColor: 'transparent',
    },
  },
  {
    dark: true,
  },
)

const model = useVModel(props, 'modelValue', undefined, { passive: true })
</script>

<template>
  <BaseInputEditor
    v-model="model"
    line-wrapping
    :extensions="[basicSetup, theme]"
    class="input-editor"
  />
</template>

<style scoped>
.input-editor {
  background-color: var(--color-base-surface-bg);
  color: var(--color-base-surface-fg);
  width: 100%;
  border: 1px solid var(--color-base-muted-border);
  border-radius: 0.375rem;
  padding: 1rem;
  transition: all 200ms ease-in-out;
}

.input-editor:hover {
  border-color: var(--color-primary-muted-hover-border);
}

.input-editor:focus {
  outline: 2px solid var(--color-primary-interactive-focus-border);
  outline-offset: 2px;
  border-color: var(--color-primary-interactive-border);
}
</style>
