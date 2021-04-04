// React
import { useState } from "react";

// NextJS
import Link from "next/link";
import { useRouter } from "next/router";

// External
import { Transition } from "@headlessui/react";
import loadable from "@loadable/component";
import PropTypes from "prop-types";
import tw from "twin.macro";

// Components
const AppLogo = loadable(() => import("src/components/logo/AppLogo"));
const MobilePrimaryMenu = loadable(() => import("src/components/sidebar/MobilePrimaryMenu"));
const MobileSettingsMenu = loadable(() => import("src/components/sidebar/MobileSettingsMenu"));
const MobileSiteMenu = loadable(() => import("src/components/sidebar/MobileSiteMenu"));
const ProfileSidebar = loadable(() => import("src/components/profile/Sidebar"));
const XSvg = loadable(() => import("src/components/svg/solid/XSvg"));

const MobileSidebar = ({ show, setShow }) => {
	const siteDashboardLink = "/dashboard/sites";

	const router = useRouter();

	return (
		<Transition show={show}>
			<aside tw="lg:hidden">
				<div tw="fixed inset-0 flex z-40">
					<Transition.Child
						enter="transition-opacity ease-linear duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="transition-opacity ease-linear duration-300"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div tw="fixed inset-0" aria-hidden="true">
							<div tw="absolute inset-0 bg-gray-1000 opacity-75"></div>
						</div>
						<Transition.Child
							enter="transition ease-in-out duration-300 transform"
							enterFrom="-translate-x-full"
							enterTo="translate-x-0"
							leave="transition ease-in-out duration-300 transform"
							leaveFrom="translate-x-0"
							leaveTo="-translate-x-full"
						>
							<div tw="relative flex-1 flex flex-col w-64 h-screen bg-gray-1000">
								<div tw="absolute top-0 right-0 -mr-12 pt-2">
									<button
										tw="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
										onClick={() => setShow(!show)}
									>
										<span tw="sr-only">Close sidebar</span>
										<XSvg className={tw`h-6 w-6 text-white`} />
									</button>
								</div>
								<div tw="flex flex-col h-0 flex-1 pt-5 pb-4 overflow-y-auto">
									<div tw="flex items-center flex-shrink-0 flex-row px-3 h-16">
										<Link href={siteDashboardLink}>
											<a tw="p-1 block w-full cursor-pointer">
												<AppLogo className={tw`h-8 w-auto`} src="/images/logos/site-logo-white.svg" alt="app-logo" />
											</a>
										</Link>
									</div>
									{router.pathname.includes("/dashboard/sites") ? (
										<MobilePrimaryMenu />
									) : router.pathname.includes("/dashboard/site") ? (
										<MobileSiteMenu crawlableHandler={props.crawlableHandler} />
									) : (
										<MobileSettingsMenu />
									)}
								</div>

								<ProfileSidebar />
							</div>
						</Transition.Child>
						<div tw="flex-shrink-0 w-14">{/* Force sidebar to shrink to fit close icon */}</div>
					</Transition.Child>
				</div>
			</aside>
		</Transition>
	);
};

MobileSidebar.propTypes = {};

export default MobileSidebar;
