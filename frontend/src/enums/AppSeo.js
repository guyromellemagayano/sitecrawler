// FIXME: default SEO of app

export default {
	title: "Welcome",
	titleTemplate: "%s | Site Crawler",
	description: "Monitor and Strengthen Your Websites",
	keywords: "site, crawler, monitor, website",
	canonical: "https://app.sitecrawler.com",
	additionalMetaTags: [
		{
			property: "viewport",
			content: "width=device-width,initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no"
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
	}
};
