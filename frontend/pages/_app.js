import { MemoizedNotification } from "@components/notifications";
import ProgressBar from "@components/progress-bar";
import AppSeo from "@constants/AppSeo";
import { isProd } from "@constants/ServerEnv";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { useNotificationMessage } from "@hooks/useNotificationMessage";
import GlobalStyles from "@styles/global";
import LogRocket from "logrocket";
import setupLogRocketReact from "logrocket-react";
import { DefaultSeo } from "next-seo";
import { useRouter } from "next/router";
import { createContext, useMemo } from "react";
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

	// Use the layout defined at the page level, if available
	const getLayout = Component.getLayout || ((page) => page);

	return getLayout(
		<SiteCrawlerAppContext.Provider
			value={{
				state,
				setConfig
			}}
		>
			<GlobalStyles />
			<DefaultSeo {...AppSeo} />
			<ProgressBar />

			{state?.responses?.map((value, key) => {
				// Alert Messsages
				const responseTitle = value.responseTitle ?? null;
				const responseText = value.responseText ?? null;
				const isSuccess = value.isSuccess ?? null;

				return (
					<div
						key={key}
						aria-live="assertive"
						tw="fixed z-30 w-full max-w-md right-2 top-4 bottom-4 flex flex-col justify-start items-end gap-4 overflow-y-auto"
					>
						<MemoizedNotification
							key={key}
							responseTitle={responseTitle}
							responseText={responseText}
							isSuccess={isSuccess}
						/>
					</div>
				);
			}) ?? null}

			<Component {...pageProps} err={err} />
		</SiteCrawlerAppContext.Provider>
	);
}
