# Contributing

Thanks for being interested in contributing to this project!

## Development 

### Setup

Clone this repo to your local machine and install the dependencies.

```bash
pnpm install
```

<!-- We use Vitepress for rapid development and documenting. You can start it locally by

```bash
pnpm dev
``` -->

## Contributing

### Existing functions

Feel free to enhance the existing functions. Please try not to introduce breaking changes.

### New functions

To keep the package organized, please follow these guidelines when adding new functions.

- Before you start working, it's better to open an issue to discuss first.
- The implementation should be placed under `src/[module]/`.
- Do **NOT** to introduce any production dependencies.
- Provide TSDoc documentation for **every exported** functions, types and interfaces.

### New modules

New modules are greatly welcome!

- Create a new folder under `src/`, name it as your add-on name. 
- Create the entry point `index.ts` under `src/[module]/`.
- Add functions as you would do to the core package.
- Commit and submit as a PR.

## Code Style

Don't worry about the code style as long as you install the dev dependencies. Git hooks will format and fix them for you on committing.

## Thanks

Thank you again for being interested in this project! You are awesome!