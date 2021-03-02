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
import PropTypes from 'prop-types';

// Enums
import SEO from 'src/enum/nextSEO';

// Hooks
import useFetcher from 'src/hooks/useFetcher';

// Components
import GlobalStyles from 'src/components/GlobalStyles';
import SiteHead from 'src/components/layout/SiteHead';

// Font Awesome
library.add(fab);

const App = ({ Component, pageProps }) => {
	const stripePromise = loadStripe(process.env.STRIPE_PUBLIC_KEY);

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
