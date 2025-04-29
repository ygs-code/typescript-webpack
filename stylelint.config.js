/*
 * @Date: 2022-06-06 09:26:54
 * @Author: Yao guan shou
 * @LastEditors: Yao guan shou
 * @LastEditTime: 2022-06-07 17:28:20
 * @FilePath: /webpack-cli/stylelint.config.js
 * @Description:
 */
//配置 https://stylelint.io/user-guide/configure/
module.exports = {
  files: ["src/**/*.css","src/**/*.less", "src/**/*.scss"], // 使用 glob 模式匹配多个入口文件
  plugins: ["stylelint-scss", "stylelint-less"],
  extends: ["stylelint-config-standard", "stylelint-config-standard-scss"],
  rules: {
    "at-rule-no-unknown": null,
    "no-empty-source": null,
    "declaration-block-no-redundant-longhand-properties": null,
    "selector-id-pattern": null,
    "property-no-vendor-prefix": null,
    "value-no-vendor-prefix": null,
    "alpha-value-notation": null,
    "color-function-notation": null,
    "at-rule-semicolon-newline-after": null,
    "max-empty-lines": null,
    // "max-empty-lines": 0,
    // 'stylelint-config-recommended-scss',
    indentation: null,
    "selector-pseudo-class-no-unknown": null,
    "shorthand-property-no-redundant-values": null,
    "at-rule-empty-line-before": null,
    "at-rule-name-space-after": null,
    "comment-empty-line-before": null,
    "declaration-colon-newline-after": null,
    "declaration-bang-space-before": null,
    "declaration-empty-line-before": null,
    "function-comma-newline-after": null,
    "function-name-case": null,
    "function-parentheses-newline-inside": null,
    "function-max-empty-lines": null,
    "function-whitespace-after": null,
    "declaration-block-trailing-semicolon": null,
    // "at-rule-no-unknown": [
    //   true,
    //   {
    //     ignoreAtRules: [
    //       "tailwind",
    //       "apply",
    //       "variants",
    //       "responsive",
    //       "screen",
    //     ],
    //   },
    // ],

    "no-missing-end-of-source-newline": null,
    "number-leading-zero": null,
    "number-no-trailing-zeros": null,
    "rule-empty-line-before": null,
    "selector-combinator-space-after": null,
    "selector-descendant-combinator-no-non-space": null,
    "selector-list-comma-newline-after": null,
    "selector-pseudo-element-colon-notation": null,
    "unit-no-unknown": null,
    "block-opening-brace-space-before": null,
    "no-descending-specificity": null,
    "value-list-max-empty-lines": null,
    "no-eol-whitespace": null,
  },
};
