// React
import React, { useState, useEffect } from 'react';

// NextJS
import Link from 'next/link';

// External
import { NextSeo } from 'next-seo';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// JSON
import ConfirmEmailLabel from 'public/label/pages/confirm-email.json';

// Hooks
import usePostMethod from 'src/hooks/usePostMethod';

// Components
import Layout from 'src/components/Layout';

const ConfirmEmailDiv = styled.div``;

const ConfirmEmail = () => {
	const [success, setSuccess] = useState(false);
	const [errorMsg, setErrorMsg] = useState('');
	const [successMsg, setSuccessMsg] = useState('');

	const pageTitle = 'Confirm Email';
	const confirmEmailApiEndpoint = '/api/auth/registration/verify-email/';

	const handlePageRefresh = (e) => {
		e.preventDefault();

		location.reload();
	};

	const handleSendPostRequest = async (data) => {
		const response = await usePostMethod(confirmEmailApiEndpoint, data);

		if (Math.floor(response.status / 200) === 1) {
			setSuccess(!success);
			setSuccessMsg(ConfirmEmailLabel[0].label);
		} else {
			setErrorMsg(ConfirmEmailLabel[1].label);
		}
	};

	useEffect(() => {
		let pathArray = window.location.pathname.split('/');
		let secondLevelLocation = pathArray[2];

		if (errorMsg) setErrorMsg('');
		if (successMsg) setSuccessMsg('');

		const body = {
			key: secondLevelLocation
		};

		handleSendPostRequest(body);
	}, []);

	return (
		<Layout>
			<NextSeo title={pageTitle} />

			<ConfirmEmailDiv
				className={`min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8`}
			>
				<div className={`sm:mx-auto sm:w-full sm:max-w-md`}>
					<div className={`bg-white shadow-xs rounded-lg`}>
						<div className={`px-4 py-5 sm:p-6`}>
							<h3 className={`text-lg leading-6 font-medium text-gray-900`}>
								{ConfirmEmailLabel[2].label} {success ? 'Success' : 'Failed'}
							</h3>
							<div className={`mt-2 max-w-xl text-sm leading-5 text-gray-500`}>
								{successMsg && <p>{successMsg}</p>}
								{errorMsg && <p>{errorMsg}</p>}
							</div>

							{successMsg ? (
								<div className={`mt-5`}>
									<Link href="/">
										<a
											type="button"
											className={`relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600 hover:bg-green-500 focus:outline-none focus:shadow-xs-outline-green focus:border-green-700 active:bg-green-700`}
										>
											{ConfirmEmailLabel[3].label}
										</a>
									</Link>
								</div>
							) : (
								<div className={`mt-5`}>
									<button
										type="button"
										className={`relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-red-600 hover:bg-red-500 focus:outline-none focus:shadow-xs-outline-red focus:border-red-700 active:bg-red-700`}
										onClick={handlePageRefresh}
									>
										{ConfirmEmailLabel[4].label}
									</button>
								</div>
							)}
						</div>
					</div>
				</div>
			</ConfirmEmailDiv>
		</Layout>
	);
};

ConfirmEmail.propTypes = {};

export default ConfirmEmail;
