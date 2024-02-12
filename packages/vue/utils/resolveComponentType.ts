import { Component, resolveComponent } from 'vue-demi'

/**
 * Dynamically resolves to a globally registered component or an HTML tag.
 *
 * @param type The type to resolve
 * @returns The resolved type
 */
export function resolveComponentType<T extends Component, K extends string = string>(type: K): K extends keyof HTMLElementTagNameMap ? K : K | T
export function resolveComponentType<T extends Component, K extends string = string>(type: K): K extends keyof HTMLElementTagNameMap ? K : K | T
export function resolveComponentType<T extends Component, K extends string = string>(type: K): K extends keyof HTMLElementTagNameMap ? K : K | T {
  return /^[A-Z]/.test(type)
    ? resolveComponent(type) as T
    : type
}
