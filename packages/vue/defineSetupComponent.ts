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

export function defineSetupComponent<T extends Props, S extends Slots>(setup: DefineComponentSetup<T, S>, options?: ComponentOptions): DefineSetupFnComponent<T, [], SlotsType<S>> {
  // @ts-expect-error: The `defineComponent` function is too complex to type.
  return defineComponent(setup, options)
}
