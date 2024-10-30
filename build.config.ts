import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: [
    {
      input: 'src/index',
      name: 'index',
      builder: 'rollup',
    },
    {
      input: 'src/index',
      name: 'index.min',
      builder: 'rollup',
    },
  ],
  declaration: true,
  clean: true,
  rollup: {
    emitCJS: true,
    inlineDependencies: true,
    esbuild: {
      target: 'es2020',
      platform: 'browser',
    },
  },
  externals: [
    'node:*',
    'jiti',
  ],
})
