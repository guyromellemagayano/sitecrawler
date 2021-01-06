// React
import React from 'react';

// External
import 'core-js';
import { Elements } from '@stripe/react-stripe-js';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { loadStripe } from '@stripe/stripe-js';
import { DefaultSeo } from 'next-seo';
import PropTypes from 'prop-types';

// Enums
import SEO from 'src/enum/nextSEO';

// Components
import SiteHead from 'src/components/layout/SiteHead';

// Other imports
import 'public/styles/app.css';

// Font Awesome
library.add(fab);

const App = ({ Component, pageProps }) => {
	const stripePromise = loadStripe(process.env.STRIPE_PUBLIC_KEY);

	return (
		<Elements stripe={stripePromise}>
			<DefaultSeo {...SEO} />
			<SiteHead />
			<Component {...pageProps} />
		</Elements>
	);
};

App.propTypes = {
	Component: PropTypes.func,
	pageProps: PropTypes.object
};

export default App;
