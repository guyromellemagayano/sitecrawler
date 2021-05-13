// React
import { useState, useEffect, useRef } from "react";

// NextJS
import { useRouter } from "next/router";
import Link from "next/link";

// External
import { XIcon } from "@heroicons/react/solid";
import { Transition } from "@headlessui/react";
import loadable from "@loadable/component";
import PropTypes from "prop-types";
import tw from "twin.macro";

// JSON
import PrimaryMenuLabel from "public/labels/components/sidebar/PrimaryMenu.json";

// Hooks
import { useSite } from "src/hooks/useSite";

// Components
const AppLogo = loadable(() => import("src/components/logos/AppLogo"));
const PrimaryMenu = loadable(() => import("src/components/menus/PrimaryMenu"));
const ProfileMenu = loadable(() => import("src/components/menus/ProfileMenu"));
const SettingsMenu = loadable(() => import("src/components/menus/SettingsMenu"));
const SiteMenu = loadable(() => import("src/components/menus/SiteMenu"));

const MainSidebar = ({ width, user, crawlFinished, openMobileSidebar, setOpenMobileSidebar }) => {
	const [selectedMenu, setSelectedMenu] = useState("");

	let lgScreenBreakpoint = 1024;
	let siteApiEndpoint = "/api/site/?ordering=name";
	let siteDashboardLink = "/";

	const router = useRouter();
	const ref = useRef(null);

	const { site: site } = useSite({
		endpoint: siteApiEndpoint
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
			switch (true) {
				case router.pathname.includes("/site"):
					setSelectedMenu(<SiteMenu user={user} crawlFinished={crawlFinished} site={site} />);
					break;
				case router.pathname.includes("/settings"):
					setSelectedMenu(<SettingsMenu user={user} site={site} />);
					break;
				default:
					setSelectedMenu(<PrimaryMenu user={user} site={site} />);
					break;
			}
		}
	}, [router, user, site]);

	const handleHideSidebarMenu = (event) => {
		if (event.key === "Escape") {
			setOpenMobileSidebar(false);
		}
	};

	const handleClickOutsideSidebarMenu = (event) => {
		if (ref.current && !ref.current.contains(event.target)) {
			setOpenMobileSidebar(false);
		}
	};

	useEffect(() => {
		document.addEventListener("keydown", handleHideSidebarMenu, true);
		document.addEventListener("click", handleClickOutsideSidebarMenu, true);

		return () => {
			document.removeEventListener("keydown", handleHideSidebarMenu, true);
			document.removeEventListener("click", handleClickOutsideSidebarMenu, true);
		};
	});

	return width < lgScreenBreakpoint ? (
		<Transition show={openMobileSidebar}>
			<div tw="fixed inset-0 flex z-40 lg:hidden" role="dialog" aria-modal="true">
				<Transition.Child
					enter="transition-opacity ease-linear duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="transition-opacity ease-linear duration-300"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div tw="fixed inset-0 bg-gray-600 bg-opacity-75" aria-hidden="true"></div>
				</Transition.Child>

				<Transition.Child
					enter="transition ease-in-out duration-300 transform"
					enterFrom="-translate-x-full"
					enterTo="translate-x-0"
					leave="transition ease-in-out duration-300 transform"
					leaveFrom="translate-x-0"
					leaveTo="-translate-x-full"
				>
					<div tw="relative flex-1 flex flex-col w-64 bg-gray-1000">
						<Transition.Child
							enter="ease-in-out duration-300"
							enterFrom="opacity-0"
							enterTo="opacity-100"
							leave="ease-in-out duration-300"
							leaveFrom="opacity-100"
							leaveTo="opacity-0"
						>
							<div tw="absolute top-0 right-0 -mr-12 pt-2">
								<button
									tw="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
									onClick={() => setOpenMobileSidebar(false)}
								>
									<span tw="sr-only">{PrimaryMenuLabel[4].label}</span>
									<XIcon tw="h-6 w-6 text-white" />
								</button>
							</div>

							<div ref={ref} tw="flex flex-col w-64 h-screen">
								<div tw="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
									<div tw="flex items-center flex-shrink-0 flex-row px-3 h-16">
										<Link href={siteDashboardLink} passHref>
											<a tw="p-1 block w-full cursor-pointer">
												<AppLogo className={tw`h-8 w-auto`} src="/images/logos/site-logo-white.svg" alt="app-logo" />
											</a>
										</Link>
									</div>
									{selectedMenu}
								</div>

								<ProfileMenu />
							</div>
						</Transition.Child>
					</div>
				</Transition.Child>
			</div>
		</Transition>
	) : (
		<aside tw="hidden lg:flex lg:flex-shrink-0 bg-gray-1000">
			<div tw="flex flex-col w-64">
				<div tw="flex flex-col h-0 flex-1 pt-5 pb-4 overflow-y-auto">
					<div tw="flex items-center flex-shrink-0 flex-row px-3 h-16">
						<Link href={siteDashboardLink} passHref>
							<a tw="p-1 block w-full cursor-pointer">
								<AppLogo className={tw`h-8 w-auto`} src="/images/logos/site-logo-white.svg" alt="app-logo" />
							</a>
						</Link>
					</div>
					{selectedMenu}
				</div>

				<ProfileMenu />
			</div>
		</aside>
	);
};

MainSidebar.propTypes = {};

export default MainSidebar;
