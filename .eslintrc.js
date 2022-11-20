module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true,
    jasmine: true,
  },
  ignorePatterns: ['**/swagger/**', '.eslintrc.js', '*.mock.ts', '**/polyfills.ts'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.json'],
    sourceType: 'module',
  },
  plugins: [
    '@angular-eslint/eslint-plugin',
    'eslint-plugin-rxjs',
    'eslint-plugin-import',
    '@typescript-eslint',
    'unused-imports',
    'rxjs-angular',
    'etc',
    'jasmine',
  ],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:etc/recommended',
    'plugin:jasmine/recommended',
    'plugin:rxjs/recommended',
  ],
  rules: {
    'no-empty-pattern': 'error',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
    '@typescript-eslint/explicit-function-return-type': ['error'],
    '@typescript-eslint/member-delimiter-style': 'error',
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'classProperty',
        modifiers: ['static', 'readonly'],
        format: ['UPPER_CASE'],
      },
    ],
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'error',
    'no-unused-expressions': 'off',
    '@typescript-eslint/no-unused-expressions': [
      'error',
      {
        allowTernary: true,
      },
    ],
    '@typescript-eslint/prefer-for-of': 'error',
    '@typescript-eslint/prefer-function-type': 'error',
    quotes: 'off',
    '@typescript-eslint/quotes': [
      'error',
      'single',
      {
        avoidEscape: true,
      },
    ],
    semi: 'off',
    '@typescript-eslint/semi': ['error'],
    '@typescript-eslint/type-annotation-spacing': 'error',
    '@typescript-eslint/unbound-method': 'error',
    '@typescript-eslint/unified-signatures': 'error',
    'arrow-body-style': 'error',
    'constructor-super': 'error',
    curly: 'error',
    eqeqeq: ['error', 'smart'],
    'guard-for-in': 'error',
    'import/no-deprecated': 'error',
    'max-classes-per-file': ['error', 1],
    'no-bitwise': 'error',
    'no-caller': 'error',
    'no-cond-assign': 'error',
    'no-console': 'error',
    'no-debugger': 'error',
    'no-eval': 'error',
    'no-new-wrappers': 'error',
    'no-sparse-arrays': 'error',
    'no-throw-literal': 'error',
    'no-undef-init': 'error',
    'no-unused-labels': 'error',
    'no-var': 'error',
    'prefer-const': 'error',
    'prefer-object-spread': 'error',
    radix: 'error',
    'rxjs/finnish': [
      'error',
      {
        functions: true,
        methods: true,
        parameters: false,
        properties: false,
        variables: true,
        types: {
          Geometry: false,
          Map: false,
          Feature: false,
          BaseLayer: false,
          Draw: false,
          Snap: false,
          Overlay: false,
          VectorSource: false,
          Collection: false,
          DoubleClickZoom: false,
          VectorTile: false,
        },
      },
    ],
    'rxjs/no-implicit-any-catch': 'off',
    'rxjs/no-internal': 'error',
    'rxjs/no-unsafe-catch': 'error',
    'rxjs/no-unsafe-switchmap': 'error',
    'rxjs/no-exposed-subjects': 'error',
    'rxjs-angular/prefer-takeuntil': [
      'error',
      {
        checkComplete: true,
        checkDecorators: ['Component'],
        checkDestroy: true,
      },
    ],
    'spaced-comment': [
      'error',
      'always',
      {
        markers: ['/'],
      },
    ],
    'unused-imports/no-unused-imports': 'error',
  },
  overrides: [
    {
      files: ['*.spec.ts'],
      rules: {
        '@typescript-eslint/unbound-method': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/naming-convention': 'off',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        'jasmine/no-disabled-tests': 'off',
        'jasmine/no-spec-dupes': 'off',
        'jasmine/no-unsafe-spy': 'off',
        'jasmine/prefer-toHaveBeenCalledWith': 'off',
      },
    },
    {
      files: ['*.ts'],
      extends: ['plugin:@angular-eslint/recommended'],
      rules: {
        '@angular-eslint/component-selector': [
          'error',
          {
            type: 'element',
            prefix: 'dsov',
            style: 'kebab-case',
          },
        ],
        '@angular-eslint/directive-selector': [
          'error',
          {
            type: 'attribute',
            prefix: 'dsov',
            style: 'camelCase',
          },
        ],
        '@angular-eslint/use-component-view-encapsulation': 'error',
        '@angular-eslint/use-lifecycle-interface': 'error',
      },
    },
    {
      files: ['*.component.html'],
      extends: ['plugin:@angular-eslint/template/recommended'],
      rules: {
        '@angular-eslint/template/use-track-by-function': 'error',
        // Turned off type-aware rules
        // see: https://stackoverflow.com/questions/63361645/eslint-error-when-trying-to-lint-angular-templates
        '@typescript-eslint/naming-convention': 'off',
        '@typescript-eslint/unbound-method': 'off',
        'rxjs/finnish': 'off',
        'rxjs/no-unsafe-catch': 'off',
        'rxjs/no-unsafe-switchmap': 'off',
        'rxjs/no-exposed-subjects': 'off',
        'rxjs-angular/prefer-takeuntil': 'off',
        'rxjs/no-async-subscribe': 'off',
        'rxjs/no-create': 'off',
        'rxjs/no-ignored-notifier': 'off',
        'rxjs/no-implicit-any-catch': 'off',
        'rxjs/no-nested-subscribe': 'off',
        'rxjs/no-redundant-notify': 'off',
        'rxjs/no-subject-unsubscribe': 'off',
        'rxjs/no-subject-value': 'off',
        'rxjs/no-unbound-methods': 'off',
        'rxjs/no-unsafe-subject-next': 'off',
        'rxjs/no-unsafe-takeuntil': 'off',
        'etc/no-assign-mutated-array': 'off',
        'etc/no-deprecated': 'off',
        'etc/no-implicit-any-catch': 'off',
        'etc/no-internal': 'off',
        'import/no-deprecated': 'off',
        'spaced-comment': ['error', 'never'],
      },
    },
  ],
};
