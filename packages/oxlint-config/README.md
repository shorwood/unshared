# @unshared/oxlint-config

Opinionated Oxlint configuration approximating `@unshared/eslint-config`.

## Goals

- Provide a drop‑in baseline for projects migrating from ESLint to Oxlint.
- Preserve intent of the original rules where Oxlint has equivalents.
- Document gaps so teams can decide whether to keep ESLint for niche rules.

## Usage

Create `.oxlintrc.json`:

```json
{
  "extends": ["@unshared/oxlint-config"]
}
```

Or compose selectively:

```json
{
  "extends": [
    "@unshared/oxlint-config/configs/core",
    "@unshared/oxlint-config/configs/typescript"
  ]
}
```

Or programmatic:

```ts
import full from '@unshared/oxlint-config'
import { core, typescript, stylistic, all } from '@unshared/oxlint-config/configs'

// full === all()
export default full
```

Then run:

```
npx oxlint
```

## Approximation Notes

| Area | Covered | Notes |
| ---- | ------- | ----- |
| Core correctness (`no-alert`, `eqeqeq`, etc.) | Yes | Direct mapping. |
| Stylistic (spacing, indentation) | Partial | Only rules supported by Oxlint; rely on formatter for the rest. |
| TypeScript | Partial | Key safety / consistency rules included. |
| Import / export / type / member sorting | No | Perfectionist rules not implemented in Oxlint. |
| Unicorn | Partial | Select rules (e.g. filename-case, numeric-separators-style). |
| Vue SFC / template | No | Keep ESLint for Vue projects or run both. |
| SonarJS metrics | No | Complexity thresholds unsupported. |

## Unsupported Rule Families

These are intentionally omitted until Oxlint provides equivalents:
- `perfectionist/*`
  (Most `unicorn/*` rules still omitted; only a small subset enabled.)
- `vue/*`
- `sonarjs/*`
- Advanced stylistic fine‑grained rules from `@stylistic` not present in Oxlint

## Versioning

Matches the monorepo version (`0.7.4`). Bump alongside other shared tooling packages.

## License

MIT
