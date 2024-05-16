<script setup lang="ts">
import { EditorView, basicSetup } from 'codemirror'

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
    :extensions="[basicSetup, theme]"
    line-wrapping
    class="
     bg-secondary-900
      w-full border-primary-600/20 border rounded-md
      focus:ring-2 focus:ring-primary-600/50 p-4
    "
  />
</template>
