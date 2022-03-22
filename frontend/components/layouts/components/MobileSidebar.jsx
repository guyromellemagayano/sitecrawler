import { MemoizedMainMenu } from "@components/menus/MainMenu";
import { MemoizedProfileMenu } from "@components/menus/ProfileMenu";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/solid";
import useTranslation from "next-translate/useTranslation";
import { forwardRef, Fragment, memo } from "react";

/**
 * Custom function to render the `MobileSidebarLayout` component
 *
 * @param {boolean} openSidebar
 * @param {function} setOpenSidebar
 */
const MobileSidebarLayout = ({ openSidebar = false, setOpenSidebar }, ref) => {
	// Translations
	const { t } = useTranslation("sidebar");
	const closeSidebarText = t("closeSidebar");

	return (
		<Transition.Root show={openSidebar} as={Fragment}>
			<Dialog as="div" className="fixed inset-0 z-50 flex md:hidden" onClose={setOpenSidebar}>
				<Transition.Child
					as={Fragment}
					enter="transition-opacity ease-linear duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="transition-opacity ease-linear duration-300"
					leaveFrom="opacity-100"
					leaveTo="opacity-0"
				>
					<Dialog.Overlay className="fixed inset-0 bg-gray-600 bg-opacity-75" />
				</Transition.Child>
				<Transition.Child
					as={Fragment}
					enter="transition ease-in-out duration-300 transform"
					enterFrom="-translate-x-full"
					enterTo="translate-x-0"
					leave="transition ease-in-out duration-300 transform"
					leaveFrom="translate-x-0"
					leaveTo="-translate-x-full"
				>
					<div className="relative flex w-full max-w-xs flex-1 flex-col bg-gray-1000">
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
									type="button"
									className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
									onClick={(e) => setOpenSidebar(false)}
								>
									<span className="sr-only">{closeSidebarText}</span>
									<XIcon className="h-5 w-5 text-white" aria-hidden="true" />
								</button>
							</div>
						</Transition.Child>
						<div className="h-0 flex-1 overflow-y-auto pt-5 pb-4">
							<MemoizedMainMenu />
						</div>
						<MemoizedProfileMenu />
					</div>
				</Transition.Child>
				<div className="w-14 flex-shrink-0" aria-hidden="true">
					{/* Force sidebar to shrink to fit close icon */}
				</div>
			</Dialog>
		</Transition.Root>
	);
};

/**
 * Memoized custom `MobileSidebarLayout` component
 */
const ForwardRefMobileSidebarLayout = forwardRef(MobileSidebarLayout);
export const MemoizedMobileSidebarLayout = memo(ForwardRefMobileSidebarLayout);
