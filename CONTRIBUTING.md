# Contributing

Thanks for being interested in contributing to this project!

## Development 

### Setup

Clone this repo to your local machine and install the dependencies.

```bash
pnpm install
```

## Contributing

### Existing functions

Feel free to enhance the existing functions. Please try not to introduce breaking changes.

### New functions

To keep the package organized, please follow these guidelines when adding new functions.

- Before you start working, it's better to open an issue to discuss first.
- Do **NOT** to introduce any production dependencies.
- The implementation should be placed under `packages/<module>/<name>.ts`.
- The function(s) should be exported from the `index.ts` file under the module folder.
- The function name should be in `camelCase` and descriptive.
- The function should be pure, meaning it should not have side effects.
- Provide TSDoc documentation for **every exported** functions, types and interfaces.

### New modules

New modules are greatly welcome!

- Create a new folder under `packages/`, name it as your add-on name. 
- Create the entry point `index.ts` under `packages/<name>/`.
- Add functions as you would do to the core package.
- Commit and submit as a PR.

## Code Style

Lint is used to enforce the code style. Please run the linter before submitting a PR. Additionally, try to follow the code style of the existing codebase as much as possible. However it is not a strict requirement, as long as the code is readable and maintainable.

## Thanks

Thank you again for being interested in this project! You are awesome!
