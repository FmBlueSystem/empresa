module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
      jsxRuntime: 'automatic', // Add this line
    },
    ecmaVersion: 12,
    sourceType: 'module',
    requireConfigFile: false,
    babelOptions: {
      presets: ['@babel/preset-react'],
    },
  },
  plugins: [
    'react',
    'react-hooks',
  ],
  rules: {
    // Add any specific rules or overrides here
    'no-unused-vars': 'warn', // Change unused vars to warning
    'no-console': 'warn', // Change console logs to warning
    'react/prop-types': 'off', // Disable prop-types for now
    'no-restricted-globals': ['error', 'event', 'fdescribe'], // Restrict some globals, allow others
    'no-undef': 'warn', // Change no-undef to warning
    'import/first': 'off', // Disable import/first for now
    'react/jsx-uses-react': 'off', // Disable for React 17+ JSX transform
    'react/react-in-jsx-scope': 'off', // Disable for React 17+ JSX transform
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  ignorePatterns: ['dist/'], // Ignore the dist directory
  globals: {
    gtag: 'readonly',
    self: 'writable',
    confirm: 'writable',
    MSApp: 'writable',
    WorkerGlobalScope: 'writable',
    vi: 'writable', // For Vitest
  },
};