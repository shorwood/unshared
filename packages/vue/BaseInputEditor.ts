/* oxlint-disable @typescript-eslint/consistent-type-imports */
import { type Extension } from '@codemirror/state'
import { useVModel } from '@vueuse/core'
import { EditorView, minimalSetup } from 'codemirror'
import { computed, h, mergeProps, onMounted, onScopeDispose, Prop, ref, watch } from 'vue'
import { DefineComponentContext, defineSetupComponent } from './defineSetupComponent'
import { exposeToDevtool } from './exposeToDevtool'

export const BASE_INPUT_EDITOR_OPTIONS = {
  modelValue: String,
  extensions: Object,
  readonly: Boolean,
  lineWrapping: Boolean,
} satisfies Record<keyof Props, Prop<unknown>>

export interface Props {

  /**
   * The current content of the editor. This can be any kind of text content
   * such as Markdown, code, or plain text.
   *
   * @default ''
   */
  modelValue?: string

  /**
   * The extensions to use when creating the editor view. This can be used to
   * add custom keybindings, syntax highlighting, and other features.
   *
   * @default []
   */
  extensions?: Extension

  /**
   * Controls whether the editor is read-only or not. When set to `true`, the
   * editor will not be editable by the user. Since this can only be changed at
   * initialization, changes to this prop will not be reflected.
   *
   * @default false
   */
  readonly?: boolean

  /**
   * Enable line wrapping in the editor. When set to `true`, the editor will
   * wrap long lines to fit within the visible area. Since this can only be
   * changed at initialization, changes to this prop will not be reflected.
   *
   * @default false
   */
  lineWrapping?: boolean
}

export const BaseInputEditor = /* #__PURE__ */ defineSetupComponent(
  (props: Props, { attrs, emit }: DefineComponentContext) => {

    // --- Declare reactive properties.
    const modelValue = useVModel(props, 'modelValue', emit, { passive: true, defaultValue: '...' })
    const container = ref<HTMLDivElement>()
    const view = ref<EditorView>()

    const createExtensions = () => [
      props.extensions ?? [],
      minimalSetup,
      props.lineWrapping ? EditorView.lineWrapping : [],
      EditorView.editable.of(!props.readonly),
      EditorView.cspNonce.of('nonce'),
      EditorView.updateListener.of((viewUpdate) => {
        if (viewUpdate.docChanged) modelValue.value = viewUpdate.state.doc.toString()
        if (viewUpdate.focusChanged) emit(viewUpdate.view.hasFocus ? 'focus' : 'blur', viewUpdate)
      }),
    ]

    // --- Declare function to instantiate the view.
    const createEditor = () => {
      if (!container.value) return
      view.value = new EditorView({
        doc: modelValue.value,
        parent: container.value,
        extensions: createExtensions(),
      })
    }

    // --- Expose the relevant properties to the Vue Devtools.
    exposeToDevtool({
      modelValue,
      container,
      view,
    })

    // --- Watch for external changes to the modelValue. If the view is not
    // --- focused, update the view with the new content from the model.
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
    onMounted(() => createEditor())
    onScopeDispose(() => view.value?.destroy())

    // --- Compute attributes.
    const attributes = computed(() => mergeProps(
      attrs,
      {
        tabindex: -1,
        ref: container,
        onFocus: () => view.value?.focus(),
      },
    ))

    // --- Render the editor.
    return () => h('div', attributes.value)
  },
  {
    name: 'BaseInputEditor',
    props: BASE_INPUT_EDITOR_OPTIONS,
    inheritAttrs: false,
  },
)
