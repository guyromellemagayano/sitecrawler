import { UserApiEndpoint } from "@constants/ApiEndpoints";
import { SiteCrawlerAppContext } from "@pages/_app";
import { handleConversionStringToBoolean } from "@utils/convertCase";
import { useContext, useMemo, useState } from "react";
import { useMainSWRConfig } from "./useMainSWRConfig";

/**
 * SWR React hook that will handle the user information
 *
 * @param {object} options
 * @returns {object} disableLocalTime, email, errorUser, firstname, group, largePageSizeThreshold, lastname, maxSiteLimit, permissions, setDisableLocalTime, setEmail, setFirstname, setLargePageSizeThreshold, setLastname, setSettings, settings, setUsername, user, id, userIdApiEndpoint, username
 */
export const useUser = (fallback = null, options = null) => {
	const [userIdApiEndpoint, setUserIdApiEndpoint] = useState(null);
	const [disableLocalTime, setDisableLocalTime] = useState(false);
	const [largePageSizeThreshold, setLargePageSizeThreshold] = useState(0);
	const [maxSiteLimit, setMaxSiteLimit] = useState(0);
	const [id, setId] = useState(0);
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [firstname, setFirstname] = useState("");
	const [lastname, setLastname] = useState("");
	const [permissions, setPermissions] = useState([]);
	const [group, setGroup] = useState({});
	const [settings, setSettings] = useState({});

	// Custom context
	const { setConfig: setUserConfig } = useContext(SiteCrawlerAppContext);

	// Custom variables
	const currentEndpoint = fallback !== null ? fallback : UserApiEndpoint;

	// SWR hook
	const { data: user, error: errorUser, isValidating: validatingUser } = useMainSWRConfig(currentEndpoint, options);

	useMemo(async () => {
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

	useMemo(async () => {
		if (Math.round(user?.status / 100) === 2 && user?.data && !user?.data?.detail) {
			if (user.data?.settings) {
				if (
					Object.prototype.hasOwnProperty.call(user.data.settings, "disableLocalTime") &&
					handleConversionStringToBoolean(user.data.settings?.disableLocalTime)
				) {
					setDisableLocalTime(handleConversionStringToBoolean(user.data.settings.disableLocalTime));
				}

				setSettings(user.data.settings);
			}

			if (user.data?.group?.max_sites) {
				setMaxSiteLimit(user.data.group.max_sites);
			}

			if (user.data?.id) {
				setUserIdApiEndpoint(`${UserApiEndpoint + user.data.id}`);
				setId(user.data.id);
			}

			if (user.data?.username) {
				setUsername(user.data.username);
			}

			if (user.data?.email) {
				setEmail(user.data.email);
			}

			if (user.data?.first_name) {
				setFirstname(user.data.first_name);
			}

			if (user.data?.last_name) {
				setLastname(user.data.last_name);
			}

			if (user.data?.permissions) {
				setPermissions(user.data.permissions);
			}

			if (user.data?.group) {
				setGroup(user.data.group);
			}

			if (user.data?.large_page_size_threshold) {
				setLargePageSizeThreshold(user.data.large_page_size_threshold);
			}
		}

		return {
			disableLocalTime,
			maxSiteLimit,
			userIdApiEndpoint,
			id,
			username,
			email,
			firstname,
			lastname,
			group,
			settings,
			permissions,
			largePageSizeThreshold
		};
	}, [
		user,
		disableLocalTime,
		maxSiteLimit,
		userIdApiEndpoint,
		id,
		username,
		email,
		firstname,
		lastname,
		group,
		settings,
		permissions,
		largePageSizeThreshold
	]);

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
		setDisableLocalTime,
		setEmail,
		setFirstname,
		setLargePageSizeThreshold,
		setLastname,
		setSettings,
		settings,
		setUsername,
		user,
		id,
		userIdApiEndpoint,
		username,
		setUserConfig
	};
};
