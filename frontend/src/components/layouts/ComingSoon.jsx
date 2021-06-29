// React
import * as React from "react";

// NextJS
import Link from "next/link";

// External
import loadable from "@loadable/component";
import tw from "twin.macro";

// JSON
import ComingSoonLabel from "public/labels/components/layout/ComingSoon.json";

// Components
import AppLogo from "src/components/logos/AppLogo";
import MainSidebar from "src/components/sidebar/MainSidebar";
import MobileSidebarButton from "src/components/buttons/MobileSidebarButton";
import SiteFooter from "src/components/layouts/Footer";

// Loadable
const Breadcrumbs = loadable(() => import("src/components/breadcrumbs/Breadcrumbs"));
const Loader = loadable(() => import("src/components/layouts/Loader"));

const ComingSoon = ({ width, user, pageTitle, openMobileSidebar, setOpenMobileSidebar }) => {
	const [componentReady, setComponentReady] = React.useState(false);

	const appLogoAltText = "app-logo";
	const homePageLink = "/sites/";

	React.useEffect(() => {
		setTimeout(() => {
			setComponentReady(true);
		}, 500);

		return setComponentReady(false);
	}, []);

	return (
		<>
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
							<MobileSidebarButton openMobileSidebar={openMobileSidebar} setOpenMobileSidebar={setOpenMobileSidebar} />
						</div>

						<Link href={homePageLink} passHref>
							<a tw="p-1 block w-full cursor-pointer lg:hidden">
								<AppLogo
									className={tw`w-48 mt-4 h-auto`}
									src="/images/logos/site-logo-dark.svg"
									alt={appLogoAltText}
									width={230}
									height={40}
								/>
							</a>
						</Link>
					</div>

					<main tw="flex-1 relative z-0 overflow-y-auto focus:outline-none" tabIndex="0">
						<div tw="max-w-full p-4 sm:px-6 md:px-8">
							<div tw="w-full py-6 mx-auto grid gap-16 lg:grid-cols-3 lg:gap-x-5 lg:gap-y-12">
								<div tw="max-w-full p-4">
									<Breadcrumbs isOther pageTitle={pageTitle} />

									<div tw="pt-4 m-auto">
										<h2 tw="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
											{ComingSoonLabel[0].label}
										</h2>
									</div>
								</div>

								<div tw="space-y-12 divide-y divide-gray-200">{/* Place Content Here */}</div>
							</div>

							<div tw="static bottom-0 w-full mx-auto p-4 border-t border-gray-200 bg-white">
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
		</>
	);
};

ComingSoon.propTypes = {};

export default ComingSoon;
