// React
import * as React from "react";

// NextJS
import Link from "next/link";

// External
import "twin.macro";
import PropTypes from "prop-types";

// Enums
import { ComingSoonLabels } from "@enums/ComingSoonLabels";
import { GlobalLabels, SiteLogoDark } from "@enums/GlobalValues";
import { SitesLink } from "@enums/PageLinks";

// Components
import AppLogo from "@components/logos/AppLogo";
import Breadcrumbs from "@components/breadcrumbs";
import Footer from "@components/layouts/Footer";
import MobileSidebarButton from "src/components/buttons/MobileSidebarButton";

const ComingSoon = ({ pageTitle, openMobileSidebar, setOpenMobileSidebar }) => {
	return (
		<div tw="flex flex-col w-0 flex-1 overflow-hidden">
			<div tw="relative flex-shrink-0 flex bg-white">
				<div tw="border-b flex-shrink-0 flex">
					<MobileSidebarButton
						openSidebar={openMobileSidebar}
						setOpenSidebar={setOpenMobileSidebar}
					/>
				</div>

				<Link href={SitesLink} passHref>
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

			<main
				tw="flex-1 relative z-0 max-w-screen-2xl mx-auto overflow-y-auto focus:outline-none"
				tabIndex="0"
			>
				<div tw="max-w-full p-4 sm:px-6 md:px-8">
					<div tw="w-full py-6 mx-auto grid gap-16 lg:grid-cols-3 lg:gap-x-5 lg:gap-y-12">
						<div tw="max-w-full p-4">
							<Breadcrumbs isOther pageTitle={pageTitle} />

							<div tw="pt-4 m-auto">
								<h2 tw="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
									{ComingSoonLabels[0].label}
								</h2>
							</div>
						</div>

						<div tw="space-y-12 divide-y divide-gray-200">{/* Place Content Here */}</div>
					</div>

					<div tw="static bottom-0 w-full mx-auto p-4 border-t border-gray-200 bg-white">
						<Footer />
					</div>
				</div>
			</main>
		</div>
	);
};

ComingSoon.propTypes = {
	openMobileSidebar: PropTypes.bool,
	pageTitle: PropTypes.string,
	setOpenMobileSidebar: PropTypes.func
};

ComingSoon.defaultProps = {
	openMobileSidebar: false,
	pageTitle: null,
	setOpenMobileSidebar: null
};

export default ComingSoon;
