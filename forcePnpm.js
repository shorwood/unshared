if (!process.env.npm_config_user_agent?.startsWith('pnpm'))
  throw new Error('Please use pnpm to manage dependencies in this repository.\n  $ npm i pnpm -g\n')
