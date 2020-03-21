module.exports = {
  parser: 'babel-eslint',
  extends: ['airbnb', 'plugin:jest/recommended', 'plugin:prettier/recommended'],
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  rules: {
    'comma-dangle': ['error', 'only-multiline'],
    'jsx-a11y/anchor-is-valid': 'off',
    'react/jsx-filename-extension': [
      1,
      {
        extensions: ['.js', '.jsx'],
      },
    ],
    'react/sort-prop-types': 'error',
    'sort-keys': 'warn',
  },
};
