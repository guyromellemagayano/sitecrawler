module.exports = {
	stories: [
		'../src/components/**/*.stories.@(js|jsx|mdx)',
		'../src/pages/**/*.stories.@(js|jsx|mdx)'
	],
	addons: [
		'@storybook/addon-links',
		'@storybook/addon-essentials',
		'@storybook/preset-create-react-app'
	]
};
