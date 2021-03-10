// React
import React, { createContext, useState, useContext, useEffect } from 'react';

// NextJS
import { useRouter } from 'next/router';

// External
import axios from 'axios';
import Cookies from 'js-cookie';
import PropTypes from 'prop-types';
import useSWR from 'swr';

// Hooks
import useFetcher from 'src/hooks/useFetcher';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [state, setState] = useState({
		redirectIfFound: false
	});

	const userApiEndpoint = '/api/auth/user';

	const router = useRouter();
	const { data: user, mutate: mutateUser, error: userError } = useSWR(
		userApiEndpoint,
		useFetcher
	);

	useEffect(() => {
		(async () => {
			if (userError === 'Error 403') {
				router.push({ pathname: '/', query: { redirect: '/' } });
				Cookies.set('errLogin', 'You must log in to access the page!', {
					expires: 60
				});
			}
		})();
	}, [user, state, userError]);

	const handleLogin = async (data) => {
		if (data) {
			if (data.key) {
				Cookies.set('token', data.key, { expires: 60 });
				axios.defaults.headers.common = {
					Authorization: `Bearer ${data.key}`
				};
			}

			mutateUser(data);

			if (user) {
				setState({ redirectIfFound: true });
				router.push('/dashboard/sites', undefined, { shallow: true });
			}
		}
	};

	const handleLogout = async (data) => {
		if (data.detail) {
			Cookies.remove('token');
			delete axios.defaults.headers.Authorization;
			window.location.pathname = '/';
			router.replace('/', undefined, { shallow: true });
		}
	};

	return (
		<AuthContext.Provider
			value={{
				isAuthenticated: !!user,
				user,
				mutateUser,
				userError,
				handleLogin,
				handleLogout
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => useContext(AuthContext);
