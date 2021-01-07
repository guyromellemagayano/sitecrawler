// React
import React, { useState } from 'react';

// External
import { NextSeo } from 'next-seo';
import PropTypes from 'prop-types';
import styled from 'styled-components';

// Hooks
import useUser from 'src/hooks/useUser';

// Components
import Layout from 'src/components/Layout';
import MainSidebar from 'src/components/sidebar/MainSidebar';
import MobileSidebar from 'src/components/sidebar/MobileSidebar';
import ProfileSettingsPassword from 'src/components/profile/Password';
import ProfileSettingsPersonal from 'src/components/profile/Personal';
import ProfileSettingsSubscription from 'src/components/profile/Subscription';
import SiteFooter from 'src/components/footer/SiteFooter';

const ProfileDiv = styled.section``;

const Profile = () => {
	const [openMobileSidebar, setOpenMobileSidebar] = useState(false);

	const pageTitle = 'Account Details';

	const { user: user } = useUser({
		redirectTo: '/',
		redirectIfFound: false
	});

	return (
		<Layout>
			{user ? (
				<>
					<NextSeo title={pageTitle} />

					<ProfileDiv className="h-screen flex overflow-hidden bg-gray-200">
						<MobileSidebar show={openMobileSidebar} />
						<MainSidebar />

						<div className="flex flex-col w-0 flex-1 overflow-hidden">
							<div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
								<button
									className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:bg-gray-200 transition ease-in-out duration-150"
									aria-label="Open sidebar"
									onClick={() =>
										setTimeout(
											() => setOpenMobileSidebar(!openMobileSidebar),
											150
										)
									}
								>
									<svg
										className="h-6 w-5"
										stroke="currentColor"
										fill="none"
										viewBox="0 0 24 24"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth="2"
											d="M4 6h16M4 12h16M4 18h16"
										/>
									</svg>
								</button>
							</div>
							<main
								className="flex-1 relative z-0 overflow-y-auto pt-2 pb-6 focus:outline-none md:py-6"
								tabIndex="0"
							>
								<div className="max-w-full mx-auto px-4 md:py-4 sm:px-6 md:px-8">
									<h1 className="text-2xl font-semibold text-gray-900">
										{pageTitle}
									</h1>
								</div>
								<div className="max-w-2xl px-4 py-4 sm:px-6 md:px-8">
									<ProfileSettingsPersonal />
									<ProfileSettingsPassword />
									<ProfileSettingsSubscription />
								</div>

								<div className="static bottom-0 w-full mx-auto px-4 sm:px-6 py-4">
									<SiteFooter />
								</div>
							</main>
						</div>
					</ProfileDiv>
				</>
			) : null}
		</Layout>
	);
};

Profile.propTypes = {
	openMobileSidebar: PropTypes.bool,
	pageTitle: PropTypes.string
};

export default Profile;
