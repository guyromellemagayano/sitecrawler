// React
import { useState, useEffect } from "react";

// NextJS
import Link from "next/link";

// External
import { NextSeo } from "next-seo";
import { withResizeDetector } from "react-resize-detector";
import loadable from "@loadable/component";
import PropTypes from "prop-types";
import tw from "twin.macro";

// JSON
import ProfileLabel from "public/labels/components/profile/Profile.json";

// Hooks
import useUser from "src/hooks/useUser";
import { useSite } from "src/hooks/useSite";

// Layout
import Layout from "src/components/Layout";

// Components
const AppLogo = loadable(() => import("src/components/logo/AppLogo"));
const ChevronRightSvg = loadable(() => import("src/components/svg/solid/ChevronRightSvg"));
const HomeSvg = loadable(() => import("src/components/svg/solid/HomeSvg"));
const Loader = loadable(() => import("src/components/layout/Loader"));
const MainSidebar = loadable(() => import("src/components/sidebar/MainSidebar"));
const MobileSidebarButton = loadable(() => import("src/components/sidebar/MobileSidebarButton"));
const SettingsPassword = loadable(() => import("src/components/profile/Password"));
const SettingsPersonal = loadable(() => import("src/components/profile/Personal"));
const SiteFooter = loadable(() => import("src/components/footer/SiteFooter"));
const ProfileSkeleton = loadable(() => import("src/components/skeletons/ProfileSkeleton"));

const Profile = ({ width }) => {
	const [openMobileSidebar, setOpenMobileSidebar] = useState(false);
	const [siteData, setSiteData] = useState([]);
	const [userData, setUserData] = useState([]);
	const [pageLoaded, setPageLoaded] = useState(false);

	const pageTitle = "Profile Settings";
	const homeLabel = "Home";
	const homePageLink = "/";
	const sitesApiEndpoint = "/api/site/?ordering=name";

	const { user: user } = useUser({
		redirectIfFound: false,
		redirectTo: "/login"
	});

	const { site: site } = useSite({
		endpoint: sitesApiEndpoint
	});

	useEffect(() => {
		if (
			user &&
			user !== undefined &&
			Object.keys(user).length > 0 &&
			site &&
			site !== undefined &&
			Object.keys(site).length > 0
		) {
			setTimeout(() => {
				setPageLoaded(true);
			}, 500);

			setSiteData(site);
			setUserData(user);
		}
	}, [user, site]);

	return pageLoaded ? (
		<Layout user={user}>
			<NextSeo title={pageTitle} />

			<section className="h-screen flex overflow-hidden bg-white">
				<MainSidebar
					width={width}
					user={userData}
					site={siteData}
					openMobileSidebar={openMobileSidebar}
					setOpenMobileSidebar={setOpenMobileSidebar}
				/>

				<div tw="flex flex-col w-0 flex-1 overflow-hidden">
					<div tw="relative z-10 flex-shrink-0 flex h-16 lg:h-0 bg-white border-b lg:border-0 border-gray-200 lg:mb-4">
						<MobileSidebarButton openMobileSidebar={openMobileSidebar} setOpenMobileSidebar={setOpenMobileSidebar} />
						<Link href={homePageLink} passHref>
							<a tw="p-1 block w-full cursor-pointer lg:hidden">
								<AppLogo
									className={tw`mt-4 mx-auto h-8 w-auto`}
									src="/images/logos/site-logo-dark.svg"
									alt="app-logo"
								/>
							</a>
						</Link>
					</div>

					<main tw="flex-1 relative z-0 overflow-y-auto focus:outline-none" tabIndex="0">
						<div tw="w-full p-6 mx-auto grid gap-16 lg:grid-cols-3 lg:col-gap-5 lg:row-gap-12 min-h-screen">
							<div tw="lg:col-span-2 xl:col-span-2 xl:pr-8 xl:border-r xl:border-gray-200">
								{pageLoaded ? (
									<div className="max-w-full py-4 px-8">
										<nav tw="flex pt-4 pb-8" aria-label="Breadcrumb">
											<ol tw="flex items-center space-x-4">
												<li>
													<div>
														<Link href={homePageLink} passHref>
															<a tw="text-gray-400 hover:text-gray-500">
																<HomeSvg className={tw`flex-shrink-0 h-5 w-5`} />
																<span tw="sr-only">{homeLabel}</span>
															</a>
														</Link>
													</div>
												</li>
												<li>
													<div tw="flex items-center">
														<ChevronRightSvg className={tw`flex-shrink-0 h-5 w-5 text-gray-400`} />
														<p aria-current="page" tw="cursor-default ml-4 text-sm font-medium text-gray-700">
															{pageTitle}
														</p>
													</div>
												</li>
											</ol>
										</nav>
										<div className="pt-4 m-auto">
											<h4 className="text-2xl leading-6 font-medium text-gray-900">{ProfileLabel[0].label}</h4>
										</div>
									</div>
								) : (
									<ProfileSkeleton />
								)}

								<div tw="space-y-12 divide-y divide-gray-200">
									<SettingsPersonal user={userData} />
									<SettingsPassword user={userData} />
								</div>
							</div>
						</div>
						<div tw="static bottom-0 w-full mx-auto px-12 py-4 bg-white border-t border-gray-200">
							<SiteFooter />
						</div>
					</main>
				</div>
			</section>
		</Layout>
	) : (
		<Loader />
	);
};

Profile.propTypes = {};

export default withResizeDetector(Profile);
