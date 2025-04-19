
const postcssDiscardComments = require('postcss-discard-comments')




module.exports = {
  plugins: [
    'postcss-reporter',
    'postcss-cssnext',
    'postcss-url',
    'cssnano',
    // 'postcss-preset-env',
    // 'autoprefixer',
    'postcss-import',
    // 'tailwindcss',
    'postcss-nested',

    postcssDiscardComments({ remove: (comment) => comment.includes('some-keyword') })
  ]

};
