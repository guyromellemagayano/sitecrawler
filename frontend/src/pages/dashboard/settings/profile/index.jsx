import { useState, Fragment } from 'react';
import Head from 'next/head';
import Layout from 'components/Layout';
import MainSidebar from 'components/sidebar/MainSidebar';
import MobileSidebar from 'components/sidebar/MobileSidebar';
import ProfileSettingsPassword from 'components/profile/Password';
import ProfileSettingsPersonal from 'components/profile/Personal';
import ProfileSettingsSubscription from 'components/profile/Subscription';
import PropTypes from 'prop-types';
import SiteFooter from 'components/footer/SiteFooter';
import styled from 'styled-components';
import useUser from 'hooks/useUser';

const ProfileDiv = styled.section``;

const Profile = () => {
	const [openMobileSidebar, setOpenMobileSidebar] = useState(false);
	const pageTitle = 'Account Details';

	const { user: user, userError: userError } = useUser({
		redirectTo: '/',
		redirectIfFound: false
	});

	{
		userError && <Layout>{userError.message}</Layout>;
	}

	return (
		<Layout>
			{user ? (
				<Fragment>
					<Head>
						<title>{pageTitle}</title>
					</Head>

					<ProfileDiv className={`h-screen flex overflow-hidden bg-gray-200`}>
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
								className={`flex-1 relative z-0 overflow-y-auto pt-2 pb-6 focus:outline-none md:py-6`}
								tabIndex={`0`}
							>
								<div
									className={`max-w-full mx-auto px-4 md:py-4 sm:px-6 md:px-8`}
								>
									<h1 className={`text-2xl font-semibold text-gray-900`}>
										{pageTitle}
									</h1>
								</div>
								<div className={`max-w-2xl px-4 py-4 sm:px-6 md:px-8`}>
									<ProfileSettingsPersonal />
									<ProfileSettingsPassword />
									<ProfileSettingsSubscription />
								</div>

								<div
									className={`static bottom-0 w-full mx-auto px-4 sm:px-6 py-4`}
								>
									<SiteFooter />
								</div>
							</main>
						</div>
					</ProfileDiv>
				</Fragment>
			) : null}
		</Layout>
	);
};

export default Profile;

Profile.propTypes = {
	openMobileSidebar: PropTypes.bool,
	pageTitle: PropTypes.string
};
