import AppSeo from "@configs/AppSeo";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { DefaultSeo } from "next-seo";
import App from "next/app";
import dynamic from "next/dynamic";
import PropTypes from "prop-types";
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
		<>
			<GlobalStyles />
			<DefaultSeo {...AppSeo} />
			<TopProgressBar />
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
