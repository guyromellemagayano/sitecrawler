// React
import * as React from "react";

// NextJS
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

// External
import "tailwindcss/tailwind.css";
import { DefaultSeo } from "next-seo";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import App from "next/app";

import setupLogRocketReact from "logrocket-react";

// TODO: Add PropTypes in _app page

// Enums
import AppSeo from "@enums/AppSeo";

// Components
import GlobalStyles from "@styles/GlobalStyles";
import TopProgressBar from "@components/top-progress-bar";

// Dynamic
const LogRocket = dynamic(() => import("logrocket"), { ssr: false });

// Font Awesome
library.add(fab);
library.add(fas);

// LogRocket
if (process.env.NODE_ENV === "production") {
	LogRocket.init("epic-design-labs/link-app");
	setupLogRocketReact(LogRocket);
}

const MyApp = ({ Component, pageProps }) => {
	let activeRequests = 0;

	const router = useRouter();

	const [state, setState] = React.useState({
		isRouteChanging: false,
		loadingKey: 0
	});

	React.useEffect(() => {
		const handleRouteChangeStart = () => {
			setState((prevState) => ({
				...prevState,
				isRouteChanging: true,
				loadingKey: prevState.loadingKey ^ 1
			}));
		};

		const handleRouteChangeEnd = () => {
			if (activeRequests > 0) {
				return;
			}

			setState((prevState) => ({
				...prevState,
				isRouteChanging: false
			}));
		};

		router.events.on("routeChangeStart", handleRouteChangeStart);
		router.events.on("routeChangeComplete", handleRouteChangeEnd);
		router.events.on("routeChangeError", handleRouteChangeEnd);

		typeof window !== "undefined" &&
			(() => {
				const originalFetch = window.fetch;

				window.fetch = async function (...args) {
					if (activeRequests === 0) {
						handleRouteChangeStart();
					}

					activeRequests++;

					try {
						const response = await originalFetch(...args);
						return response;
					} catch (error) {
						return Promise.reject(error);
					} finally {
						activeRequests -= 1;
						if (activeRequests === 0) {
							handleRouteChangeEnd();
						}
					}
				};
			})();

		return () => {
			router.events.off("routeChangeStart", handleRouteChangeStart);
			router.events.off("routeChangeComplete", handleRouteChangeEnd);
			router.events.off("routeChangeError", handleRouteChangeEnd);
		};
	}, [router.events]);

	return (
		<>
			<DefaultSeo {...AppSeo} />
			<GlobalStyles />
			<TopProgressBar key={state.loadingKey} isRouteChanging={state.isRouteChanging} />
			<Component {...pageProps} />
		</>
	);
};

MyApp.getInitialProps = async (appContext) => {
	const appProps = await App.getInitialProps(appContext);

	return { ...appProps };
};

export default MyApp;
