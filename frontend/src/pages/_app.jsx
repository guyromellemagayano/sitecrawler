// React
import React, { useEffect } from 'react';

// External
// import { Elements } from '@stripe/react-stripe-js';
// import { loadStripe } from '@stripe/stripe-js';
import 'core-js';
import 'tailwindcss/tailwind.css';
import { DefaultSeo } from 'next-seo';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
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

const App = ({ Component, pageProps }) => (
	<>
		<DefaultSeo {...SEO} />
		<SiteHead />
		<GlobalStyles />
		<Component {...pageProps} />
	</>
);

App.propTypes = {};

export default App;
