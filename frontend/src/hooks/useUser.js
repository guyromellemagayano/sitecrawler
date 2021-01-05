// React
import React, { useEffect } from 'react';

// NextJS
import Router, { useRouter } from 'next/router';

// External
import 'core-js';
import PropTypes from 'prop-types';
import useSWR from 'swr';

// Hooks
import useFetcher from 'src/hooks/useFetcher';

const sleep = async (ms) => await new Promise((r) => setTimeout(r, ms));

const useUser = async ({ redirectTo, redirectIfFound }) => {
	const userApiEndpoint = '/api/auth/user/';

	const { asPath } = useRouter();

	const { data: user, mutate: mutateUser, error: userError } = useSWR(
		userApiEndpoint,
		useFetcher
	);

	useEffect(() => {
		(async () => {
			await sleep(500);

			if (userError == 'Error: 403' && !redirectIfFound) {
				Router.push({ pathname: redirectTo, query: { redirect: asPath } });
				Cookies.set('errLogin', 'You must log in to access the page!', {
					expires: new Date(new Date().getTime() + 0.05 * 60 * 1000) // expires in 3s
				});
			}

			if (user && redirectIfFound) {
				if ('key' in user) {
					Router.push(redirectTo);
				}
			} else {
				return;
			}
		})();
	}, [user, redirectIfFound, redirectTo, userError]);

	return { user, mutateUser, userError };
};

useUser.propTypes = {
	user: PropTypes.object.isRequired,
	redirectIfFound: PropTypes.boolean,
	redirectTo: PropTypes.boolean,
	userError: PropTypes.object
};

useUser.defaultProps = {
	redirectTo: false,
	redirectIfFound: false
};

export default useUser;
