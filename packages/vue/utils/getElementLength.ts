/**
 * Return the text length of a node. If the node is a text node, return the
 * length of the text. If the node is a <br> element, return 1. Otherwise,
 * return the length of the text content of the node.
 *
 * @param node The node to get the length of.
 * @returns The length of the node.
 * @example const length = getElementLength(node) // 5
 */
export function getElementLength(node: Node): number {
  if (node.nodeName === 'BR') return 1
  if (node.nodeType === Node.TEXT_NODE) return (node as Text).length
  return (node as HTMLElement).textContent?.length ?? 0
}
