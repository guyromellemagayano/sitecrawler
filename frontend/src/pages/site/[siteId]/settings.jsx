import { Fragment, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import fetchJson from 'hooks/fetchJson';
import Head from 'next/head';
import Layout from 'components/Layout';
import Link from 'next/link';
import MainSidebar from 'components/sidebar/MainSidebar';
import MobileSidebar from 'components/sidebar/MobileSidebar';
import SettingsLabel from 'public/labels/pages/site/settings.json';
import SiteFooter from 'components/footer/SiteFooter';
import tw from 'twin.macro';
import PropTypes from 'prop-types';
import useSWR from 'swr';
import useUser from 'hooks/useUser';
import SiteInformationSettings from 'components/settings/SiteInformation';
import DeleteSiteSettings from 'components/settings/DeleteSite';
import LargePageSizeSettings from 'components/settings/LargePageSize';

const SiteSettingsDiv = styled.section``;

const SiteSettings = () => {
	const [openMobileSidebar, setOpenMobileSidebar] = useState(false);
	const [siteName, setSiteName] = useState('');

	const { query, asPath } = useRouter();
	const pageTitle = 'Site Settings |';

	const fetchSiteSettings = async (endpoint) => {
		const siteSettingsData = await fetchJson(endpoint, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'X-CSRFToken': Cookies.get('csrftoken')
			}
		});

		return siteSettingsData;
	};

	const fetchUserSettings = async (endpoint) => {
		const userSettingsData = await fetchJson(endpoint, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'X-CSRFToken': Cookies.get('csrftoken')
			}
		});

		return userSettingsData;
	};

	const { user: user, userError: userError } = useUser({
		redirectTo: '/',
		redirectIfFound: false
	});

	const { data: siteSettings, error: siteSettingsError } = useSWR(
		() => (query.siteId ? `/api/site/${query.siteId}/` : null),
		() => fetchSiteSettings(`/api/site/${query.siteId}/`)
	);

	const { data: userSettings, error: userSettingsError } = useSWR(
		() => '/api/auth/user/',
		() => fetchUserSettings(`/api/auth/user/`)
	);

	useEffect(() => {
		if (
			typeof siteSettings === 'object' &&
			siteSettings !== undefined &&
			siteSettings !== null
		) {
			setSiteName(siteSettings.name);
		}
	}, [siteSettings]);

	{
		userError && <Layout>{userError.message}</Layout>;
	}
	{
		siteSettingsError && <Layout>{siteSettingsError.message}</Layout>;
	}
	{
		userSettingsError && <Layout>{userSettingsError.message}</Layout>;
	}

	return (
		<Layout>
			{user && userSettings && siteSettings ? (
				<Fragment>
					<Head>
						<title>
							{pageTitle} {siteName}
						</title>
					</Head>

					<SiteSettingsDiv
						className={`h-screen flex overflow-hidden bg-gray-200`}
					>
						<MobileSidebar show={openMobileSidebar} />
						<MainSidebar />

						<div className={`flex flex-col w-0 flex-1 overflow-hidden`}>
							<div className={`md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3`}>
								<button
									className={`-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:bg-gray-200 transition ease-in-out duration-150`}
									aria-label={`Open sidebar`}
									onClick={() =>
										setTimeout(
											() => setOpenMobileSidebar(!openMobileSidebar),
											150
										)
									}
								>
									<svg
										className={`h-6 w-5`}
										stroke={`currentColor`}
										fill={`none`}
										viewBox={`0 0 24 24`}
									>
										<path
											strokeLinecap={`round`}
											strokeLinejoin={`round`}
											strokeWidth={`2`}
											d={`M4 6h16M4 12h16M4 18h16`}
										/>
									</svg>
								</button>
							</div>
							<main
								className={`flex-1 relative z-0 overflow-y-auto focus:outline-none`}
								tabIndex={`0`}
							>
								<div
									className={`max-w-full mx-auto px-4 md:py-4 sm:px-6 md:px-8`}
								>
									<div>
										<nav className={`sm:hidden`}>
											<Link
												href={'/dashboard/site/' + query.siteId + '/overview'}
											>
												<a
													className={`flex items-center text-sm leading-5 font-medium text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out`}
												>
													<svg
														className={`flex-shrink-0 -ml-1 mr-1 h-5 w-5 text-gray-400`}
														viewBox='0 0 20 20'
														fill='currentColor'
													>
														<path
															fillRule='evenodd'
															d='M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z'
															clipRule='evenodd'
														/>
													</svg>
													{SettingsLabel[0].label}
												</a>
											</Link>
										</nav>
										<nav
											className={`hidden sm:flex items-center text-sm leading-5`}
										>
											<Link
												href={'/dashboard/site/' + query.siteId + '/overview'}
											>
												<a
													className={`font-normal text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out`}
												>
													{siteName}
												</a>
											</Link>
											<svg
												className={`flex-shrink-0 mx-2 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor`}
											>
												<path
													fillRule='evenodd'
													d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
													clipRule='evenodd'
												/>
											</svg>
											<Link
												href={'/dashboard/site/' + query.siteId + '/settings'}
											>
												<a
													className={`font-medium text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out`}
												>
													{SettingsLabel[1].label}
												</a>
											</Link>
										</nav>
									</div>
									<div
										className={`mt-2 md:flex md:items-center md:justify-between`}
									>
										<div className={`flex-1 min-w-0`}>
											<h2
												className={`text-2xl font-bold leading-7 text-gray-900 sm:leading-9 sm:truncate`}
											>
												{SettingsLabel[1].label} - {siteName}
											</h2>
										</div>
									</div>
								</div>
								<div className={`max-w-2xl px-4 py-4 sm:px-6 md:px-8`}>
									<SiteInformationSettings
										siteData={siteSettings}
										queryData={query}
										settingsLabelData={SettingsLabel}
									/>
									<LargePageSizeSettings
										userData={userSettings}
										siteData={siteSettings}
										querySiteId={query.siteId}
										pathData={asPath}
									/>
									<DeleteSiteSettings
										querySiteId={query.siteId}
										settingsLabelData={SettingsLabel}
									/>
								</div>

								<div
									className={`static bottom-0 w-full mx-auto px-4 sm:px-6 py-4`}
								>
									<SiteFooter />
								</div>
							</main>
						</div>
					</SiteSettingsDiv>
				</Fragment>
			) : null}
		</Layout>
	);
};

export default SiteSettings;

SiteSettings.propTypes = {
	openMobileSidebar: PropTypes.bool,
	pageTitle: PropTypes.string,
	fetchSiteSettings: PropTypes.func
};
