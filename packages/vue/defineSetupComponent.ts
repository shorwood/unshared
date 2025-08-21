import type { Function, MaybePromise } from '@unshared/types'
import type { ComponentOptions, DefineSetupFnComponent, RenderFunction, SetupContext, SlotsType, VNode } from 'vue'
import { defineComponent } from 'vue'

type Slots = Record<string, Function<VNode>>
type Props = Record<string, any>

/** The context of the `DefineComponent` component. */
export type DefineComponentContext<S extends Slots = Slots> =
  SetupContext<string[], SlotsType<Partial<S>>>

/** The setup function of the `DefineComponent` component. */
export type DefineComponentSetup<T extends Props, S extends Slots> =
  (props: T, context: DefineComponentContext<S>) => MaybePromise<RenderFunction>

/**
 * Wrapper utility to define a strongly typed Vue component. It ensures that the setup function
 * receives the correct props and context types, and returns a render function.
 *
 * @param setup The setup function that defines the component's logic.
 * @param options Optional component options, such as name and props.
 * @returns A strongly typed Vue component.
 */
export function defineSetupComponent<T extends Props, S extends Slots>(setup: DefineComponentSetup<T, S>, options?: ComponentOptions): DefineSetupFnComponent<T, [], SlotsType<S>> {
  // @ts-expect-error: The `defineComponent` function is too complex to type.
  return defineComponent(setup, options)
}
