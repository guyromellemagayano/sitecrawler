const { createContext, useContext } = require("react");
import ProgressBar from "@components/progress-bar";
import { LogoutApiEndpoint, UserApiEndpoint } from "@constants/ApiEndpoints";
import AppSeo from "@constants/AppSeo";
import { isProd } from "@constants/ServerEnv";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { handlePostMethod } from "@helpers/handleHttpMethods";
import { useNotificationMessage } from "@hooks/useNotificationMessage";
import GlobalStyles from "@styles/global";
import LogRocket from "logrocket";
import setupLogRocketReact from "logrocket-react";
import { DefaultSeo } from "next-seo";
import { useRouter } from "next/router";
import { useMemo } from "react";
import { useSWRConfig } from "swr";

// Font Awesome
library.add(fab);
library.add(fas);

/**
 * Create new App context
 */
const SiteCrawlerAppContext = createContext();

/**
 * Custom hook to get the App wrapper context provider
 */
export const SiteCrawlerAppWrapper = ({ children }) => {
	// Router
	const router = useRouter();

	// SWR hook for global mutations
	const { mutate } = useSWRConfig();

	// Custom hooks
	const { state, setConfig } = useNotificationMessage();

	// LogRocket setup
	useMemo(() => {
		if (isProd && typeof window !== "undefined") {
			LogRocket.init(process.env.LOGROCKET_APP_ID);
			setupLogRocketReact(LogRocket);
		}
	}, []);

	// Handle `logout` feature
	const handleLogout = async (e) => {
		e.preventDefault();

		const logoutResponse = await handlePostMethod(LogoutApiEndpoint);
		const logoutResponseData = logoutResponse?.data ?? null;
		const logoutResponseStatus = logoutResponse?.status ?? null;
		const logoutResponseMethod = logoutResponse?.config?.method ?? null;

		if (logoutResponseData !== null && Math.round(logoutResponseStatus / 100) === 2) {
			// Mutate `user` endpoint after successful 200 OK or 201 Created response is issued
			await mutate(UserApiEndpoint, false);

			// Show alert message after failed response is issued
			setConfig({
				isLogout: true,
				method: logoutResponseMethod,
				status: logoutResponseStatus
			});
		}
	};

	return (
		<SiteCrawlerAppContext.Provider
			value={{
				handleLogout
			}}
		>
			<GlobalStyles />
			<DefaultSeo {...AppSeo} />
			<ProgressBar />
			{children}
		</SiteCrawlerAppContext.Provider>
	);
};

/**
 * Custom hook to get the App context provider
 */
export const useSiteCrawlerAppContext = () => useContext(SiteCrawlerAppContext);
