/* eslint-disable @typescript-eslint/consistent-type-imports */
import { markdown } from '@codemirror/lang-markdown'
import { EditorState, EditorStateConfig } from '@codemirror/state'
import { oneDark } from '@codemirror/theme-one-dark'
import { EditorView, EditorViewConfig } from '@codemirror/view'
import { compact, isBrowser, pick } from '@hsjm/shared'
import { useVModel } from '@vueuse/core'
import { tryOnMounted, tryOnUnmounted } from '@vueuse/shared'
import { basicSetup } from 'codemirror'
import { PropType, defineComponent, h, mergeProps, ref, watch } from 'vue-demi'
import { exposeToDevtool } from '../utils'

export default defineComponent({
  name: 'Editor',
  inheritAttrs: false,
  props: {
    modelValue: { type: String, default: '' },
    extensions: Object as PropType<EditorViewConfig['extensions']>,
    state: Object as PropType<EditorStateConfig>,
  },
  emit: [
    'emit',
    'blur',
    'onUpdate:modelValue',
  ],
  setup(props, { attrs, emit }) {
    const modelValue = useVModel(props, 'modelValue', emit, { passive: true })
    const editor = ref<HTMLDivElement>()
    const view = ref<EditorView>()
    const state = ref<EditorState>()
    const extensions = ref<EditorStateConfig['extensions']>()

    const createExtensions = () => extensions.value = compact([
      basicSetup,
      oneDark,
      markdown({}),
      EditorView.lineWrapping,
      EditorView.updateListener.of((viewUpdate) => {
        if (viewUpdate.docChanged) modelValue.value = viewUpdate.state.doc.toString()
        if (viewUpdate.focusChanged) emit(viewUpdate.view.hasFocus ? 'focus' : 'blur', viewUpdate)
      }),
    ])

    const createState = () => state.value = EditorState.create({
      doc: modelValue.value,
      extensions: createExtensions(),
      ...props.state,
    })

    // --- Declare function to instantiate the view.
    const createEditor = () => {
      if (!editor.value) return
      view.value = new EditorView({
        parent: editor.value,
        state: createState(),
      })
    }

    // --- Expose the contentMarkdown to the devtool.
    exposeToDevtool({
      modelValue,
      editor,
      state,
      view,
    })

    // --- Watch for external changes to the modelValue.
    watch(modelValue, (value, oldValue) => {
      if (value === oldValue) return
      if (view.value && !view.value?.hasFocus) {
        view.value.dispatch({
          changes: {
            from: 0,
            to: view.value.state.doc.length,
            insert: value,
          },
        })
      }
    })

    // --- Declare lifecycle.
    if (isBrowser()) {
      tryOnMounted(() => createEditor(), false)
      tryOnUnmounted(() => view.value?.destroy())
    }

    // --- Render the editor.
    return () => h('div', mergeProps(
      pick(attrs, ['class', 'style']),
      {
        tabindex: -1,
        ref: editor,
        onFocus: () => view.value?.focus(),
        style: { cursor: 'text' },
      },
    ))
  },
})
