require('dotenv').config({ path: `./.env.${process.env.NODE_ENV}` });

module.exports = {
	trailingSlash: true,
	devIndicators: {
		autoPrerender: false
	},
	env: {
		STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY
	}
};
