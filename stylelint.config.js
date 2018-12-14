module.exports = {
  extends: ['stylelint-config-recommended-scss', 'stylelint-config-prettier'],
  quiet: false,
  rules: {
    'no-invalid-double-slash-comments': null,
    'no-empty-source': null,
    'property-no-unknown': true,
    'color-no-invalid-hex': true,
    'selector-pseudo-class-no-unknown': [
      true,
      { ignorePseudoClasses: ['global'] },
    ],
    'selector-pseudo-element-colon-notation': 'single',
  },
}
