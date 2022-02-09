// import { MemoizedNotification } from "@components/notifications";
import ProgressBar from "@components/progress-bar";
import AppSeo from "@constants/AppSeo";
import { isProd } from "@constants/ServerEnv";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { useNotificationMessage } from "@hooks/useNotificationMessage";
import { useUser } from "@hooks/useUser";
import GlobalStyles from "@styles/global";
import LogRocket from "logrocket";
import setupLogRocketReact from "logrocket-react";
import { DefaultSeo } from "next-seo";
import { useRouter } from "next/router";
import { createContext, useEffect } from "react";
import { useSWRConfig } from "swr";
import "twin.macro";

// Font Awesome
library.add(fab);
library.add(fas);

/**
 * Create new App context
 */
export const SiteCrawlerAppContext = createContext();

export default function SiteCrawlerApp({ Component, pageProps, err }) {
	// Router
	const router = useRouter();

	// Custom hooks
	const { state, setConfig } = useNotificationMessage();

	// SWR hook for global mutations
	const { mutate } = useSWRConfig();

	// LogRocket setup
	useEffect(() => {
		let isMounted = true;

		(async () => {
			if (!isMounted) return;

			if (isProd) {
				LogRocket.init(process.env.LOGROCKET_APP_ID);
				setupLogRocketReact(LogRocket);
			}
		})();

		return () => {
			isMounted = false;
		};
	}, []);

	// User authentication, authorization, and redirection
	const { user, errorUser, validatingUser } = useUser();

	useEffect(() => {
		let isMounted = true;

		(async () => {
			if (!isMounted) return;

			// Show alert message after failed `user` SWR hook fetch
			errorUser
				? setConfig({
						isUser: true,
						method: errorUser?.config?.method ?? null,
						status: errorUser?.status ?? null
				  })
				: null;

			if (!validatingUser && !errorUser && user && !user?.data?.detail) {
				// Show alert message after success response is issued
				setConfig({
					isUser: true,
					method: user?.config?.method ?? null,
					status: user?.status ?? null
				});
			}
		})();

		return () => {
			isMounted = false;
		};
	}, [user, errorUser, validatingUser]);

	// Use the layout defined at the page level, if available
	const getLayout = Component.getLayout || ((page) => page);

	return getLayout(
		<SiteCrawlerAppContext.Provider
			value={{
				user,
				validatingUser,
				state,
				setConfig
			}}
		>
			<GlobalStyles />
			<DefaultSeo {...AppSeo} />
			<ProgressBar />
			<Component {...pageProps} err={err} />
		</SiteCrawlerAppContext.Provider>
	);
}
