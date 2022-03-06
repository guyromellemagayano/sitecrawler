import { MemoizedMainMenu } from "@components/menus/MainMenu";
import { MemoizedProfileMenu } from "@components/menus/ProfileMenu";
import { Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/solid";
import useTranslation from "next-translate/useTranslation";
import { forwardRef, memo } from "react";

/**
 * Custom function to render the `MobileSidebarLayout` component
 *
 * @param {boolean} openSidebar
 * @param {function} setOpenSidebar
 */
const MobileSidebarLayout = ({ openSidebar = false, setOpenSidebar }, ref) => {
	// Translations
	const { t } = useTranslation("sidebar");
	const closeSidebar = t("closeSidebar");

	return (
		<Transition show={openSidebar} className="flex flex-shrink-0 lg:hidden">
			<div ref={ref} className="fixed inset-0 z-50 flex lg:hidden" role="dialog" aria-modal="true">
				<Transition.Child
					enter="transition-opacity ease-linear duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="transition-opacity ease-linear duration-300"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<div className="fixed inset-0 bg-gray-600 bg-opacity-75" aria-hidden="true"></div>
				</Transition.Child>

				<Transition.Child
					enter="transition ease-in-out duration-300 transform"
					enterFrom="-translate-x-full"
					enterTo="translate-x-0"
					leave="transition ease-in-out duration-300 transform"
					leaveFrom="translate-x-0"
					leaveTo="-translate-x-full"
				>
					<div className="relative flex h-0 w-64 flex-1 flex-col ">
						<Transition.Child
							enter="ease-in-out duration-300"
							enterFrom="opacity-0"
							enterTo="opacity-100"
							leave="ease-in-out duration-300"
							leaveFrom="opacity-100"
							leaveTo="opacity-0"
						>
							<div className="absolute top-0 right-0 -mr-12 pt-2">
								<button
									className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
									onClick={() => setOpenSidebar(false)}
								>
									<span className="sr-only">{closeSidebar}</span>
									<XIcon className="h-5 w-5 text-white" />
								</button>
							</div>

							<div className="flex h-screen w-full flex-col bg-gray-1000">
								<div className="flex flex-1 flex-col overflow-y-auto ">
									<MemoizedMainMenu />
								</div>

								<MemoizedProfileMenu />
							</div>
						</Transition.Child>
					</div>
				</Transition.Child>
			</div>
		</Transition>
	);
};

/**
 * Memoized custom `MobileSidebarLayout` component
 */
const ForwardRefMobileSidebarLayout = forwardRef(MobileSidebarLayout);
export const MemoizedMobileSidebarLayout = memo(ForwardRefMobileSidebarLayout);
