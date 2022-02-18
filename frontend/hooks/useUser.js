import { UserApiEndpoint } from "@constants/ApiEndpoints";
import { SiteCrawlerAppContext } from "@pages/_app";
import { handleConversionStringToBoolean } from "@utils/convertCase";
import { useContext, useMemo, useState } from "react";
import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle the user information
 *
 * @param {object} options
 * @returns {object} user, errorUser, validatingUser
 */
export const useUser = (options = null) => {
	const [userIdApiEndpoint, setUserIdApiEndpoint] = useState(null);
	const [disableLocalTime, setDisableLocalTime] = useState(false);
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

	// Custom context
	const { setConfig: setUserConfig } = useContext(SiteCrawlerAppContext);

	// SWR hook
	const { data: user, error: errorUser, isValidating: validatingUser } = useMainSWRConfig(UserApiEndpoint, options);

	useMemo(() => {
		if (errorUser) {
			// Show alert message after failed `user` SWR hook fetch
			errorUser
				? setUserConfig({
						isUser: true,
						method: errorUser?.config?.method ?? null,
						status: errorUser?.status ?? null
				  })
				: null;
		}
	}, [errorUser]);

	useMemo(() => {
		if (user?.data) {
			// Update `settings` user setting
			if (user.data?.settings) {
				if (
					Object.prototype.hasOwnProperty.call(user.data.settings, "disableLocalTime") &&
					handleConversionStringToBoolean(user.data.settings?.disableLocalTime)
				) {
					setDisableLocalTime(handleConversionStringToBoolean(user.data.settings.disableLocalTime));
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
	}, [user]);

	return {
		disableLocalTime,
		email,
		errorUser,
		firstname,
		group,
		largePageSizeThreshold,
		lastname,
		maxSiteLimit,
		permissions,
		setUserConfig,
		setDisableLocalTime,
		setEmail,
		setFirstname,
		setLargePageSizeThreshold,
		setLastname,
		setSettings,
		settings,
		setUsername,
		user,
		userId,
		userIdApiEndpoint,
		username
	};
};
