import { ComponentOptions, DefineSetupFnComponent, RenderFunction, SetupContext, SlotsType, VNode, defineComponent } from 'vue'
import { Function, MaybePromise } from '@unshared/types'

type Slots = Record<string, Function<VNode>>
type Props = Record<string, any>

/**
 * The context of the `DefineComponent` component.
 */
export type DefineComponentContext<S extends Slots = Slots> =
  SetupContext<string[], SlotsType<Partial<S>>>

export type DefineComponentSetup<T extends Props, S extends Slots> =
  (props: T, context: DefineComponentContext<S>) => MaybePromise<RenderFunction>

export function defineSetupComponent<
  T extends Props,
  S extends Slots,
>(setup: DefineComponentSetup<T, S>, options?: ComponentOptions): DefineSetupFnComponent<T, [], SlotsType<S>> {
  // @ts-expect-error: ignore this error.
  return defineComponent(setup, options)
}
