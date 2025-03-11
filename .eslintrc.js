module.exports = {
  root: true,
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  rules: {
    '@typescript-eslint/no-explicit-any': 'off', // Disable no-explicit-any
    '@typescript-eslint/no-var-requires': 'off', // Allow requires in .cjs files
  },
};
