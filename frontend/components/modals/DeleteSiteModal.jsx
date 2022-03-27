import { SitesApiEndpoint } from "@constants/ApiEndpoints";
import { NotificationDisplayInterval } from "@constants/GlobalValues";
import { DashboardSitesLink } from "@constants/PageLinks";
import { Dialog, Transition } from "@headlessui/react";
import { handleDeleteMethod } from "@helpers/handleHttpMethods";
import { XCircleIcon } from "@heroicons/react/outline";
import { useScanApiEndpoint } from "@hooks/useScanApiEndpoint";
import { useSiteQueries } from "@hooks/useSiteQueries";
import { SiteCrawlerAppContext } from "@pages/_app";
import { classnames } from "@utils/classnames";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { forwardRef, Fragment, memo, useContext, useRef, useState } from "react";
import { useSWRConfig } from "swr";

/**
 * Custom function to render the `DeleteSiteModal` component
 *
 * @param {function} setShowModal
 * @param {boolean} showModal
 * @param {number} siteId
 */
const DeleteSiteModal = ({ setShowModal, showModal = false, siteId = null }, ref) => {
	const [isLoading, setIsLoading] = useState(false);

	// Translations
	const { t } = useTranslation();
	const deleteSiteHeadlineText = t("sites:deleteSite.headline");
	const deleteSiteSubheadingText = t("sites:deleteSite.subHeading");
	const closeText = t("common:close");
	const proceedText = t("common:proceed");
	const processingText = t("common:processing");

	const SiteIdApiEndpoint = `${SitesApiEndpoint + siteId}/`;

	// Router
	const { push } = useRouter();

	// SWR hook for global mutations
	const { mutate } = useSWRConfig();

	// Custom hooks
	const { linksPerPage } = useSiteQueries();
	const { scanApiEndpoint } = useScanApiEndpoint(linksPerPage);
	const deleteSiteRef = useRef(null);

	// Custom contexts
	const { state, setConfig, sites } = useContext(SiteCrawlerAppContext);

	// Handle site deletion
	const handleSiteDeletion = (e) => {
		setIsLoading(true);

		(async () => {
			const siteDeleteResponse = await handleDeleteMethod(SiteIdApiEndpoint);
			const siteDeleteResponseData = siteDeleteResponse?.data ?? null;
			const siteDeleteResponseStatus = siteDeleteResponse?.status ?? null;
			const siteDeleteResponseMethod = siteDeleteResponse?.config?.method ?? null;

			// Show alert message after successful 200 OK or 201 Created response is issued
			setConfig({
				isSites: true,
				method: siteDeleteResponseMethod,
				status: siteDeleteResponseStatus,
				isAlert: false,
				isNotification: false
			});

			if (deleteSiteRef?.current && deleteSiteRef?.current?.contains(e.target)) {
				const siteDeleteResponseTimeout = setTimeout(() => {
					if (siteDeleteResponseData !== null && Math.round(siteDeleteResponseStatus / 200) === 1) {
						// Mutate "user" endpoint after successful 200 OK or 201 Created response is issued
						mutate(scanApiEndpoint, null, { optimisticData: sites?.data, rollbackOnError: true, revalidate: true });
						mutate(SitesApiEndpoint, null, {
							optimisticData: sites?.data,
							rollbackOnError: true,
							revalidate: true
						});

						// Redirect to the sites dashboard page after successful 200 OK or 201 Created response is issued
						push(DashboardSitesLink);

						setIsLoading(false);
						setShowModal(false);
					} else {
						setIsLoading(false);
						setShowModal(false);
					}
				}, NotificationDisplayInterval);

				return () => {
					clearTimeout(siteDeleteResponseTimeout);
				};
			}
		})();
	};

	// Handle close modal
	const handleCloseModal = () => {
		setShowModal(false);
	};

	return (
		<Transition.Root show={showModal} as={Fragment}>
			<Dialog
				as="div"
				className="fixed inset-0 z-50 overflow-y-auto"
				initialFocus={deleteSiteRef}
				onClose={isLoading ? () => {} : handleCloseModal}
			>
				<div className="flex min-h-screen items-end justify-center p-4 text-center sm:block sm:p-0">
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
					</Transition.Child>

					{/* This element is to trick the browser into centering the modal contents. */}
					<span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">
						&#8203;
					</span>

					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
						enterTo="opacity-100 translate-y-0 sm:scale-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100 translate-y-0 sm:scale-100"
						leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
					>
						<div className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6 sm:align-middle">
							<div className="sm:flex sm:items-start">
								<div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
									<XCircleIcon className="h-5 w-5 text-red-600" aria-hidden="true" />
								</div>
								<div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
									<Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
										{deleteSiteHeadlineText}
									</Dialog.Title>

									<div className="mt-2">
										<Dialog.Description as="p" className="mb-3 text-sm text-gray-500">
											{deleteSiteSubheadingText}
										</Dialog.Description>

										{state?.isSites && state?.responses?.length > 0 ? (
											<div className="my-5 block">
												<div className="flex justify-center sm:justify-start">
													{state.responses.map((value, key) => {
														// Alert Messsages
														const responseText = value?.responseText ?? null;
														const isSuccess = value?.isSuccess ?? null;

														return (
															<p
																key={key}
																className={classnames(
																	"break-words text-sm font-medium leading-5",
																	isSuccess ? "text-green-800" : "text-red-800"
																)}
															>
																{responseText}
															</p>
														);
													}) ?? null}
												</div>
											</div>
										) : null}
									</div>
								</div>
							</div>

							<div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
								<button
									ref={deleteSiteRef}
									type="button"
									disabled={isLoading}
									aria-disabled={isLoading}
									aria-hidden={isLoading}
									onClick={isLoading ? () => {} : (e) => handleSiteDeletion(e)}
									className={classnames(
										"inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm sm:ml-3 sm:w-auto sm:text-sm",
										isLoading
											? "cursor-not-allowed opacity-50"
											: "hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
									)}
								>
									<span className="flex items-center space-x-2">{isLoading ? processingText : proceedText}</span>
								</button>

								<button
									type="button"
									disabled={isLoading}
									aria-disabled={isLoading}
									aria-hidden={isLoading}
									className={classnames(
										"mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm",
										isLoading ? "cursor-not-allowed opacity-50" : "hover:bg-gray-50"
									)}
									onClick={isLoading ? () => {} : handleCloseModal}
								>
									{closeText}
								</button>
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
