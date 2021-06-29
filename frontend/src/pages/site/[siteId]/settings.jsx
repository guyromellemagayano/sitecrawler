// React
import * as React from "react";

// NextJS
import Link from "next/link";

// External
import tw from "twin.macro";
import { NextSeo } from "next-seo";
import { Scrollbars } from "react-custom-scrollbars-2";
import { withResizeDetector } from "react-resize-detector";
import loadable from "@loadable/component";
import PropTypes from "prop-types";

// JSON
import SettingsLabel from "public/labels/pages/settings/settings.json";

// Hooks
import { useSite, useSiteId } from "src/hooks/useSite";
import useUser from "src/hooks/useUser";

// Layout
import Layout from "src/components/Layout";

// Components
import AppLogo from "src/components/logos/AppLogo";
import MainSidebar from "src/components/sidebar/MainSidebar";
import MobileSidebarButton from "src/components/buttons/MobileSidebarButton";
import SiteFooter from "src/components/layouts/Footer";

// Loadable
const Breadcrumbs = loadable(() => import("src/components/breadcrumbs/Breadcrumbs"));
const DeleteSiteSettings = loadable(() => import("src/components/pages/settings/site/DeleteSite"));
const LargePageSizeSettings = loadable(() => import("src/components/pages/settings/site/LargePageSize"));
const Loader = loadable(() => import("src/components/layouts/Loader"));
const SiteInformationSettings = loadable(() => import("src/components/pages/settings/site/SiteInformation"));

const SiteSettings = ({ width, result }) => {
	const [componentReady, setComponentReady] = React.useState(false);
	const [openMobileSidebar, setOpenMobileSidebar] = React.useState(false);

	const appLogoAltText = "app-logo";
	const sitesApiEndpoint = `/api/site/?ordering=name`;

	const { user } = useUser({
		redirectIfFound: false,
		redirectTo: "/login"
	});

	const { mutateSite } = useSite({
		endpoint: sitesApiEndpoint
	});

	const { siteId, mutateSiteId } = useSiteId({
		querySid: result?.siteId
	});

	const homePageLink = `/site/${result?.siteId}/overview`;
	const pageTitle = SettingsLabel[1].label + " - " + siteId?.name;

	React.useEffect(() => {
		user !== undefined && siteId !== undefined
			? (() => {
					setTimeout(() => {
						setComponentReady(true);
					}, 500);
			  })()
			: null;

		return setComponentReady(false);
	}, [user, siteId]);

	return (
		<Layout user={componentReady ? user : null}>
			<NextSeo title={componentReady ? pageTitle : null} />

			<section tw="h-screen flex overflow-hidden bg-white">
				<MainSidebar
					width={width}
					user={componentReady ? user : null}
					openMobileSidebar={openMobileSidebar}
					setOpenMobileSidebar={setOpenMobileSidebar}
				/>

				{componentReady ? (
					<div tw="flex flex-col w-0 flex-1 overflow-hidden">
						<div tw="relative flex-shrink-0 flex bg-white">
							<div tw="border-b flex-shrink-0 flex">
								<MobileSidebarButton
									openMobileSidebar={openMobileSidebar}
									setOpenMobileSidebar={setOpenMobileSidebar}
								/>
							</div>

							<Link href={homePageLink} passHref>
								<a tw="p-1 block w-full cursor-pointer lg:hidden">
									<AppLogo
										className={tw`w-48 h-auto`}
										src="/images/logos/site-logo-dark.svg"
										alt={appLogoAltText}
										width={230}
										height={40}
									/>
								</a>
							</Link>
						</div>

						<Scrollbars universal>
							<main tw="flex-1 relative z-0 overflow-y-auto focus:outline-none" tabIndex="0">
								<div tw="max-w-full p-4 sm:px-6 md:px-8">
									<div tw="w-full py-6 mx-auto grid gap-16 lg:grid-cols-3 lg:gap-x-5 lg:gap-y-12">
										<div tw="lg:col-span-2 xl:col-span-2 xl:pr-8 xl:border-r xl:border-gray-200">
											<div tw="max-w-full p-4">
												<Breadcrumbs siteId={result?.siteId} pageTitle={SettingsLabel[1].label} />

												<div tw="pt-4 m-auto">
													<h2 tw="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
														{SettingsLabel[1].label}
													</h2>
												</div>
											</div>

											<div tw="space-y-12 divide-y divide-gray-200">
												<SiteInformationSettings
													user={componentReady ? user : null}
													siteId={componentReady ? siteId : null}
													settingsLabel={SettingsLabel}
												/>
												<LargePageSizeSettings
													user={componentReady ? user : null}
													siteId={componentReady ? siteId : null}
													mutateSiteId={mutateSiteId}
												/>
												<DeleteSiteSettings
													user={componentReady ? user : null}
													siteId={componentReady ? siteId : null}
													settingsLabel={SettingsLabel}
													mutateSite={mutateSite}
												/>
											</div>
										</div>
									</div>

									<div tw="static bottom-0 w-full mx-auto p-4 border-t border-gray-200 bg-white">
										<SiteFooter />
									</div>
								</div>
							</main>
						</Scrollbars>
					</div>
				) : (
					<div tw="mx-auto">
						<Loader />
					</div>
				)}
			</section>
		</Layout>
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
