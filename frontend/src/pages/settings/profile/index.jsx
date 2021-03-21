// React
import { useState, useEffect } from 'react';

// NextJS
import Link from 'next/link';

// External
import { NextSeo } from 'next-seo';
import loadable from '@loadable/component';
import PropTypes from 'prop-types';
import tw from 'twin.macro';

// JSON
import ProfileLabel from 'public/labels/components/profile/Profile.json';

// Contexts
import { useAuth } from 'src/contexts/auth';

// Layout
import Layout from 'src/components/Layout';

// Components
const ChevronRightSvg = loadable(() =>
	import('src/components/svg/ChevronRightSvg')
);
const HomeSvg = loadable(() => import('src/components/svg/HomeSvg'));
const MainSidebar = loadable(() =>
	import('src/components/sidebar/MainSidebar')
);
const MenuSvg = loadable(() => import('src/components/svg/MenuSvg'));
const MobileSidebar = loadable(() =>
	import('src/components/sidebar/MobileSidebar')
);
const ProfileSettingsPassword = loadable(() =>
	import('src/components/profile/Password')
);
const ProfileSettingsPersonal = loadable(() =>
	import('src/components/profile/Personal')
);
const ProfileSettingsSubscription = loadable(() =>
	import('src/components/profile/Subscription')
);
const ProfileSidebarSkeleton = loadable(() =>
	import('src/components/skeletons/ProfileSidebarSkeleton')
);
const ProfileSettingsSkeleton = loadable(() =>
	import('src/components/skeletons/ProfileSettingsSkeleton')
);
const SiteFooter = loadable(() => import('src/components/footer/SiteFooter'));

const Profile = () => {
	const [openMobileSidebar, setOpenMobileSidebar] = useState(false);
	const [pageLoaded, setPageLoaded] = useState(false);

	const pageTitle = 'Profile Settings';
	const homeLabel = 'Home';
	const homePageLink = '/dashboard/sites';

	const { user } = useAuth();

	useEffect(() => {
		if (user && user !== undefined) {
			setTimeout(() => {
				setPageLoaded(true);
			}, 500);
		}
	}, [user]);

	return (
		<Layout>
			<NextSeo title={pageTitle} />

			<section className='h-screen flex overflow-hidden bg-white'>
				{/* FIXME: fix mobile sidebar */}
				{/* <MobileSidebar show={openMobileSidebar} setShow={setOpenMobileSidebar} /> */}
				<MainSidebar />

				<div tw='flex flex-col w-0 flex-1 overflow-hidden'>
					<div tw='md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3'>
						<button
							tw='-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:bg-gray-200 transition ease-in-out duration-150'
							onClick={() =>
								setTimeout(() => setOpenMobileSidebar(!openMobileSidebar), 150)
							}
						>
							<span tw='sr-only'>Open sidebar</span>
							<MenuSvg className={tw`h-6 w-6`} />
						</button>
					</div>
					<main
						tw='flex-1 h-screen relative z-0 overflow-y-auto focus:outline-none'
						tabIndex='0'
					>
						<div tw='w-full p-6 mx-auto grid gap-16 lg:grid-cols-3 lg:col-gap-5 lg:row-gap-12 min-h-screen'>
							<div tw='lg:col-span-2 xl:col-span-2 xl:pr-8 xl:border-r xl:border-gray-200'>
								{pageLoaded ? (
									<>
										<div className='max-w-full py-4 px-8'>
											<nav tw='flex pt-4 pb-8' aria-label='Breadcrumb'>
												<ol tw='flex items-center space-x-4'>
													<li>
														<div>
															<Link href={homePageLink} passHref>
																<a tw='text-gray-400 hover:text-gray-500'>
																	<HomeSvg
																		className={tw`flex-shrink-0 h-5 w-5`}
																	/>
																	<span tw='sr-only'>{homeLabel}</span>
																</a>
															</Link>
														</div>
													</li>
													<li>
														<div tw='flex items-center'>
															<ChevronRightSvg
																className={tw`flex-shrink-0 h-5 w-5 text-gray-400`}
															/>
															<p
																aria-current='page'
																tw='cursor-default ml-4 text-sm font-medium text-gray-700'
															>
																{pageTitle}
															</p>
														</div>
													</li>
												</ol>
											</nav>
											<div className='pt-4 m-auto'>
												<h4 className='text-2xl leading-6 font-medium text-gray-900'>
													{ProfileLabel[0].label}
												</h4>
											</div>
										</div>
										<div tw='space-y-12 divide-y divide-gray-200'>
											<ProfileSettingsPersonal />
											<ProfileSettingsPassword />
											{/* <ProfileSettingsSubscription /> */}
										</div>
									</>
								) : (
									<ProfileSettingsSkeleton />
								)}
							</div>
						</div>
						<div tw='static bottom-0 w-full mx-auto px-12 py-4 bg-white border-t border-gray-200'>
							<SiteFooter />
						</div>
					</main>
				</div>
			</section>
		</Layout>
	);
};

Profile.propTypes = {};

export default Profile;
