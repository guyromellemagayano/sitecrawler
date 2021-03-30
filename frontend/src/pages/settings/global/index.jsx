// React
import { useState, useEffect } from "react";

// NextJS
import Link from "next/link";

// External
import { NextSeo } from "next-seo";
import loadable from "@loadable/component";
import PropTypes from "prop-types";
import tw from "twin.macro";

// JSON
import GlobalLabel from "public/labels/components/global/Global.json";

// Utils
import { getCookie } from "src/utils/cookie";

// Hooks
import useUser from "src/hooks/useUser";
import { useSite } from "src/hooks/useSite";

// Layout
import Layout from "src/components/Layout";

// Components
const LargePageSizeSettings = loadable(() => import("src/components/settings/LargePageSize"));
const ChevronRightSvg = loadable(() => import("src/components/svg/ChevronRightSvg"));
const HomeSvg = loadable(() => import("src/components/svg/HomeSvg"));
const MainSidebar = loadable(() => import("src/components/sidebar/MainSidebar"));
const MobileSidebar = loadable(() => import("src/components/sidebar/MobileSidebar"));
const MobileSidebarButton = loadable(() => import("src/components/sidebar/MobileSidebarButton"));
const ProfileSkeleton = loadable(() => import("src/components/skeletons/ProfileSkeleton"));
const SiteFooter = loadable(() => import("src/components/footer/SiteFooter"));
const TimestampSettings = loadable(() => import("src/components/settings/Timestamp"));

const GlobalSettings = ({ token }) => {
	const [openMobileSidebar, setOpenMobileSidebar] = useState(false);
	const [siteData, setSiteData] = useState([]);
	const [userData, setUserData] = useState([]);
	const [pageLoaded, setPageLoaded] = useState(false);

	const pageTitle = "Global Settings";
	const homeLabel = "Home";
	const homePageLink = "/";
	const sitesApiEndpoint = "/api/site/?ordering=name";

	const { user: user, error: userError } = useUser();
	const { site: site, siteError: siteError } = useSite({
		endpoint: sitesApiEndpoint,
	});

	useEffect(() => {
		if (
			user &&
			user !== undefined &&
			Object.keys(user).length > 0 &&
			site &&
			site !== undefined &&
			Object.keys(site).length > 0 &&
			token &&
			token !== undefined &&
			token !== ""
		) {
			setTimeout(() => {
				setPageLoaded(true);
			}, 500);

			setSiteData(site);
			setUserData(user);
		}
	}, [user, site, token]);

	return (
		<Layout user={user}>
			<NextSeo title={pageTitle} />

			<section tw="h-screen flex overflow-hidden bg-white">
				{/* FIXME: fix mobile sidebar */}
				{/* <MobileSidebar show={openMobileSidebar} setShow={setOpenMobileSidebar} /> */}
				<MainSidebar user={userData} site={siteData} />

				<div tw="flex flex-col w-0 flex-1 overflow-hidden">
					<div tw="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
						<MobileSidebarButton openMobileSidebar={openMobileSidebar} setOpenMobileSidebar={setOpenMobileSidebar} />
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
											<h4 className="text-2xl leading-6 font-medium text-gray-900">{GlobalLabel[0].label}</h4>
										</div>
									</div>
								) : (
									<ProfileSkeleton />
								)}

								<div tw="space-y-12 divide-y divide-gray-200">
									<TimestampSettings user={userData} />
									<LargePageSizeSettings user={userData} site={siteData} />
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
	);
};

export default GlobalSettings;

GlobalSettings.propTypes = {};

export async function getServerSideProps({ req }) {
	let token = getCookie("token", req);

	if (!token) {
		return {
			notFound: true,
		};
	}

	return {
		props: {
			token: token,
		},
	};
}
