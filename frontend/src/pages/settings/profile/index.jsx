// React
import * as React from "react";

// NextJS
import Link from "next/link";

// External
import { NextSeo } from "next-seo";
import { withResizeDetector } from "react-resize-detector";
import loadable from "@loadable/component";
import PropTypes from "prop-types";
import tw, { styled } from "twin.macro";

// JSON
import ProfileLabel from "public/labels/components/profile/Profile.json";

// Hooks
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
const Loader = loadable(() => import("src/components/layouts/Loader"));
const SettingsPassword = loadable(() => import("src/components/pages/settings/profile/Password"));
const SettingsPersonal = loadable(() => import("src/components/pages/settings/profile/Personal"));

const ProfileSection = styled.section``;

const Profile = ({ width }) => {
	const [componentReady, setComponentReady] = React.useState(false);
	const [openMobileSidebar, setOpenMobileSidebar] = React.useState(false);

	const homePageLink = "/sites/";
	const pageTitle = ProfileLabel[0].label;

	const { user } = useUser({
		redirectIfFound: false,
		redirectTo: "/login"
	});

	React.useEffect(() => {
		setComponentReady(false);

		setTimeout(() => {
			setComponentReady(true);
		}, 500);
	}, []);

	return user ? (
		<Layout user={user}>
			<NextSeo title={pageTitle} />

			<ProfileSection className="h-screen flex overflow-hidden bg-white">
				<MainSidebar
					width={width}
					user={user}
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
										className={tw`mt-4 mx-auto h-8 w-auto`}
										src="/images/logos/site-logo-dark.svg"
										alt="app-logo"
									/>
								</a>
							</Link>
						</div>

						<main tw="flex-1 relative z-0 overflow-y-auto focus:outline-none" tabIndex="0">
							<div tw="max-w-full p-4 sm:px-6 md:px-8">
								<div tw="w-full py-6 mx-auto grid gap-16 lg:grid-cols-3 lg:gap-x-5 lg:gap-y-12">
									<div tw="lg:col-span-2 xl:col-span-2 xl:pr-8 xl:border-r xl:border-gray-200">
										<div tw="max-w-full p-4">
											<Breadcrumbs isOther pageTitle={pageTitle} />

											<div tw="pt-4 m-auto">
												<h2 tw="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">{pageTitle}</h2>
											</div>
										</div>

										<div tw="space-y-12 divide-y divide-gray-200">
											<SettingsPersonal user={user} />
											<SettingsPassword user={user} />
										</div>
									</div>
								</div>

								<div tw="static bottom-0 w-full mx-auto p-4 bg-white border-t border-gray-200">
									<SiteFooter />
								</div>
							</div>
						</main>
					</div>
				) : (
					<div tw="mx-auto">
						<Loader />
					</div>
				)}
			</ProfileSection>
		</Layout>
	) : (
		<Loader />
	);
};

Profile.propTypes = {};

export default withResizeDetector(Profile);
