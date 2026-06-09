export default {
  '*.{ts,tsx}': [
    'prettier --write',
    'eslint --fix',
    () => 'tsc -b --noEmit',
  ],
  '*.{json,md,css}': [
    'prettier --write',
  ],
}
