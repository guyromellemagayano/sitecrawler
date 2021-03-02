module.exports = {
	presets: [
		[
			'next/babel',
			{
				'styled-jsx': {
					plugins: ['styled-jsx-plugin-sass']
				},
				'preset-react': {
					runtime: 'automatic'
				}
			}
		]
	],
	plugins: [
		'babel-plugin-macros',
		'inline-react-svg',
		'add-react-displayname',
		'react-require',
		[
			'styled-components',
			{
				ssr: true,
				displayName: true,
				minify: true,
				preprocess: false,
				pure: true
			}
		],
		[
			'module-resolver',
			{
				root: ['./']
			}
		]
	]
};
