import TopProgressBar from "@components/top-progress-bar";
import AppSeo from "@configs/AppSeo";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { GlobalStyles } from "@styles/GlobalStyles";
import LogRocket from "logrocket";
import setupLogRocketReact from "logrocket-react";
import { DefaultSeo } from "next-seo";
import App from "next/app";
import PropTypes from "prop-types";
import * as React from "react";
import "tailwindcss/tailwind.css";

// Font Awesome
library.add(fab);
library.add(fas);

// LogRocket
process.env.NODE_ENV === "production"
	? (() => {
			typeof window
				? (() => {
						LogRocket.init("epic-design-labs/link-app");
						setupLogRocketReact(LogRocket);
				  })()
				: null;
	  })()
	: null;

const MyApp = ({ Component, pageProps }) => {
	return (
		<React.Fragment>
			<DefaultSeo {...AppSeo} />
			<GlobalStyles />
			<TopProgressBar />
			<Component {...pageProps} />
		</React.Fragment>
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
