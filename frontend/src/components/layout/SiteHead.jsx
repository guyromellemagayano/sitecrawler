import React from 'react';

const SiteHead = (props) => {
	const { title } = props;

	const linkTags = [
		{
			rel: 'apple-touch-icon',
			sizes: '180x180',
			href: '/icon/apple/apple-touch-icon.png'
		},
		{
			rel: 'icon',
			sizes: '16x16',
			href: '/icon/favicon/favicon-16x16.png',
			type: 'image/png'
		},
		{
			rel: 'icon',
			sizes: '32x32',
			href: '/icon/favicon/favicon-32x32.png',
			type: 'image/png'
		},
		{
			rel: 'icon',
			sizes: '192x192',
			href: '/icon/android/android-chrome-192x192.png',
			type: 'image/png'
		},
		{
			rel: 'icon',
			sizes: '194x194',
			href: '/icon/favicon/favicon-194x194.png',
			type: 'image/png'
		},
		{
			rel: 'manifest',
			href: '/icon/site.webmanifest'
		},
		{
			rel: 'mask-icon',
			href: '/icon/apple/safari-pinned-tab.svg',
			color: '#5bbad5'
		},
		{
			rel: 'shortcut icon',
			href: '/icon/favicon/favicon.ico'
		}
	];

	const metaTags = [
		{
			charset: 'utf-8'
		},
		{
			name: 'viewport',
			content:
				'width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no'
		},
		{
			name: 'description',
			content: 'Monitor and Strengthen Your Websites'
		},
		{
			name: 'keywords',
			content: 'site, crawler, monitor, website'
		},

		// Android
		{
			name: 'theme-color',
			content: '#ffffff'
		},
		{
			name: 'mobile-web-app-capable',
			content: 'yes'
		},

		// iOS
		{
			name: 'apple-mobile-web-app-title',
			content: 'Site Crawler'
		},
		{
			name: 'apple-mobile-web-app-capable',
			content: 'yes'
		},
		{
			name: 'apple-mobile-web-app-status-bar-style',
			content: 'default'
		},

		// Windows
		{
			name: 'msapplication-navbutton-color',
			content: '#b91d47'
		},
		{
			name: 'msapplication-TileColor',
			content: '#b91d47'
		},
		{
			name: 'msapplication-TileImage',
			content: '/icon/windows/ms-icon-144x144.png'
		},
		{
			name: 'msapplication-config',
			content: '/icon/browserconfig.xml'
		},

		// Pinned Sites
		{
			name: 'application-name',
			content: 'Site Crawler'
		},
		{
			name: 'msapplication-tooltip',
			content: 'Site Crawler'
		},
		{
			name: 'msapplication-starturl',
			content: 'https://app.sitecrawler.com'
		},

		// Tap Highlighting
		{
			name: 'msapplication-tap-highlight',
			content: 'no'
		},

		// UC Mobile Browser
		{
			name: 'full-screen',
			content: 'yes'
		},
		{
			name: 'browsermode',
			content: 'application'
		},

		// Disable night mode for this page
		{
			name: 'nightmode',
			content: 'disable'
		},

		// Layout Mode
		{
			name: 'layoutmode',
			content: 'fitscreen'
		},

		// Image Mode - Show image even in text only mode
		{
			name: 'imagemode',
			content: 'force'
		},

		// Orientation
		{
			name: 'screen-resolution',
			content: 'portrait'
		}
	];

	return (
		<>
			{metaTags.map((val, key) => {
				return (
					<meta
						key={key}
						name={
							val.name && val.name !== undefined && val.name !== null
								? val.name
								: undefined
						}
						content={
							val.content && val.content !== undefined && val.content !== null
								? val.content
								: undefined
						}
					/>
				);
			})}
			{linkTags.map((val, key) => {
				return (
					<link
						key={key}
						rel={
							val.rel && val.rel !== undefined && val.rel !== null
								? val.rel
								: undefined
						}
						sizes={
							val.sizes && val.sizes !== undefined && val.sizes !== null
								? val.sizes
								: undefined
						}
						href={
							val.href && val.href !== undefined && val.href !== null
								? val.href
								: undefined
						}
						type={
							val.type && val.type !== undefined && val.type !== null
								? val.type
								: undefined
						}
						color={
							val.color && val.color !== undefined && val.color !== null
								? val.color
								: undefined
						}
					/>
				);
			})}
			<title>{title}</title>
			<script src="scripts/beacon.js" type="text/javascript" />
			<script src="scripts/usetiful.js" type="text/javascript" />
		</>
	);
};

export default SiteHead;
