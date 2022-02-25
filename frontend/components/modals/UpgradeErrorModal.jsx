import { SubscriptionPlansSettingsLink } from "@constants/PageLinks";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationIcon, ViewBoardsIcon } from "@heroicons/react/solid";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { forwardRef, Fragment, memo } from "react";

/**
 * Custom function to render the `UpgradeErrorModal` component
 *
 * @param {boolean} showModal
 * @param {function} setShowModal
 */
const UpgradeErrorModal = ({ showModal = false, setShowModal }, ref) => {
	// Translations
	const { t } = useTranslation("common");
	const siteFeatureNotAvailableTitle = t("siteFeatureNotAvailableTitle");
	const siteFeatureNotAvailableMessage = t("siteFeatureNotAvailableMessage");
	const closeText = t("close");
	const upgradePlanText = t("upgradePlan");

	return (
		<Transition.Root show={showModal} as={Fragment}>
			<Dialog as="div" className="upgrade-error-modal-dialog" initialFocus={ref} onClose={setShowModal}>
				<div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
					<Transition.Child
						as={Fragment}
						enter="upgrade-error-modal-first-child-enter"
						enterFrom="upgrade-error-modal-first-child-enter-from"
						enterTo="upgrade-error-modal-first-child-enter-to"
						leave="upgrade-error-modal-first-child-leave"
						leaveFrom="upgrade-error-modal-first-child-leave-from"
						leaveTo="upgrade-error-modal-first-child-leave-to"
					>
						<Dialog.Overlay className="upgrade-error-modal-dialog-overlay" />
					</Transition.Child>

					{/* This element is to trick the browser into centering the modal contents. */}
					<span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">
						&#8203;
					</span>

					<Transition.Child
						as={Fragment}
						enter="upgrade-error-modal-second-child-enter"
						enterFrom="upgrade-error-modal-second-child-enter-from"
						enterTo="upgrade-error-modal-second-child-enter-to"
						leave="upgrade-error-modal-second-child-leave"
						leaveFrom="upgrade-error-modal-second-child-leave-from"
						leaveTo="upgrade-error-modal-second-child-leave-to"
					>
						<div className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle">
							<div className="sm:flex sm:items-start">
								<div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
									<ExclamationIcon className="h-6 w-6 text-yellow-600" aria-hidden="true" />
								</div>
								<div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
									<Dialog.Title as="h3" className="upgrade-error-modal-second-child-title">
										{siteFeatureNotAvailableTitle}
									</Dialog.Title>

									<div className="mt-2">
										<Dialog.Description as="p" className="upgrade-error-modal-second-child-description">
											{siteFeatureNotAvailableMessage}
										</Dialog.Description>
									</div>
								</div>
							</div>
							<div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
								<span className="flex w-full rounded-md shadow-sm sm:w-auto">
									<Link href={SubscriptionPlansSettingsLink} passHref>
										<a className="relative mt-3 inline-flex w-full cursor-pointer items-center rounded-md border border-transparent bg-yellow-600 px-4 py-2 text-sm font-medium leading-5 text-white hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 sm:mt-0">
											<ViewBoardsIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
											{upgradePlanText}
										</a>
									</Link>
								</span>

								<span className="mt-3 flex w-full sm:mt-0 sm:w-auto">
									<button
										type="button"
										className="mr-3 inline-flex w-full cursor-pointer justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium  text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
										onClick={() => setShowModal(false)}
									>
										{closeText}
									</button>
								</span>
							</div>
						</div>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition.Root>
	);
};

/**
 * Memoized custom `UpgradeErrorModal` component
 */
const ForwardRefUpgradeErrorModal = forwardRef(UpgradeErrorModal);
export const MemoizedUpgradeErrorModal = memo(ForwardRefUpgradeErrorModal);
