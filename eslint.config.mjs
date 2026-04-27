// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  {
    name: 'passphrase/project-rules',
    files: [
      'app/**/*.{ts,vue}',
      'server/**/*.ts',
      'shared/**/*.ts'
    ],
    rules: {
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      'vue/multi-word-component-names': 'off'
    }
  }
)
  .prepend({
    name: 'passphrase/ignores',
    ignores: [
      '.output/**',
      '.data/**',
      'coverage/**',
      'extension/**',
      'PassphraseChromeExtension/**'
    ]
  })
  .override('nuxt/typescript/rules', {
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn'
    }
  })
