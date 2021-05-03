// External
import "tailwindcss/tailwind.css";
import { DefaultSeo } from "next-seo";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { Integrations } from "@sentry/tracing";
import { library } from "@fortawesome/fontawesome-svg-core";
import * as Sentry from "@sentry/react";
import App from "next/app";
import PropTypes from "prop-types";

// Enums
import appSeo from "src/enum/nextSeo";

// Components
import GlobalStyles from "src/components/GlobalStyles";
import TopProgressBar from "src/components/TopProgressBar";

// Font Awesome
library.add(fab);
library.add(fas);

// Sentry
if (process.env.NODE_ENV === "production") {
	Sentry.init({
		dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
		integrations: [new Integrations.BrowserTracing()],
		tracesSampleRate: 0.5
	});
}

const MyApp = ({ Component, pageProps }) => {
	return (
		<>
			<DefaultSeo {...appSeo} />
			<GlobalStyles />
			<TopProgressBar />
			<Component {...pageProps} />
		</>
	);
};

MyApp.propTypes = {};

MyApp.getInitialProps = async (appContext) => {
	const appProps = await App.getInitialProps(appContext);

	return { ...appProps };
};

export default MyApp;
