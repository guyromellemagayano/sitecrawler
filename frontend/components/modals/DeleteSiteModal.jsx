import { SitesApiEndpoint } from "@constants/ApiEndpoints";
import { NotificationDisplayInterval } from "@constants/GlobalValues";
import { DashboardSitesLink } from "@constants/PageLinks";
import { Dialog, Transition } from "@headlessui/react";
import { handleDeleteMethod } from "@helpers/handleHttpMethods";
import { XCircleIcon } from "@heroicons/react/outline";
import { useNotificationMessage } from "@hooks/useNotificationMessage";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { forwardRef, Fragment, memo, useState } from "react";
import { useSWRConfig } from "swr";
import tw from "twin.macro";

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
			// Mutate `sites` endpoint after successful 200 OK or 201 Created response is issued
			await mutate(SitesApiEndpoint);

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
				<div tw="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
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
					<span tw="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
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
						<div tw="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
							<div tw="sm:flex sm:items-start">
								<div tw="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
									<XCircleIcon tw="h-6 w-6 text-red-600" />
								</div>
								<div tw="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
									<Dialog.Title as="h3" className="text-lg font-bold leading-6 text-gray-900">
										{deleteSiteHeadlineText}
									</Dialog.Title>

									<div tw="mt-2">
										<p tw="text-sm leading-5 text-gray-500">{deleteSiteSubheadingText}</p>

										{state?.responses?.length > 0 ? (
											<div tw="block my-5">
												<div tw="flex justify-center sm:justify-start">
													{state.responses.map((value, key) => {
														// Alert Messsages
														const responseText = value?.responseText ?? null;
														const isSuccess = value?.isSuccess ?? null;

														return (
															<h3
																key={key}
																css={[
																	tw`text-sm leading-5 font-medium break-words`,
																	isSuccess ? tw`text-green-800` : tw`text-red-800`
																]}
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

							<div tw="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
								<span tw="flex w-full rounded-md shadow-sm sm:w-auto">
									<button
										type="button"
										tabIndex="0"
										disabled={disableDeleteSite}
										css={[
											tw`cursor-pointer w-full mt-3 sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-red-600 `,
											disableDeleteSite
												? tw`opacity-50 cursor-not-allowed`
												: tw`hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 active:bg-red-700`
										]}
										aria-label="Delete Site"
										onClick={handleSiteDeletion}
									>
										{disableDeleteSite ? processingText : proceedText}
									</button>
								</span>

								<span tw="mt-3 flex w-full sm:mt-0 sm:w-auto">
									<button
										type="button"
										disabled={disableDeleteSite}
										css={[
											tw`cursor-pointer inline-flex justify-center w-full mr-3 rounded-md border border-gray-300 px-4 py-2 shadow-sm text-sm font-medium  text-gray-700 bg-white `,
											disableDeleteSite
												? tw`opacity-50 cursor-not-allowed`
												: tw`hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`
										]}
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
 * Memoized custom `DeleteSiteModal` component
 */
const ForwardRefDeleteSiteModal = forwardRef(DeleteSiteModal);
export const MemoizedDeleteSiteModal = memo(ForwardRefDeleteSiteModal);
