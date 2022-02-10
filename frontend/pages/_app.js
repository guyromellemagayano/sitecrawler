import ProgressBar from "@components/progress-bar";
import { UserApiEndpoint } from "@constants/ApiEndpoints";
import AppSeo from "@constants/AppSeo";
import { ComponentReadyInterval } from "@constants/GlobalValues";
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
import { createContext, useEffect, useMemo, useState } from "react";
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
	const [isComponentReady, setIsComponentReady] = useState(false);
	const [userIdApiEndpoint, setUserIdApiEndpoint] = useState(null);
	const [disableLocalTime, setDisableLocalTime] = useState(false);
	const [revalidateOnFocus, setRevalidateOnFocus] = useState(true);
	const [largePageSizeThreshold, setLargePageSizeThreshold] = useState(0);
	const [maxSiteLimit, setMaxSiteLimit] = useState(0);
	const [userId, setUserId] = useState(0);
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [firstname, setFirstname] = useState("");
	const [lastname, setLastname] = useState("");
	const [permissions, setPermissions] = useState([]);
	const [group, setGroup] = useState({});
	const [settings, setSettings] = useState({});

	// Router
	const { isReady } = useRouter();

	// Custom hooks
	const { state, setConfig } = useNotificationMessage();

	// SWR hook for global mutations
	const { mutate } = useSWRConfig();

	// LogRocket setup
	useMemo(() => {
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

	// Handle component loading
	useEffect(() => {
		let isMounted = true;

		(async () => {
			if (!isMounted) return;

			if (isReady) {
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

	// SWR config for `user` API endpoint
	const userSWRConfig = {
		revalidateOnFocus: revalidateOnFocus
	};

	// `user` SWR hook
	const { user, errorUser, validatingUser } = useUser(userSWRConfig);

	useMemo(() => {
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

			if (!validatingUser && !errorUser && !user?.data?.detail) {
				if (user?.data) {
					// Update `settings` user setting
					if (user.data?.settings) {
						if (
							Object.prototype.hasOwnProperty.call(user.data.settings, "disableLocalTime") &&
							Boolean(user.data.settings?.disableLocalTime)
						) {
							setDisableLocalTime(Boolean(user.data.settings.disableLocalTime));
						}

						setSettings(user.data.settings);
					}

					// Update `maxSiteLimit` user setting
					if (user.data?.group?.max_sites) {
						setMaxSiteLimit(user.data.group.max_sites);
					}

					// Handle `userIdApiEndpoint` and `userId` user settings
					if (user.data?.id) {
						setUserIdApiEndpoint(`${UserApiEndpoint + user.data.id}`);
						setUserId(user.data.id);
					}

					// Handle `username` user setting
					if (user.data?.username) {
						setUsername(user.data.username);
					}

					// Handle `email` user setting
					if (user.data?.email) {
						setEmail(user.data.email);
					}

					// Handle `firstname` user setting
					if (user.data?.first_name) {
						setFirstname(user.data.first_name);
					}

					// Handle `lastname` user setting
					if (user.data?.last_name) {
						setLastname(user.data.last_name);
					}

					// Handle `permissions` user setting
					if (user.data?.permissions) {
						setPermissions(user.data.permissions);
					}

					// Handle `group` user setting
					if (user.data?.group) {
						setGroup(user.data.group);
					}

					// Update `largePageSizeThreshold` user setting
					if (user.data?.large_page_size_threshold) {
						setLargePageSizeThreshold(user.data.large_page_size_threshold);
					}
				}
			}

			return {
				disableLocalTime,
				maxSiteLimit,
				userIdApiEndpoint,
				userId,
				username,
				setUsername,
				email,
				setEmail,
				firstname,
				setFirstname,
				lastname,
				setLastname,
				group,
				settings,
				setSettings,
				permissions,
				largePageSizeThreshold
			};
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
				disableLocalTime,
				email,
				errorUser,
				firstname,
				group,
				isComponentReady,
				largePageSizeThreshold,
				lastname,
				maxSiteLimit,
				permissions,
				setConfig,
				setDisableLocalTime,
				setEmail,
				setFirstname,
				setLargePageSizeThreshold,
				setLastname,
				setRevalidateOnFocus,
				setSettings,
				settings,
				setUsername,
				state,
				user,
				userId,
				userIdApiEndpoint,
				username,
				validatingUser
			}}
		>
			<GlobalStyles />
			<DefaultSeo {...AppSeo} />
			<ProgressBar />
			<Component {...pageProps} err={err} />
		</SiteCrawlerAppContext.Provider>
	);
}
