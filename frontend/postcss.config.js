// postcss.config.js
module.exports = {
	plugins: { "@tailwindcss/jit": {}, "postcss-import": {}, autoprefixer: {}, "postcss-preset-env": { stage: 4 } },
};
