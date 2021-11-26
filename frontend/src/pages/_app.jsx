import AppSeo from "@configs/AppSeo";
import { NoInterval, OnErrorRetryCount, RevalidationInterval } from "@configs/GlobalValues";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { useGetMethod } from "@hooks/useHttpMethod";
import * as Sentry from "@sentry/nextjs";
import { DefaultSeo } from "next-seo";
import App from "next/app";
import dynamic from "next/dynamic";
import PropTypes from "prop-types";
import { SWRConfig } from "swr";
import "tailwindcss/tailwind.css";

// Font Awesome
library.add(fab);
library.add(fas);

// Dynamic imports
const GlobalStyles = dynamic(() => import("@styles/GlobalStyles"), { ssr: true });
const TopProgressBar = dynamic(() => import("@components/top-progress-bar"), { ssr: true });

const MyApp = ({ Component, pageProps }) => {
	// Use the layout defined at the page level, if available
	const getLayout = Component.getLayout || ((page) => page);

	return getLayout(
		<SWRConfig
			value={{
				fetcher: useGetMethod,
				refreshInterval: RevalidationInterval,
				dedupingInterval: NoInterval,
				onErrorRetry: (err, key, config, revalidate, { retryCount }) => {
					// Capture unknown errors and send to Sentry
					Sentry.configureScope((scope) => {
						scope.setTag("action", "onErrorRetry");
						scope.setTag("route", asPath);
						scope.setTag("key", key);
						scope.setTag("config", config);
						Sentry.captureException(new Error(err));
					});

					// Only retry up to 5 times.
					if (retryCount >= OnErrorRetryCount) return;

					// Retry after 5 seconds.
					setTimeout(() => revalidate({ retryCount }), RevalidationInterval);
				}
			}}
		>
			<GlobalStyles />
			<DefaultSeo {...AppSeo} />
			<TopProgressBar />
			<Component {...pageProps} />
		</SWRConfig>
	);
};

MyApp.propTypes = {
	Component: PropTypes.any,
	pageProps: PropTypes.any
};

MyApp.getInitialProps = async (appContext) => {
	const appProps = await App.getInitialProps(appContext);

	return { ...appProps };
};

export default MyApp;
