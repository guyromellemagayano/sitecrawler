import AppSeo from "@configs/AppSeo";
import { DashboardSitesLink, LoginLink } from "@configs/PageLinks";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import LogRocket from "logrocket";
import setupLogRocketReact from "logrocket-react";
import { DefaultSeo } from "next-seo";
import App from "next/app";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { useEffect } from "react";
import "tailwindcss/tailwind.css";

// Font Awesome
library.add(fab);
library.add(fas);

const MyApp = ({ Component, pageProps }) => {
	// Router
	const router = useRouter();

	// Use the layout defined at the page level, if available
	const getLayout = Component.getLayout || ((page) => page);

	useEffect(() => {
		// Prefetch sites page for faster loading
		router.prefetch(DashboardSitesLink);
		router.prefetch(LoginLink);

		// LogRocket setup
		if (process.env.NODE_ENV === "production") {
			LogRocket.init("epic-design-labs/link-app");
			setupLogRocketReact(LogRocket);
		}
	}, []);

	return getLayout(
		<>
			<DefaultSeo {...AppSeo} />

			<Component {...pageProps} />
		</>
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
