// React
import React, { useEffect, useState } from 'react';

// NextJS
import { useRouter } from 'next/router';

// External
import 'core-js';
import { NextSeo } from 'next-seo';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// Hooks
import usePostMethod from 'src/hooks/usePostMethod';

// Components
import Layout from 'src/components/Layout';

const LogoutDiv = styled.div``;

const sleep = async (ms) => await new Promise((r) => setTimeout(r, ms));

const Logout = () => {
	const [logoutDetail, setLogoutDetail] = useState(null);

	const pageTitle = 'Logout';
	const logoutApiEndpoint = '/api/auth/logout/';
	const loginApiEndpoint = '/';

	const router = useRouter();

	useEffect(() => {
		(async () => {
			await sleep(500);

			const response = await usePostMethod(logoutApiEndpoint, 'POST');
			const data = await response.data;

			if (response.statusText === 'OK' && response.status === 200) {
				if (data) {
					setLogoutDetail(data.detail);

					window.setTimeout(() => {
						router.push(loginApiEndpoint);
					}, 1500);
				}
			} else {
				const error = new Error(response.statusText);

				error.response = response;
				error.data = data;

				throw error;
			}
		})();
	});

	return (
		<Layout>
			<NextSeo title={pageTitle} />

			<LogoutDiv className="bg-white p-3">
				<p className="text-2xl font-bold leading-7 text-gray-900 sm:text-1xl sm:leading-9 sm:truncate">
					{logoutDetail}
				</p>
			</LogoutDiv>
		</Layout>
	);
};

Logout.propTypes = {
	logoutDetail: PropTypes.string
};

export default Logout;
