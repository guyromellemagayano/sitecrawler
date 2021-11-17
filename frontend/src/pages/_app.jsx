import TopProgressBar from "@components/top-progress-bar";
import { UserApiEndpoint } from "@configs/ApiEndpoints";
import AppSeo from "@configs/AppSeo";
import { OnErrorRetryCount, RevalidationInterval } from "@configs/GlobalValues";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { useGetMethod } from "@hooks/useHttpMethod";
import { GlobalStyles } from "@styles/GlobalStyles";
import LogRocket from "logrocket";
import setupLogRocketReact from "logrocket-react";
import { DefaultSeo } from "next-seo";
import App from "next/app";
import PropTypes from "prop-types";
import * as React from "react";
import { SWRConfig } from "swr";
import "tailwindcss/tailwind.css";

// Font Awesome
library.add(fab);
library.add(fas);

const MyApp = ({ Component, pageProps }) => {
	// Utilizing LogRocket with SSR
	React.useEffect(() => {
		if (process.env.NODE_ENV === "production") {
			LogRocket.init("epic-design-labs/link-app");
			setupLogRocketReact(LogRocket);
		}
	}, []);

	return (
		<SWRConfig
			value={{
				fetcher: useGetMethod,
				refreshInterval: RevalidationInterval,
				onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
					// Never retry on 404.
					if (error.status === 404) return;

					// Never retry for a specific key.
					if (key === UserApiEndpoint) return;

					// Only retry up to 5 times.
					if (retryCount >= OnErrorRetryCount) return;

					// Retry after 5 seconds.
					setTimeout(() => revalidate({ retryCount }), RevalidationInterval);
				}
			}}
		>
			<DefaultSeo {...AppSeo} />
			<GlobalStyles />
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
