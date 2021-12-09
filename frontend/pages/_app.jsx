import ProgressBar from "@components/progress-bar";
import AppSeo from "@constants/AppSeo";
import { DashboardSitesLink, DashboardSlug, LoginLink } from "@constants/PageLinks";
import { isProd } from "@constants/ServerEnv";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { useUser } from "@hooks/useUser";
import { GlobalCustomStyles } from "@styles/GlobalCustomStyles";
import LogRocket from "logrocket";
import setupLogRocketReact from "logrocket-react";
import { DefaultSeo } from "next-seo";
import { useRouter } from "next/router";
import { useCallback, useEffect } from "react";
import { SWRConfig } from "swr";

// Font Awesome
library.add(fab);
library.add(fas);

export default function App({ Component, pageProps, err }) {
	// Router
	const { pathname } = useRouter();
	const router = useRouter();

	// SWR hooks
	const { user, errorUser, validatingUser } = useUser();

	// User authentication
	const authenticate = useCallback(async () => {
		// If user is not authenticated, redirect to login page
		if (!validatingUser) {
			if (
				!errorUser &&
				typeof user !== "undefined" &&
				user !== null &&
				Object.keys(user)?.length > 0 &&
				Math.round(user?.status / 200) === 1
			) {
				if (!pathname.includes(DashboardSlug)) {
					router.push(DashboardSitesLink);
				} else {
					return;
				}
			} else {
				if (!pathname.includes(DashboardSlug)) {
					return;
				} else {
					router.push(LoginLink);
				}
			}
		}
	}, [validatingUser, errorUser, user, pathname, router]);

	useEffect(() => {
		authenticate();
	}, [authenticate]);

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
		<SWRConfig
			value={{
				refreshWhenHidden: true
			}}
		>
			<GlobalCustomStyles />
			<DefaultSeo {...AppSeo} />
			<ProgressBar />
			<Component {...pageProps} err={err} />
		</SWRConfig>
	);
}
