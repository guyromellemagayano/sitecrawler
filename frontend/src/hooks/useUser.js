// React
import { useEffect } from "react";

// NextJS
import Router, { useRouter } from "next/router";

// External
import Cookies from "js-cookie";
import PropTypes from "prop-types";
import useSWR from "swr";

// Hooks
import useFetcher from "src/hooks/useFetcher";

const sleep = async (ms) => await new Promise((r) => setTimeout(r, ms));

const useUser = ({ redirectTo, redirectIfFound, token }) => {
	const userApiEndpoint = "/api/auth/user/";

	const { asPath } = useRouter();

	const { data: user, mutate: mutateUser, error: userError } = useSWR(userApiEndpoint, useFetcher, {
		onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
			if (error.status === 404) return;
			if (key === "/api/auth/user") return;
			if (retryCount >= 10) return;

			setTimeout(() => revalidate({ retryCount: retryCount + 1 }), 3000);
		},
	});

	useEffect(() => {
		(async () => {
			await sleep(500);

			if (userError && userError.status === 403 && !redirectIfFound) {
				Router.push(redirectTo);
				Cookies.set("errLogin", "You must log in to access the page!", {
					expires: new Date(new Date().getTime() + 0.05 * 60 * 1000), // expires in 3s
				});
			}

			if (user && user !== undefined && Object.keys(user).length > 0 && redirectIfFound) {
				if (token && token !== undefined && token !== "") {
					Router.push(redirectTo);
				}
			} else {
				return;
			}
		})();
	}, [user, userError, redirectIfFound, redirectTo, token]);

	return { user, mutateUser, userError };
};

useUser.defaultProps = {
	token: "",
	redirectTo: false,
	redirectIfFound: false,
};

useUser.propTypes = {
	token: PropTypes.string,
	redirectIfFound: PropTypes.boolean,
	redirectTo: PropTypes.boolean,
};

export default useUser;
