import TopProgressBar from "@components/top-progress-bar";
import AppSeo from "@configs/AppSeo";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import LogRocket from "logrocket";
import setupLogRocketReact from "logrocket-react";
import { DefaultSeo } from "next-seo";
import dynamic from "next/dynamic";
import PropTypes from "prop-types";
import { useEffect } from "react";
import "tailwindcss/tailwind.css";

// Font Awesome
library.add(fab);
library.add(fas);

/**
 * Dymamic imports
 */
const GlobalStyles = dynamic(() => import("@styles/GlobalStyles"), { ssr: true });

const MyApp = ({ Component, pageProps }) => {
	// Use the layout defined at the page level, if available
	const getLayout = Component.getLayout || ((page) => page);

	useEffect(() => {
		// LogRocket setup
		if (process.env.NODE_ENV === "production") {
			LogRocket.init("epic-design-labs/link-app");
			setupLogRocketReact(LogRocket);
		}
	}, []);

	return getLayout(
		<>
			<DefaultSeo {...AppSeo} />
			<GlobalStyles />
			<TopProgressBar />
			<Component {...pageProps} />
		</>
	);
};

MyApp.propTypes = {
	Component: PropTypes.any,
	pageProps: PropTypes.any
};

export default MyApp;
