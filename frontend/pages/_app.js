import AppSeo from "@constants/AppSeo";
import { ComponentReadyInterval } from "@constants/GlobalValues";
import { isProd } from "@constants/ServerEnv";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { useNotificationMessage } from "@hooks/useNotificationMessage";
import "@styles/globals.css";
import LogRocket from "logrocket";
import setupLogRocketReact from "logrocket-react";
import { DefaultSeo } from "next-seo";
import { useRouter } from "next/router";
import { createContext, useEffect, useState } from "react";
import { useSWRConfig } from "swr";

// Font Awesome
library.add(fab);
library.add(fas);

/**
 * Create new App context
 */
export const SiteCrawlerAppContext = createContext();

export default function SiteCrawlerApp({ Component, pageProps, err }) {
	const [isComponentReady, setIsComponentReady] = useState(false);

	// Router
	const { isReady } = useRouter();

	// Custom hooks
	const { state, setConfig } = useNotificationMessage();

	// SWR hook for global mutations
	const { mutate } = useSWRConfig();

	useEffect(() => {
		let isMounted = true;

		(async () => {
			if (!isMounted) return;

			// Handle component loading
			if (isReady) {
				// LogRocket setup
				if (isProd) {
					LogRocket.init(process.env.LOGROCKET_APP_ID);
					setupLogRocketReact(LogRocket);
				}

				setIsComponentReady(true);
			}

			return await new Promise((resolve) => {
				setTimeout(() => resolve(isComponentReady), ComponentReadyInterval);
			}).then((result) => result);
		})();

		return () => {
			isMounted = false;
		};
	}, [isReady]);

	// Use the layout defined at the page level, if available
	const getLayout = Component.getLayout || ((page) => page);

	return getLayout(
		<SiteCrawlerAppContext.Provider
			value={{
				isComponentReady,
				setConfig,
				state
			}}
		>
			<DefaultSeo {...AppSeo} />
			<Component {...pageProps} err={err} />
		</SiteCrawlerAppContext.Provider>
	);
}
