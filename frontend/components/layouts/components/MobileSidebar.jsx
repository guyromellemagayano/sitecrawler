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
					enter="mobile-sidebar-first-child-enter"
					enterFrom="mobile-sidebar-first-child-enter-from"
					enterTo="mobile-sidebar-first-child-enter-to"
					leave="mobile-sidebar-first-child-leave"
					leaveFrom="mobile-sidebar-first-child-leave-from"
					leaveTo="mobile-sidebar-first-child-leave-to"
				>
					<div className="fixed inset-0 bg-gray-600 bg-opacity-75" aria-hidden="true"></div>
				</Transition.Child>

				<Transition.Child
					enter="mobile-sidebar-second-child-enter"
					enterFrom="mobile-sidebar-second-child-enter-from"
					enterTo="mobile-sidebar-second-child-enter-to"
					leave="mobile-sidebar-second-child-leave"
					leaveFrom="mobile-sidebar-second-child-leave-from"
					leaveTo="mobile-sidebar-second-child-leave-to"
				>
					<div className="relative flex h-0 w-64 flex-1 flex-col ">
						<Transition.Child
							enter="mobile-sidebar-third-child-enter"
							enterFrom="mobile-sidebar-third-child-enter-from"
							enterTo="mobile-sidebar-third-child-enter-to"
							leave="mobile-sidebar-third-child-leave"
							leaveFrom="mobile-sidebar-third-child-leave-from"
							leaveTo="mobile-sidebar-third-child-leave-to"
						>
							<div className="absolute top-0 right-0 -mr-12 pt-2">
								<button
									className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
									onClick={() => setOpenSidebar(false)}
								>
									<span className="sr-only">{closeSidebar}</span>
									<XIcon className="h-6 w-6 text-white" />
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
