// React
import React from 'react';

// External
// import { Elements } from '@stripe/react-stripe-js';
// import { loadStripe } from '@stripe/stripe-js';
import 'core-js';
import 'tailwindcss/tailwind.css';
import { DefaultSeo } from 'next-seo';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { SWRConfig } from 'swr';

// Enums
import appSeo from 'src/enum/nextSeo';

// Hooks
import useFetcher from 'src/hooks/useFetcher';

// Contexts
import { AuthProvider } from 'src/contexts/auth';

// Components
import GlobalStyles from 'src/components/GlobalStyles';
import SiteHead from 'src/components/layout/SiteHead';

// Font Awesome
library.add(fab);

const MyApp = ({ Component, pageProps }) => (
	<SWRConfig
		value={{
			fetcher: useFetcher
		}}
	>
		<AuthProvider>
			<DefaultSeo {...appSeo} />
			<SiteHead />
			<GlobalStyles />
			<Component {...pageProps} />
		</AuthProvider>
	</SWRConfig>
);

export default MyApp;
