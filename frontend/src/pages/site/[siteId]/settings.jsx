// React
import { useState, useEffect } from "react";

// NextJS
import { useRouter } from "next/router";
import Link from "next/link";

// External
import { ChevronRightIcon, HomeIcon } from "@heroicons/react/solid";
import { NextSeo } from "next-seo";
import { withResizeDetector } from "react-resize-detector";
import loadable from "@loadable/component";
import PropTypes from "prop-types";
import tw from "twin.macro";

// JSON
import SettingsLabel from "public/labels/pages/settings/settings.json";

// Hooks
import { useSite, useSiteId } from "src/hooks/useSite";
import useUser from "src/hooks/useUser";

// Layout
import Layout from "src/components/Layout";

// Components
const AppLogo = loadable(() => import("src/components/logos/AppLogo"));
const DeleteSiteSettings = loadable(() => import("src/components/pages/settings/site/DeleteSite"));
const LargePageSizeSettings = loadable(() => import("src/components/pages/settings/site/LargePageSize"));
const Loader = loadable(() => import("src/components/layouts/Loader"));
const MainSidebar = loadable(() => import("src/components/sidebar/MainSidebar"));
const MobileSidebarButton = loadable(() => import("src/components/sidebar/MobileSidebarButton"));
const ProfileSkeleton = loadable(() => import("src/components/skeletons/ProfileSkeleton"));
const SiteFooter = loadable(() => import("src/components/layouts/Footer"));
const SiteInformationSettings = loadable(() => import("src/components/pages/settings/site/SiteInformation"));

const SiteSettings = ({ width, result }) => {
	const [openMobileSidebar, setOpenMobileSidebar] = useState(false);
	const [pageLoaded, setPageLoaded] = useState(false);
	const [siteData, setSiteData] = useState([]);
	const [siteIdData, setSiteIdData] = useState([]);
	const [userData, setUserData] = useState([]);

	const pageTitle =
		siteIdData.name && siteIdData.name !== undefined
			? SettingsLabel[1].label + " - " + siteIdData.name
			: SettingsLabel[1].label;
	const homeLabel = "Home";
	const homePageLink = `/site/${result.siteId}/overview`;
	const sitesApiEndpoint = `/api/site/?ordering=name`;

	const { user: user } = useUser({
		redirectIfFound: false,
		redirectTo: "/login"
	});

	const { site: site } = useSite({
		endpoint: sitesApiEndpoint
	});

	const { siteId: siteId } = useSiteId({
		querySid: result.siteId
	});

	useEffect(() => {
		if (
			user &&
			user !== undefined &&
			Object.keys(user).length > 0 &&
			site &&
			site !== undefined &&
			Object.keys(site).length > 0 &&
			siteId &&
			siteId !== undefined &&
			Object.keys(siteId).length > 0
		) {
			setSiteData(site);
			setUserData(user);
			setSiteIdData(siteId);

			setTimeout(() => {
				setPageLoaded(true);
			}, 500);
		}
	}, [user, site, siteId]);

	return pageLoaded ? (
		<Layout user={user}>
			<NextSeo title={pageTitle} />

			<section tw="h-screen flex overflow-hidden bg-white">
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
						<div tw="w-full p-6 mx-auto grid gap-16 lg:grid-cols-3 lg:col-gap-5 lg:row-gap-12">
							<div tw="lg:col-span-2 xl:col-span-2 xl:pr-8 xl:border-r xl:border-gray-200">
								{pageLoaded ? (
									<div className="max-w-full py-4 px-8">
										<nav tw="flex pt-4 pb-8" aria-label="Breadcrumb">
											<ol tw="flex items-center space-x-4">
												<li>
													<div>
														<Link href={homePageLink} passHref>
															<a tw="text-gray-400 hover:text-gray-500">
																<HomeIcon tw="flex-shrink-0 h-5 w-5" />
																<span tw="sr-only">{homeLabel}</span>
															</a>
														</Link>
													</div>
												</li>
												<li>
													<div tw="flex items-center">
														<ChevronRightIcon tw="flex-shrink-0 h-5 w-5 text-gray-400" />
														<p aria-current="page" tw="cursor-default ml-4 text-sm font-medium text-gray-700">
															{pageTitle}
														</p>
													</div>
												</li>
											</ol>
										</nav>
										<div className="pt-4 m-auto">
											<h4 className="text-2xl leading-6 font-medium text-gray-900">{pageTitle}</h4>
										</div>
									</div>
								) : (
									<ProfileSkeleton />
								)}

								<div tw="space-y-12 divide-y divide-gray-200">
									<SiteInformationSettings user={userData} siteId={siteIdData} settingsLabel={SettingsLabel} />
									<LargePageSizeSettings user={userData} siteId={siteIdData} querySiteId={result.siteId} />
									<DeleteSiteSettings user={userData} siteId={siteIdData} settingsLabel={SettingsLabel} />
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

SiteSettings.propTypes = {};

export default withResizeDetector(SiteSettings);

export async function getServerSideProps(ctx) {
	return {
		props: {
			result: ctx.query
		}
	};
}
