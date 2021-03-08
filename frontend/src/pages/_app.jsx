// React
import React from 'react';

// External
import 'core-js';
import 'tailwindcss/tailwind.css';
import { DefaultSeo } from 'next-seo';
import { Elements } from '@stripe/react-stripe-js';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { loadStripe } from '@stripe/stripe-js';
import { SWRConfig } from 'swr';
import axios from 'axios';
import PropTypes from 'prop-types';

// Enums
import SEO from 'src/enum/nextSeo';

// Hooks
import useFetcher from 'src/hooks/useFetcher';

// Components
import GlobalStyles from 'src/components/GlobalStyles';
import SiteHead from 'src/components/layout/SiteHead';

// Font Awesome
library.add(fab);

const getStripeKey = async (...args) => {
	try {
		const response = await axios.get(...args);
		const data = await response.data;

		return loadStripe(data.publishable_key);
	} catch (error) {
		// Debugging purpose only
		// console.log('Error', error.config);
		// console.log('Error', error.response.data);
		// console.log('Error', error.response.headers);
		// console.log('Error', error.response.status);
		// console.log('Error', error.request);

		throw error.message;
	}
};

// const stripePromise = loadStripe(
// 	stripeKey && stripeKey !== undefined && stripeKey
// );

const App = ({ Component, pageProps }) => {
	const stripeConfigApiEndpoint = '/api/stripe/config/';

	const stripePromise = getStripeKey(stripeConfigApiEndpoint, useFetcher);

	return (
		<SWRConfig
			value={{
				fetcher: useFetcher
			}}
		>
			<Elements stripe={stripePromise}>
				<DefaultSeo {...SEO} />
				<SiteHead />
				<GlobalStyles />
				<Component {...pageProps} />
			</Elements>
		</SWRConfig>
	);
};

App.propTypes = {};

export default App;
