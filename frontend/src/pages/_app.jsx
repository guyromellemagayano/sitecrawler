// External
import "tailwindcss/tailwind.css";
import { DefaultSeo } from "next-seo";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import App from "next/app";
import LogRocket from "logrocket";
import PropTypes from "prop-types";
import setupLogRocketReact from "logrocket-react";

// Enums
import appSeo from "src/enums/nextSeo";

// Components
import GlobalStyles from "src/components/GlobalStyles";
import TopProgressBar from "src/components/TopProgressBar";

// Font Awesome
library.add(fab);
library.add(fas);

// Sentry
if (process.env.NODE_ENV === "production") {
	if (typeof window !== "undefined") {
		LogRocket.init("epic-design-labs/link-app");
		setupLogRocketReact(LogRocket);
	}
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
