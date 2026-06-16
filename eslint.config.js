import antfu from '@antfu/eslint-config'

export default antfu({
  svelte: true,
  markdown: true,
  ignores: ['src/lib/**', '.wxt/**', '.output/**'],
})
