import App from "next/app";
import PropTypes from "prop-types";
import * as React from "react";
import "tailwindcss/tailwind.css";

const MyApp = ({ Component, pageProps }) => {
	// Use the layout defined at the page level, if available
	const getLayout = Component.getLayout || ((page) => page);

	return getLayout(<Component {...pageProps} />);
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
