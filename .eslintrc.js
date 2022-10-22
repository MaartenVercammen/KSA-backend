module.exports = {
  extends: ['airbnb-base', 'airbnb-typescript/base'],
  parser: '@typescript-eslint/parser',
  env: {
    node: true,
    es2022: true,
  },
  parserOptions: {
    // see https://node.green for support matrix
    // ecmascript version 13 requires NodeJS 17+
    ecmaVersion: 13,
    project: './tsconfig.eslint.json',
  },
};
