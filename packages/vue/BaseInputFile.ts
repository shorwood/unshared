import { Prop, VNode, computed, getCurrentInstance, h, mergeProps } from 'vue'
import { BASE_STATE_OPTIONS, BaseStateOptions, useBaseState } from './useBaseState'
import { BASE_RENDERABLE_OPTIONS, BaseRenderableOptions, useBaseRenderable } from './useBaseRenderable'
import { BASE_INPUT_FILE_OPTIONS, BaseInputFileComposable, BaseInputFileOptions, useBaseInputFile } from './useBaseInputFile'
import { exposeToDevtool } from './exposeToDevtool'
import { DefineComponentContext, defineSetupComponent } from './defineSetupComponent'

/** The base props for the `BaseInputFile` component. */
export const BASE_INPUT_FILE_PROPS = {
  ...BASE_INPUT_FILE_OPTIONS,
  ...BASE_RENDERABLE_OPTIONS,
  ...BASE_STATE_OPTIONS,
} satisfies Record<keyof BaseInputFileProps, Prop<unknown>>

/** The properties of the `BaseInputFile` component. */
export interface BaseInputFileProps extends
  BaseStateOptions,
  BaseRenderableOptions,
  BaseInputFileOptions {}

/** The slot properties of the `BaseInputFile` component. */
export interface BaseInputFileSlotProps extends BaseInputFileComposable {
  loading: boolean
  error: Error | string | undefined
}

/** The slots of the `BaseInputFile` component. */
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type BaseInputFileSlots = {
  default?: (props: BaseInputFileSlotProps) => VNode
}

/** The properties of the `BaseInputFile` component. */
export const BaseInputFile = /* #__PURE__ */ defineSetupComponent(
  (props: BaseInputFileProps, { attrs, slots }: DefineComponentContext<BaseInputFileSlots>) => {
    const instance = getCurrentInstance()
    const inputFile = useBaseInputFile(props, instance)
    const renderable = useBaseRenderable(props, instance)
    const state = useBaseState(props, instance)

    // --- Build the attributes.
    const attributes = computed(() => mergeProps(
      attrs,
      state.attributes,
    ))

    // --- Slot properties.
    const slotProps = computed(() => ({
      error: state.error,
      loading: state.loading,
      model: inputFile.model,
      thumbnails: inputFile.thumbnails,
      handleDrop: inputFile.handleDrop,
      openDialog: inputFile.openDialog,
    }))

    // --- Expose properties to DevTools.
    exposeToDevtool({
      attributes,
      inputFile,
      renderable,
      state,
    })

    // --- Return virtual DOM node.
    return () => h(
      renderable.is ?? 'div',
      attributes.value,
      slots.default?.(slotProps.value),
    )
  },
  {
    name: 'BaseInputFile',
    props: BASE_INPUT_FILE_PROPS,
  },
)
