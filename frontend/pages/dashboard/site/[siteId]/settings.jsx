// React
import Breadcrumbs from "@components/breadcrumbs";
import MobileSidebarButton from "@components/buttons/MobileSidebarButton";
import { Layout } from "@components/layouts";
import Footer from "@components/layouts/Footer";
import Sidebar from "@components/layouts/Sidebar";
// Components
import { AppLogo } from "@components/logos/AppLogo";
import DeleteSiteSettings from "@components/settings/DeleteSiteSettings";
import LargePageSizeSettings from "@components/settings/LargePageSizeSettings";
import SiteInformationSettings from "@components/settings/SiteInformationSettings";
import { SitesApiEndpoint } from "@enums/ApiEndpoints";
// Enums
import { GlobalLabels, SiteLogoDark } from "@enums/GlobalValues";
import { LoginLink, SitesLink } from "@enums/PageLinks";
import { SettingsLabels } from "@enums/SettingsLabels";
// Hooks
import { useComponentVisible } from "@hooks/useComponentVisible";
import { useSite, useSiteId } from "@hooks/useSite";
import useUser from "@hooks/useUser";
import { NextSeo } from "next-seo";
// NextJS
import Link from "next/link";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
// External
import "twin.macro";

const SiteSettings = ({ result }) => {
	const [componentReady, setComponentReady] = useState(false);

	const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);

	const { user, mutateUser } = useUser({
		redirectIfFound: false,
		redirectTo: LoginLink
	});

	const { mutateSite } = useSite({
		endpoint: SitesApiEndpoint
	});

	const { siteId, mutateSiteId } = useSiteId({
		querySid: result?.siteId,
		redirectIfFound: false,
		redirectTo: SitesLink
	});

	const homePageLink = `/site/${result?.siteId}`;
	const pageTitle = SettingsLabels[1].label + " - " + siteId?.name;

	useEffect(() => {
		user && siteId ? setComponentReady(true) : setComponentReady(false);

		return { user, siteId };
	}, [user, siteId]);

	return (
		<Layout user={user}>
			<NextSeo title={pageTitle} />

			<section tw="h-screen flex overflow-hidden bg-white">
				<Sidebar ref={ref} user={user} openSidebar={isComponentVisible} setOpenSidebar={setIsComponentVisible} />

				<div tw="flex flex-col w-0 flex-1 overflow-hidden">
					<div tw="relative flex-shrink-0 flex">
						<div tw="border-b flex-shrink-0 flex">
							<MobileSidebarButton openSidebar={isComponentVisible} setOpenSidebar={setIsComponentVisible} />
						</div>

						<Link href={homePageLink} passHref>
							<a tw="p-1 block w-full cursor-pointer lg:hidden">
								<AppLogo
									tw="w-48 h-auto"
									src={SiteLogoDark}
									alt={GlobalLabels[0].label}
									width={GlobalLabels[0].width}
									height={GlobalLabels[0].height}
								/>
							</a>
						</Link>
					</div>

					<Scrollbars universal>
						<main tw="flex-1 relative z-0 max-w-screen-2xl mx-auto overflow-y-auto focus:outline-none" tabIndex="0">
							<div tw="max-w-full p-4 sm:px-6 md:px-8">
								<div tw="w-full py-6 mx-auto grid gap-16 lg:grid-cols-3 lg:gap-x-5 lg:gap-y-12">
									<div tw="lg:col-span-2 xl:col-span-2 xl:pr-8 xl:border-r xl:border-gray-200">
										<div tw="max-w-full p-4">
											<Breadcrumbs isOther pageTitle={pageTitle} siteId={result?.siteId} />

											<div tw="pt-4 m-auto">
												<h2 tw="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">{pageTitle}</h2>
											</div>
										</div>

										<div tw="space-y-12 divide-y divide-gray-200">
											<SiteInformationSettings
												componentReady={componentReady}
												mutateSite={mutateSite}
												mutateSiteId={mutateSiteId}
												siteId={siteId}
											/>
											<LargePageSizeSettings
												componentReady={componentReady}
												mutateSite={mutateSite}
												mutateUser={mutateUser}
												mutateSiteId={mutateSiteId}
												siteId={siteId}
												user={user}
											/>
											<DeleteSiteSettings componentReady={componentReady} mutateSite={mutateSite} siteId={siteId} />
										</div>
									</div>
								</div>

								<div tw="static bottom-0 w-full mx-auto p-4 border-t border-gray-200 bg-white">
									<Footer />
								</div>
							</div>
						</main>
					</Scrollbars>
				</div>
			</section>
		</Layout>
	);
};

SiteSettings.propTypes = {
	siteId: PropTypes.number
};

SiteSettings.defaultProps = {
	siteId: null
};

export default SiteSettings;

export async function getServerSideProps(ctx) {
	return {
		props: {
			result: ctx.query
		}
	};
}
