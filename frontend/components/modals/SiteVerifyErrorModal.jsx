import { SubscriptionPlansSettingsLink } from "@constants/PageLinks";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationIcon } from "@heroicons/react/solid";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { forwardRef, Fragment, memo } from "react";
import "twin.macro";

/**
 * Custom function to render the `SiteVerifyErrorModal` component
 *
 * @param {boolean} showModal
 * @param {function} setShowModal
 */
const SiteVerifyErrorModal = ({ showModal = false, setShowModal }, ref) => {
	// Translations
	const { t } = useTranslation("common");
	const siteRecrawlFeatureNotAvailableTitle = t("siteRecrawlFeatureNotAvailableTitle");
	const siteRecrawlFeatureNotAvailableMessage = t("siteRecrawlFeatureNotAvailableMessage");
	const closeText = t("close");
	const goBackToSitesDashboardText = t("goBackToSitesDashboard");

	return (
		<Transition.Root show={showModal} as={Fragment}>
			<Dialog as="div" className="site-verify-error-modal-dialog" initialFocus={ref} onClose={setShowModal}>
				<div tw="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
					<Transition.Child
						as={Fragment}
						enter="site-verify-error-modal-first-child-enter"
						enterFrom="site-verify-error-modal-first-child-enter-from"
						enterTo="site-verify-error-modal-first-child-enter-to"
						leave="site-verify-error-modal-first-child-leave"
						leaveFrom="site-verify-error-modal-first-child-leave-from"
						leaveTo="site-verify-error-modal-first-child-leave-to"
					>
						<Dialog.Overlay className="site-verify-error-modal-dialog-overlay" />
					</Transition.Child>

					{/* This element is to trick the browser into centering the modal contents. */}
					<span tw="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
						&#8203;
					</span>

					<Transition.Child
						as={Fragment}
						enter="site-verify-error-modal-second-child-enter"
						enterFrom="site-verify-error-modal-second-child-enter-from"
						enterTo="site-verify-error-modal-second-child-enter-to"
						leave="site-verify-error-modal-second-child-leave"
						leaveFrom="site-verify-error-modal-second-child-leave-from"
						leaveTo="site-verify-error-modal-second-child-leave-to"
					>
						<div tw="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
							<div tw="sm:flex sm:items-start">
								<div tw="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
									<ExclamationIcon tw="h-6 w-6 text-red-600" aria-hidden="true" />
								</div>
								<div tw="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
									<Dialog.Title as="h3" className="site-verify-error-modal-second-child-title">
										{siteRecrawlFeatureNotAvailableTitle}
									</Dialog.Title>

									<div tw="mt-2">
										<Dialog.Description as="p" className="site-verify-error-modal-second-child-description">
											{siteRecrawlFeatureNotAvailableMessage}
										</Dialog.Description>
									</div>
								</div>
							</div>
							<div tw="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
								<span tw="flex w-full rounded-md shadow-sm sm:w-auto">
									<Link href={SubscriptionPlansSettingsLink} passHref>
										<a tw="cursor-pointer w-full mt-3 sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
											{goBackToSitesDashboardText}
										</a>
									</Link>
								</span>

								<span tw="mt-3 flex w-full sm:mt-0 sm:w-auto">
									<button
										type="button"
										tw="cursor-pointer inline-flex justify-center w-full mr-3 rounded-md border border-gray-300 px-4 py-2 shadow-sm text-sm font-medium  text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
 * Memoized custom `SiteVerifyErrorModal` component
 */
const ForwardRefSiteVerifyErrorModal = forwardRef(SiteVerifyErrorModal);
export const MemoizedSiteVerifyErrorModal = memo(ForwardRefSiteVerifyErrorModal);
