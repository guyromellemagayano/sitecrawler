// FIXME: default SEO of app

export default {
	title: "Welcome",
	titleTemplate: "%s | SiteCrawler",
	description: "Monitor and Strengthen Your Websites",
	keywords: "site, crawler, monitor, website",
	canonical: "https://app.sitecrawler.com",
	additionalMetaTags: [
		{
			property: "viewport",
			content: "width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
		},
		{
			property: "application-name",
			content: "SiteCrawler"
		},
		{
			property: "msapplication-TileColor",
			content: "#FFFFFF"
		},
		{
			property: "msapplication-TileImage",
			content: "/favicons/mstile-144x144.png"
		},
		{
			property: "msapplication-square70x70logo",
			content: "/favicons/mstile-70x70.png"
		},
		{
			property: "msapplication-square150x150logo",
			content: "/favicons/mstile-150x150.png"
		},
		{
			property: "msapplication-wide310x150logo",
			content: "/favicons/mstile-310x150.png"
		},
		{
			property: "msapplication-square310x310logo",
			content: "/favicons/mstile-310x310.png"
		}
	],
	openGraph: {
		locale: "en_US",
		site_name: "Site Crawler",
		type: "website",
		url: "https://app.sitecrawler.com/",
		title: "Site Crawler | Monitor and Strengthen Your Websites",
		profile: {
			firstName: "Kalon",
			lastName: "Wiggins",
			username: "kal",
			gender: "male"
		}
	},
	additionalLinkTags: [
		{
			rel: "apple-touch-icon-precomposed",
			href: "/favicons/apple-touch-icon-57x57.png",
			sizes: "57x57"
		},
		{
			rel: "apple-touch-icon-precomposed",
			href: "/favicons/apple-touch-icon-114x114.png",
			sizes: "114x114"
		},
		{
			rel: "apple-touch-icon-precomposed",
			href: "/favicons/apple-touch-icon-72x72.png",
			sizes: "72x72"
		},
		{
			rel: "apple-touch-icon-precomposed",
			href: "/favicons/apple-touch-icon-144x144.png",
			sizes: "144x144"
		},
		{
			rel: "apple-touch-icon-precomposed",
			href: "/favicons/apple-touch-icon-60x60.png",
			sizes: "60x60"
		},
		{
			rel: "apple-touch-icon-precomposed",
			href: "/favicons/apple-touch-icon-120x120.png",
			sizes: "120x120"
		},
		{
			rel: "apple-touch-icon-precomposed",
			href: "/favicons/apple-touch-icon-76x76.png",
			sizes: "76x76"
		},
		{
			rel: "apple-touch-icon-precomposed",
			href: "/favicons/apple-touch-icon-152x152.png",
			sizes: "152x152"
		},
		{
			rel: "icon",
			type: "image/png",
			href: "/favicons/favicon-196x196.png",
			sizes: "196x196"
		},
		{
			rel: "icon",
			type: "image/png",
			href: "/favicons/favicon-96x96.png",
			sizes: "96x96"
		},
		{
			rel: "icon",
			type: "image/png",
			href: "/favicons/favicon-32x32.png",
			sizes: "32x32"
		},
		{
			rel: "icon",
			type: "image/png",
			href: "/favicons/favicon-16x16.png",
			sizes: "16x16"
		},
		{
			rel: "icon",
			type: "image/png",
			href: "/favicons/favicon-128.png",
			sizes: "128x128"
		}
	]
};
