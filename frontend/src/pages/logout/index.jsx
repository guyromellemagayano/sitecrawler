// React
import React, { useEffect, useState } from 'react';

// External
import { NextSeo } from 'next-seo';
import PropTypes from 'prop-types';
import 'twin.macro';

// Hooks
import usePostMethod from 'src/hooks/usePostMethod';

// Contexts
import { useAuth } from 'src/contexts/auth';

// Components
import Layout from 'src/components/Layout';

const Logout = () => {
	const [logoutDetail, setLogoutDetail] = useState(null);

	const pageTitle = 'Logout';
	const logoutApiEndpoint = '/api/auth/logout/';

	const { logout } = useAuth();

	useEffect(() => {
		(async () => {
			const response = await usePostMethod(logoutApiEndpoint);

			if (Math.floor(response.status / 200) === 1) {
				setLogoutDetail(response.data.detail);

				setTimeout(async () => {
					logout(response.data);
				}, 1500);
			} else {
				if (response.data) {
					// FIXME: Django exception error in response.data.detail
					console.error(response.data.detail);
				}
			}
		})();
	});

	return (
		<Layout>
			<NextSeo title={pageTitle} />

			<div tw="bg-white p-3">
				<p tw="text-2xl font-bold leading-7 text-gray-900 sm:text-xl sm:leading-9 sm:truncate">
					{logoutDetail}
				</p>
			</div>
		</Layout>
	);
};

Logout.propTypes = {};

export default Logout;
