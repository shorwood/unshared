import { createContext } from '@unshared/functions/createContext'

export function main() {
  const contextualRandom = createContext({ value: 0 })
  const random1 = contextualRandom.value
  contextualRandom.runInContext(context => context.value = Math.random())
  const random2 = contextualRandom.value
  console.log({ random1, random2 })
}
