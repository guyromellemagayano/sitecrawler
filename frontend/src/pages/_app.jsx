// External
import "tailwindcss/tailwind.css";
import { DefaultSeo } from "next-seo";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";

// Utils
import { getCookie } from "src/utils/cookie";
import { HistoryProvider } from "src/utils/history";

// Enums
import appSeo from "src/enum/nextSeo";

// Components
import GlobalStyles from "src/components/GlobalStyles";
import TopProgressBar from "src/components/TopProgressBar";

// Font Awesome
library.add(fab);

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

MyApp.getInitialProps = async (appContext) => {
	let pageProps = {};

	if (appContext.Component.getInitialProps) {
		pageProps = await appContext.Component.getInitialProps(appContext.ctx);
	}

	const token = getCookie("token", appContext.ctx.req) || "";

	pageProps.token = token;

	return {
		pageProps,
	};
};

export default MyApp;
