require('dotenv').config({ path: `./.env.${process.env.NODE_ENV}` });

module.exports = {
	trailingSlash: true,
	devIndicators: {
		autoPrerender: false
	},
	env: {
		ENDPOINT: process.env.API_ENDPOINT,
		STRIPE_PUBLIC_KEY: process.env.STRIPE_PUBLIC_KEY,
		BEACON_PROVIDER_KEY: process.env.BEACON_PROVIDER_KEY,
		USETIFUL_DATASET_TOKEN: process.env.USETIFUL_DATASET_TOKEN
	}
};
