import { useState, useEffect, Fragment } from 'react';
import { Transition } from '@tailwindui/react';
import AddSiteLabel from 'public/label/components/sites/AddSite.json';
import Cookies from 'js-cookie';
import fetchJson from 'hooks/fetchJson';
import Link from 'next/link';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import useSWR from 'swr';
import Layout from 'components/Layout';

const fetchSiteData = async (endpoint) => {
	const siteData = await fetchJson(endpoint, {
		method: 'GET',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'X-CSRFToken': Cookies.get('csrftoken')
		}
	});

	return siteData;
};

const AddSiteDiv = styled.div``;

const AddSite = () => {
	const [siteLimitCounter, setSiteLimitCounter] = useState(0);
	const [maxSiteLimit, setMaxSiteLimit] = useState(0);
	const [showErrorModal, setShowErrorModal] = useState(false);

	const { data: sites, error: sitesError } = useSWR(`/api/site/`, () =>
		fetchSiteData(`/api/site/`)
	);

	const { data: user, error: userError } = useSWR(`/api/auth/user/`, () =>
		fetchSiteData(`/api/auth/user/`)
	);

	const handleMaxSiteLimit = (e) => {
		e.preventDefault();

		setShowErrorModal(!showErrorModal);
	};

	useEffect(() => {
		if (typeof sites === 'object' && sites !== undefined && sites !== null) {
			if (typeof user === 'object' && user !== undefined && user !== null) {
				setSiteLimitCounter(sites.count);
				setMaxSiteLimit(user.group.max_sites);
			}
		}
	}, [sites, user]);

	{
		userError && <Layout>{userError.message}</Layout>;
	}
	{
		sitesError && <Layout>{sitesError.message}</Layout>;
	}

	return (
		<Fragment>
			<Transition show={showErrorModal}>
				<div
					className={`fixed z-50 bottom-0 inset-x-0 px-4 pb-4 sm:inset-0 sm:flex sm:items-center sm:justify-center`}
				>
					<Transition.Child
						enter='ease-out duration-300'
						enterFrom='opacity-0'
						enterTo='opacity-100'
						leave='ease-in duration-200'
						leaveFrom='opacity-100'
						leaveTo='opacity-100'
					>
						<div className={`fixed inset-0 transition-opacity`}>
							<div className={`absolute inset-0 bg-gray-500 opacity-75`}></div>
						</div>
					</Transition.Child>
					<span
						className={`hidden sm:inline-block sm:align-middle sm:h-screen`}
					></span>
					&#8203;
					<Transition.Child
						enter='ease-out duration-300'
						enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
						enterTo='opacity-100 translate-y-0 sm:scale-100'
						leave='ease-in duration-200'
						leaveFrom='opacity-100 translate-y-0 sm:scale-100'
						leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
					>
						<div
							className={`bg-white rounded-lg px-4 pt-5 pb-4 overflow-hidden shadow-xs-xl transform transition-all sm:max-w-lg sm:w-full sm:p-6`}
							role='dialog'
							aria-modal='true'
							aria-labelledby='modal-headline'
						>
							<div className={`sm:flex sm:items-start`}>
								<div
									className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10`}
								>
									<svg
										className={`h-6 w-6 text-yellow-600`}
										fill='none'
										viewBox='0 0 24 24'
										stroke='currentColor'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth='2'
											d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
										/>
									</svg>
								</div>
								<div
									className={`mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left`}
								>
									<h3
										className={`text-lg leading-6 font-medium text-gray-900`}
										id='modal-headline'
									>
										{AddSiteLabel[1].label}
									</h3>
									<div className={`mt-2`}>
										<p className={`text-sm leading-5 text-gray-500`}>
											{AddSiteLabel[2].label}
										</p>
									</div>
								</div>
							</div>
							<div className={`mt-5 sm:mt-4 sm:flex sm:flex-row-reverse`}>
								<span
									className={`flex w-full rounded-md shadow-xs-sm sm:ml-3 sm:w-auto`}
								>
									<Link href='/dashboard/settings/subscriptions'>
										<a
											className={`inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-yellow-600 text-base leading-6 font-medium text-white shadow-xs-sm hover:bg-yellow-500 focus:outline-none focus:border-yellow-700 focus:shadow-xs-outline-yellow transition ease-in-out duration-150 sm:text-sm sm:leading-5`}
										>
											{AddSiteLabel[4].label}
										</a>
									</Link>
								</span>
								<span
									className={`mt-3 flex w-full rounded-md shadow-xs-sm sm:mt-0 sm:w-auto`}
								>
									<button
										type='button'
										className={`inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium text-gray-700 shadow-xs-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-xs-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5`}
										onClick={() =>
											setTimeout(() => setShowErrorModal(!showErrorModal), 150)
										}
									>
										{AddSiteLabel[3].label}
									</button>
								</span>
							</div>
						</div>
					</Transition.Child>
				</div>
			</Transition>
			<AddSiteDiv className={`py-4`}>
				<div
					className={`px-4 py-5 border-b border-gray-300 sm:px-6 bg-white overflow-hidden rounded-lg sm:shadow-xs`}
				>
					<div
						className={`-ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-no-wrap`}
					>
						<div className={`ml-4 mt-2 w-full lg:w64`}>
							<div>
								<div className={`mt-1 relative rounded-md shadow-xs-sm`}>
									<div
										className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none`}
									>
										<svg
											className={`h-5 w-5 text-gray-400`}
											fill={`currentColor`}
											viewBox={`0 0 20 20`}
										>
											<path
												fillRule={`evenodd`}
												d={`M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z`}
												clipRule={`evenodd`}
											/>
										</svg>
									</div>
									<input
										id={`email`}
										className={`form-input block sm:w-full lg:w-64 pl-10 sm:text-sm sm:leading-5`}
										placeholder={`Search Sites...`}
									/>
								</div>
							</div>
						</div>
						<div className={`ml-4 mt-2 flex-shrink-0`}>
							<span className={`inline-flex rounded-md shadow-xs-sm`}>
								{siteLimitCounter === maxSiteLimit ||
								siteLimitCounter > maxSiteLimit ? (
									<button
										type={`button`}
										className={`relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600 hover:bg-green-500 focus:outline-none focus:shadow-xs-outline-green focus:border-green-700 active:bg-green-700`}
										onClick={handleMaxSiteLimit}
									>
										{AddSiteLabel[0].label}
									</button>
								) : (
									<Link href='/dashboard/sites/information'>
										<a
											className={`relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600 hover:bg-green-500 focus:outline-none focus:shadow-xs-outline-green focus:border-green-700 active:bg-green-700`}
										>
											{AddSiteLabel[0].label}
										</a>
									</Link>
								)}
							</span>
						</div>
					</div>
				</div>
			</AddSiteDiv>
		</Fragment>
	);
};

export default AddSite;

AddSite.propTypes = {};
