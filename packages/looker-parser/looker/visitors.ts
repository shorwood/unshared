import { replace } from 'node:util'
import { NodeBase, NodeDocument, NodeContainer, NodeList, NodeKV, NodeBlock } from './parserNodes'
import { NodeSyntax } from './parserSyntax'

/* Abstract base class for visitors interacting with the parse tree. */
export abstract class Visitor {
  abstract visit(document: NodeDocument): unknown
  abstract visitContainer(node: NodeContainer): unknown
  abstract visitBlock(node: NodeBlock): unknown
  abstract visitList(node: NodeList): unknown
  abstract visitPair(node: NodeKV): unknown
  abstract visitToken(token: NodeSyntax): unknown
}

/**
 * Visitor class that calls the `_visit` method for every node type.
 *
 * This class doesn't actually do anything when visiting a tree other than traverse
 * the nodes. It's meant to be used as a base class for building more useful and
 * complex visitors. For example, override any of the `visit_` methods for node-type
 * specific behavior.
 */
export class BasicVisitor implements Visitor {
  protected _visit(node: NodeBase | NodeSyntax): void {
    if (node instanceof NodeSyntax) {
      return
    }
    else if (node.children) {
      node.children.forEach((child) => {
        child.accept(this)
      })
    }
  }

  visit(document: NodeDocument): void {
    this._visit(document)
  }

  visitContainer(node: NodeContainer): void {
    this._visit(node)
  }

  visitBlock(node: NodeBlock): void {
    this._visit(node)
  }

  visitList(node: NodeList): void {
    this._visit(node)
  }

  visitPair(node: NodeKV): void {
    this._visit(node)
  }

  visitToken(token: NodeSyntax): void {
    this._visit(token)
  }
}

/**
 * Converts a parse tree into a string by casting every node.
 */
export class LookMlVisitor extends BasicVisitor {
  protected static _visit(node: NodeBase | NodeSyntax): string {
    return node.toString()
  }
}

/**
 * Visitor class that returns a new tree, modifying the tree as needed.
 */
export class BasicTransformer implements Visitor {
  protected _visitItems<T extends NodeContainer | NodeList>(node: T): T {
    if (node.children) {
      const newChildren = node.children.map(child => child.accept(this))
      return replace(node, { items: newChildren })
    }


    return node
  }

  protected _visitContainer<T extends NodeBlock | NodeDocument>(node: T): T {
    if (node.container) {
      const newChild = node.container.accept(this)
      return replace(node, { container: newChild })
    }
    else {
      return node
    }
  }

  visit(node: NodeDocument): NodeDocument {}

  visitContainer(node: NodeContainer): NodeContainer {
    return this._visitItems(node)
  }

  visitList(node: NodeList): NodeList {
    return this._visitItems(node)
  }

  visitBlock(node: NodeBlock): NodeBlock {
    return this._visitContainer(node)
  }

  visitPair(node: NodeKV): NodeKV {
    return node
  }

  visitToken(token: NodeSyntax): NodeSyntax {
    return token
  }
}
