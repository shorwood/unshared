import type { Component } from 'vue'
import { resolveComponent } from 'vue'

/** The resolved component type. */
export type ResolvedComponent<K extends string> = K extends keyof HTMLElementTagNameMap ? K : Component | string

/**
 * Dynamically resolves to a globally registered Vue component or an HTML tag.
 *
 * @param type The tag or component name to resolve.
 * @returns The locally registered component or tag name.
 * @example
 * // Resolves to a globally registered component.
 * resolveComponentType('MyComponent') // => MyComponent
 *
 * // Resolves to an HTML tag.
 * resolveComponentType('div') // => 'div'
 */
export function resolveComponentType<K extends string = string>(type: K): ResolvedComponent<K>
export function resolveComponentType(type: string): Component | string {
  return /^[A-Z]/.test(type) ? resolveComponent(type) : type
}
