import { SitesApiEndpoint } from "@constants/ApiEndpoints";
import { NotificationDisplayInterval } from "@constants/GlobalValues";
import { DashboardSitesLink } from "@constants/PageLinks";
import { Dialog, Transition } from "@headlessui/react";
import { handleDeleteMethod } from "@helpers/handleHttpMethods";
import { XCircleIcon } from "@heroicons/react/outline";
import { useNotificationMessage } from "@hooks/useNotificationMessage";
import { classNames } from "@utils/classNames";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { forwardRef, Fragment, memo, useState } from "react";
import { useSWRConfig } from "swr";

/**
 * Custom function to render the `DeleteSiteModal` component
 *
 * @param {function} setShowModal
 * @param {boolean} showModal
 * @param {number} siteId
 */
const DeleteSiteModal = ({ setShowModal, showModal = false, siteId = null }, ref) => {
	const [disableDeleteSite, setDisableDeleteSite] = useState(false);
	const [errorMsg, setErrorMsg] = useState([]);
	const [successMsg, setSuccessMsg] = useState([]);
	const [hideButtons, setHideButtons] = useState(false);

	// Translations
	const { t } = useTranslation();
	const deleteSiteHeadlineText = t("sites:deleteSite.headline");
	const deleteSiteSubheadingText = t("sites:deleteSite.subHeading");
	const requestText = t("common:request");
	const cancelText = t("common:cancel");
	const processingText = t("common:processing");
	const closeText = t("common:close");
	const proceedText = t("common:proceed");

	const SiteIdApiEndpoint = `${SitesApiEndpoint + siteId}/`;

	// SWR hook for global mutations
	const { mutate } = useSWRConfig();

	// Custom hooks
	const { state, setConfig } = useNotificationMessage();

	// Router
	const { asPath, push } = useRouter();

	// Handle site deletion
	const handleSiteDeletion = async (e) => {
		e.preventDefault();

		setDisableDeleteSite(true);

		const siteDeleteResponse = await handleDeleteMethod(SiteIdApiEndpoint);
		const siteDeleteResponseData = siteDeleteResponse?.data ?? null;
		const siteDeleteResponseStatus = siteDeleteResponse?.status ?? null;
		const siteDeleteResponseMethod = siteDeleteResponse?.config?.method ?? null;

		if (siteDeleteResponseData !== null && Math.round(siteDeleteResponseStatus / 200) === 1) {
			// Mutate "sites" endpoint after successful 200 OK or 201 Created response is issued
			mutate(SitesApiEndpoint);

			// Show alert message after successful 200 OK or 201 Created response is issued
			setConfig({
				isSites: true,
				method: siteDeleteResponseMethod,
				status: siteDeleteResponseStatus
			});

			// Renable the button after a successful form submission
			setTimeout(() => {
				setDisableDeleteSite(false);
				setShowModal(false);
				push(DashboardSitesLink);
			}, NotificationDisplayInterval);
		} else {
			// Show alert message after successful 200 OK or 201 Created response is issued
			setConfig({
				isSites: true,
				method: siteDeleteResponseMethod,
				status: siteDeleteResponseStatus
			});

			// Renable the button after a successful form submission
			setTimeout(() => {
				setDisableDeleteSite(false);
			}, NotificationDisplayInterval);
		}
	};

	return (
		<Transition.Root show={showModal} as={Fragment}>
			<Dialog
				as="div"
				className="site-delete-modal-dialog"
				initialFocus={ref}
				onClose={!disableDeleteSite ? setShowModal : () => {}}
			>
				<div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
					<Transition.Child
						as={Fragment}
						enter="site-delete-modal-first-child-enter"
						enterFrom="site-delete-modal-first-child-enter-from"
						enterTo="site-delete-modal-first-child-enter-to"
						leave="site-delete-modal-first-child-leave"
						leaveFrom="site-delete-modal-first-child-leave-from"
						leaveTo="site-delete-modal-first-child-leave-to"
					>
						<Dialog.Overlay className="site-delete-modal-dialog-overlay" />
					</Transition.Child>

					{/* This element is to trick the browser into centering the modal contents. */}
					<span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">
						&#8203;
					</span>

					<Transition.Child
						as={Fragment}
						enter="site-delete-modal-second-child-enter"
						enterFrom="site-delete-modal-second-child-enter-from"
						enterTo="site-delete-modal-second-child-enter-to"
						leave="site-delete-modal-second-child-leave"
						leaveFrom="site-delete-modal-second-child-leave-from"
						leaveTo="site-delete-modal-second-child-leave-to"
					>
						<div className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle">
							<div className="sm:flex sm:items-start">
								<div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
									<XCircleIcon className="h-6 w-6 text-red-600" />
								</div>
								<div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
									<Dialog.Title as="h3" className="text-lg font-bold leading-6 text-gray-900">
										{deleteSiteHeadlineText}
									</Dialog.Title>

									<div className="mt-2">
										<p className="text-sm leading-5 text-gray-500">{deleteSiteSubheadingText}</p>

										{state?.responses?.length > 0 ? (
											<div className="my-5 block">
												<div className="flex justify-center sm:justify-start">
													{state.responses.map((value, key) => {
														// Alert Messsages
														const responseText = value?.responseText ?? null;
														const isSuccess = value?.isSuccess ?? null;

														return (
															<h3
																key={key}
																className={classNames(
																	"break-words text-sm font-medium leading-5",
																	isSuccess ? "text-green-800" : "text-red-800"
																)}
															>
																{responseText}
															</h3>
														);
													}) ?? null}
												</div>
											</div>
										) : null}
									</div>
								</div>
							</div>

							<div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
								<span className="flex w-full rounded-md shadow-sm sm:w-auto">
									<button
										type="button"
										tabIndex="0"
										disabled={disableDeleteSite}
										className={classNames(
											"relative mt-3 inline-flex w-full cursor-pointer items-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium leading-5 text-white sm:mt-0 ",
											disableDeleteSite
												? "cursor-not-allowed opacity-50"
												: "hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 active:bg-red-700"
										)}
										aria-label="Delete Site"
										onClick={handleSiteDeletion}
									>
										{disableDeleteSite ? processingText : proceedText}
									</button>
								</span>

								<span className="mt-3 flex w-full sm:mt-0 sm:w-auto">
									<button
										type="button"
										disabled={disableDeleteSite}
										className={classNames(
											"mr-3 inline-flex w-full cursor-pointer justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium  text-gray-700 shadow-sm ",
											disableDeleteSite
												? "cursor-not-allowed opacity-50"
												: "hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
										)}
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
 * Memoized custom "DeleteSiteModal" component
 */
const ForwardRefDeleteSiteModal = forwardRef(DeleteSiteModal);
export const MemoizedDeleteSiteModal = memo(ForwardRefDeleteSiteModal);
