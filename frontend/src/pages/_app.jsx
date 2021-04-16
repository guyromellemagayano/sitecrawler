// External
import "tailwindcss/tailwind.css";
import { DefaultSeo } from "next-seo";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { Integrations } from "@sentry/tracing";
import { library } from "@fortawesome/fontawesome-svg-core";
import * as Sentry from "@sentry/react";
import PropTypes from "prop-types";

// Utils
import { HistoryProvider } from "src/utils/history";

// Enums
import appSeo from "src/enum/nextSeo";

// Components
import GlobalStyles from "src/components/GlobalStyles";
import TopProgressBar from "src/components/TopProgressBar";

// Font Awesome
library.add(fab);

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
		<HistoryProvider>
			<DefaultSeo {...appSeo} />
			<GlobalStyles />
			<TopProgressBar />
			<Component {...pageProps} />
		</HistoryProvider>
	);
};

MyApp.propTypes = {
	Component: PropTypes.elementType.isRequired,
	pageProps: PropTypes.object.isRequired
};

export default MyApp;
