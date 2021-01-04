// React
import React from 'react';

// External
import { Elements } from '@stripe/react-stripe-js';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { loadStripe } from '@stripe/stripe-js';
import { SWRConfig } from 'swr';
import PropTypes from 'prop-types';

// Hooks
import fetchJson from 'src/hooks/fetchJson';

// Other imports
import 'public/styles/app.css';

library.add(fab);

const App = ({ Component, pageProps }) => {
	const stripePromise = loadStripe(process.env.STRIPE_PUBLIC_KEY);

	return (
		<SWRConfig
			value={{
				fetcher: fetchJson,
				revalidateOnFocus: false
			}}
		>
			<Elements stripe={stripePromise}>
				<Component {...pageProps} />
			</Elements>
		</SWRConfig>
	);
};

App.propTypes = {
	Component: PropTypes.element,
	pageProps: PropTypes.node
};

export default App;
