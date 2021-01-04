// postcss.config.js
module.exports = {
	plugins: [
		'postcss-import',
		'tailwindcss',
		'autoprefixer',
		['postcss-preset-env', { stage: 4 }]
	]
};
