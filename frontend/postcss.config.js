// postcss.config.js
const purgecss = require('@fullhuman/postcss-purgecss')({

  // Specify the paths to all of the template files in your project
  content: [
    './components/**/*.jsx',
    './hooks/*.jsx',
    './pages/*.jsx',
  ],

  // Include any special characters you're using in this regular expression
  defaultExtractor: content => content.match(/[\w-/.:]+(?<!:)/g) || []
})

module.exports = {
  plugins: {
    'postcss-import': {},
    tailwindcss: {},
    autoprefixer: {},
    'postcss-preset-env': { stage: 2 },
    ...process.env.NODE_ENV == 'production'
      ? [purgecss]
      : []
  }
}