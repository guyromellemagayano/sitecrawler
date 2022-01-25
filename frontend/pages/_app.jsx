import ProgressBar from "@components/progress-bar";
import AppSeo from "@constants/AppSeo";
import { isProd } from "@constants/ServerEnv";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { GlobalCustomStyles } from "@styles/GlobalCustomStyles";
import LogRocket from "logrocket";
import setupLogRocketReact from "logrocket-react";
import { DefaultSeo } from "next-seo";
import { useEffect } from "react";
import { SWRConfig } from "swr";

// Font Awesome
library.add(fab);
library.add(fas);

const MyApp = ({ Component, pageProps, err }) => {
	// Use the layout defined at the page level, if available
	const getLayout = Component.getLayout || ((page) => page);

	useEffect(() => {
		// LogRocket setup
		if (isProd) {
			LogRocket.init(process.env.LOGROCKET_APP_ID);
			setupLogRocketReact(LogRocket);
		}
	}, []);

	return getLayout(
		<SWRConfig>
			<GlobalCustomStyles />
			<DefaultSeo {...AppSeo} />
			<ProgressBar />
			<Component {...pageProps} err={err} />
		</SWRConfig>
	);
};

export default MyApp;
