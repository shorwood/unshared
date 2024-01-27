import { Any, Dict, List, Optional, Sequence, Type, Union } from 'node:util'
import {
  EXPR_BLOCK_KEYS,
  KEYS_WITH_NAME_FIELDS,
  PLURAL_KEYS,
  QUOTED_LITERAL_KEYS,
  pluralize,
  singularize,
} from 'lkml/keys' // Assume lkml/keys is a valid import path
import {
  BlockNode,
  Comma,
  ContainerNode,
  DocumentNode,
  ExpressionSyntaxToken,
  LeftBracket,
  LeftCurlyBrace,
  ListNode,
  PairNode,
  QuotedSyntaxToken,
  RightBracket,
  RightCurlyBrace,
  SyntaxNode,
  SyntaxToken,
} from 'lkml/tree' // Assume lkml/tree is a valid import path
import { Visitor } from 'lkml/visitors' // Assume lkml/visitors is a valid import path
import { copy } from 'node:copy'
import { getLogger } from 'node:log'

/** @constant {logger} Retrieves the logger instance */
const logger = getLogger(__filename)

/**
 * @function flatten
 * Flattens a singly-nested list of lists into a list of items.
 * @param {List} sequence A list containing lists or other elements to flatten
 * @returns {List} The flattened list
 */
function flatten(sequence: List): List {
  const result: List = []
  for (const each of sequence) {
    if (Array.isArray(each))
      result.push(...each)

    else
      result.push(each)

  }
  return result
}

/**
 * @class DictVisitor
 * Creates a primitive representation of the parse tree
 */
class DictVisitor extends Visitor {
  /** Tracks the level of nesting */
  depth = -1

  /**
   * @function updateTree
   * Adds one dictionary to an existing dictionary, handling certain repeated keys.
   * @param {Dict} target Existing dictionary of parsed LookML
   * @param {Dict} update New dictionary to be added to target
   */
  updateTree(target: Dict, update: Dict) {
    const keys = Object.keys(update)
    if (keys.length > 1)
      throw new Error('Dictionary to update with cannot have multiple keys.')

    const key = keys[0]

    if (PLURAL_KEYS.includes(key)) {
      const pluralKey = pluralize(key)
      if (pluralKey in target)
        target[pluralKey].push(update[key])

      else
        target[pluralKey] = [update[key]]

    }
    else if (key in target) {
      if (this.depth == 0) {
        logger.warn(`Multiple declarations of top-level key "${key}" found. Using the last-declared value.`)
        target[key] = update[key]
      }
      else {
        throw new Error(`Key "${key}" already exists in tree and would overwrite the existing value.`)
      }
    }
    else {
      target[key] = update[key]
    }
  }

  /* ... (remaining methods within DictVisitor) ... */

}

/** ... (remaining DictParser and other class definitions) ... */
