// React
import * as React from "react";

// NextJS
import { useRouter } from "next/router";

// External
import "twin.macro";
import { Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/solid";
import PropTypes from "prop-types";

// Enums
import { SiteApiEndpoint } from "@enums/ApiEndpoints";
import { LgScreenBreakpoint, EndpointRefreshInterval } from "@enums/GlobalValues";
import { SidebarMenuLabels } from "@enums/SidebarMenuLabels";

// Hooks
import { useSite } from "@hooks/useSite";

// Components
import PrimaryMenu from "@components/menus/PrimaryMenu";
import ProfileMenu from "@components/menus/ProfileMenu";
import SettingsMenu from "@components/menus/SettingsMenu";
import SiteMenu from "@components/menus/SiteMenu";

const Sidebar = React.forwardRef(({ user, openSidebar, setOpenSidebar }, ref) => {
	const [selectedMenu, setSelectedMenu] = React.useState(null);

	const router = useRouter();

	const siteApiEndpoint = `${SiteApiEndpoint}?ordering=name&per_page=100`;

	const { site } = useSite({
		endpoint: siteApiEndpoint,
		refreshInterval: EndpointRefreshInterval
	});

	React.useEffect(() => {
		switch (true) {
			case router.pathname.includes("/site/"):
				setSelectedMenu(<SiteMenu site={site} siteId={parseInt(router?.query?.siteId)} />);
				break;
			case router.pathname.includes("/settings/"):
				setSelectedMenu(<SettingsMenu user={user} site={site} />);
				break;
			default:
				setSelectedMenu(<PrimaryMenu site={site} />);
				break;
		}

		return selectedMenu;
	}, [router, site, user]);

	return (
		<>
			<Transition show={openSidebar} tw="flex lg:hidden flex-shrink-0">
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
						<div ref={ref} className="bg-gray-1000" tw="relative flex-1 flex flex-col w-64">
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
										onClick={() => setOpenSidebar(!openSidebar)}
									>
										<span tw="sr-only">{SidebarMenuLabels[0].label}</span>
										<XIcon tw="h-6 w-6 text-white" />
									</button>
								</div>

								<div tw="flex flex-col w-64 h-screen">
									<div tw="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">{selectedMenu}</div>

									<ProfileMenu user={user} />
								</div>
							</Transition.Child>
						</div>
					</Transition.Child>
				</div>
			</Transition>

			<aside className="bg-gray-1000" tw="hidden lg:flex lg:flex-shrink-0">
				<div tw="flex flex-col w-64">
					<div tw="h-0 flex-1 overflow-y-auto">{selectedMenu}</div>

					<ProfileMenu user={user} />
				</div>
			</aside>
		</>
	);
});

Sidebar.propTypes = {
	openSidebar: PropTypes.bool,
	setOpenSidebar: PropTypes.func,
	user: PropTypes.object
};

Sidebar.defaultProps = {
	openSidebar: null,
	setOpenSidebar: null,
	user: null
};

export default Sidebar;
