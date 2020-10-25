import { useState, useEffect } from 'react';
import AddSiteLabel from 'public/label/components/sites/AddSite.json';
import Cookies from 'js-cookie';
import fetchJson from 'hooks/fetchJson';
import Link from 'next/link';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import useSWR from 'swr';

const AddSiteDiv = styled.div``;

const AddSite = () => {
	const [siteLimitCounter, setSiteLimitCounter] = useState(0);
	const [maxSiteLimit, setMaxSiteLimit] = useState(0);
	const basicAccountSiteLimit = 3;
	const proAccountSiteLimit = 15;
	const agencyAccountSiteLimit = 100;

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

	const { data: sites } = useSWR(`/api/site/`, () =>
		fetchSiteData(`/api/site/`)
	);

	const { data: user } = useSWR(`/api/auth/user/`, () =>
		fetchSiteData(`/api/auth/user/`)
	);

	useEffect(() => {
		if (sites !== '' && sites !== undefined) {
			if (user !== '' && user !== undefined) {
				setSiteLimitCounter(sites.count);

				if (user.group.max_sites === basicAccountSiteLimit) {
					setMaxSiteLimit(basicAccountSiteLimit);
				} else if (user.group.max_sites === proAccountSiteLimit) {
					setMaxSiteLimit(proAccountSiteLimit);
				} else {
					setMaxSiteLimit(agencyAccountSiteLimit);
				}
			}
		}
	}, [sites, user]);

	return (
		<AddSiteDiv className={`py-4`}>
			<div
				className={`bg-white px-4 py-5 border-b border-gray-300 sm:px-6 bg-white overflow-hidden rounded-lg sm:shadow-xs`}
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
							{siteLimitCounter < maxSiteLimit ? (
								<Link href='/dashboard/sites/information'>
									<a
										aria-disabled='false'
										className={`relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600 hover:bg-green-500 focus:outline-none focus:shadow-xs-outline-green focus:border-green-700 active:bg-green-700`}
									>
										{AddSiteLabel[0].label}
									</a>
								</Link>
							) : (
								<Link href='/dashboard/sites/information'>
									<a
										aria-disabled='true'
										disabled={`disabled`}
										className={`relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600 opacity-50 cursor-not-allowed`}
									>
										{AddSiteLabel[1].label}
									</a>
								</Link>
							)}
						</span>
					</div>
				</div>
			</div>
		</AddSiteDiv>
	);
};

export default AddSite;

AddSite.propTypes = {};
