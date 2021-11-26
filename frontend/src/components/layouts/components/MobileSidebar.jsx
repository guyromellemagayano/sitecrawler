import ProfileMenu from "@components/menus/ProfileMenu";
import MainMenu from "@components/menus/SiteMenu";
import { Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/solid";
import useTranslation from "next-translate/useTranslation";
import { memo, forwardRef } from "react";
import "twin.macro";

/**
 * Memoized function for `MobileSidebar` component.
 */
const MobileSidebar = memo(
	forwardRef(({ openSidebar, setOpenSidebar }, ref) => {
		// Translations
		const { t } = useTranslation();
		const closeSidebar = t("sidebar:closeSidebar");

		return (
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
										<span tw="sr-only">{closeSidebar}</span>
										<XIcon tw="h-6 w-6 text-white" />
									</button>
								</div>

								<div tw="flex flex-col w-64 h-screen">
									<div tw="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
										<MainMenu />
									</div>

									<ProfileMenu />
								</div>
							</Transition.Child>
						</div>
					</Transition.Child>
				</div>
			</Transition>
		);
	})
);

export default MobileSidebar;
