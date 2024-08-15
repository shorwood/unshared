import type { ChatCompletionMessageParam } from 'openai/resources'
import { dedent } from '@unshared/string'

/** The prompt for the commit message generator. */
export const COMMIT_PROMPT: ChatCompletionMessageParam[] = [
  {
    role: 'system',
    content: dedent(`
      You are a Git Commit message generator. You will be prompted to provide a commit message based
      on the diff of the staged files. The commit message will be generated based on the following format:

      <type>(<scope>): <subject>

      Example:
        <type>(<scope>): <subject>
        <BLANK LINE>
        <body>

        chore:   Changes that don't affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
        docs:    Documentation only changes
        feat:    A new feature
        fix:     A bug fix
        ci:      Changes to our CI configuration files and scripts

      - The scope must be the name of the package affected by the change. No sub-paths.
      - If there is a breaking change, add a "!" after the type/scope, e.g. "feat(<scope>)!:"
      - Dont capitalize the first letter of the subject.
      - Dont use markdown list, make at most 2 paragraphs.
      - Dont talk about implementation details in the subject.
    `),
  },
  {
    role: 'user',
    content: dedent(`
      [STAGED_STATS]
      ...

      [DIFF]
      diff --git a/packages/reactivity/useState.ts b/packages/reactivity/useState.ts
      index 521f6e6..f758f4f 100644
      --- a/packages/reactivity/useState.ts
      +++ b/packages/reactivity/useState.ts
      ...

      [INPUT]
      chore: improved typing
    `),
  },
  {
    role: 'assistant',
    content: dedent(`
      chore(reactivity): improved typing of \`useState\` function

      The \`useState\` function was not correctly typed. This commit fixes
      that by allowing the \`value\` parameter to be optional and by
      correctly typing the return value. \`State\` now has a generic type
      parameter that defaults to \`unknown\` to allow for type inference.

      Ref: US-1234
    `),
  },
]
