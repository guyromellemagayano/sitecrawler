import { SitesApiEndpoint } from "@constants/ApiEndpoints";
import { NotificationDisplayInterval, ResetCopyStateTimeout } from "@constants/GlobalValues";
import { Dialog, Transition } from "@headlessui/react";
import { handlePostMethod } from "@helpers/handleHttpMethods";
import { InformationCircleIcon } from "@heroicons/react/outline";
import { ClipboardIcon } from "@heroicons/react/solid";
import { SiteCrawlerAppContext } from "@pages/_app";
import { classnames } from "@utils/classnames";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { forwardRef, Fragment, memo, useContext, useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

/**
 * Custom function to render the `SiteVerifyModal` component
 *
 * @param {boolean} showModal
 * @param {function} setShowModal
 * @param {string} siteUrl
 * @param {number} siteId
 * @param {string} siteName
 * @param {number} siteVerificationId
 */
const SiteVerifyModal = (
	{ setShowModal, showModal = false, siteId = null, siteName = null, siteUrl = null, siteVerificationId = null },
	ref
) => {
	const [copied, setCopied] = useState(false);
	const [copyValue, setCopyValue] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [enableNextStep, setEnableNextStep] = useState(false);
	const [siteVerifyId, setSiteVerifyId] = useState(siteId);

	// Translations
	const { t } = useTranslation();
	const verifySiteTitleText = t("sites:verifySiteTitle");
	const verifyingText = t("sites:verifying");
	const closeText = t("common:close");
	const copiedText = t("common:copiedText");
	const copyText = t("common:copyText");
	const instructionsText = t("sites:instructions");
	const instruction1 = t("sites:instruction1");
	const instruction2 = t("sites:instruction2");
	const instruction3 = t("sites:instruction3");
	const instruction4 = t("sites:instruction4");
	const verifyIdMetaTagText = t("sites:verifyIdMetaTagText");
	const goToSiteOverviewText = t("sites:goToSiteOverview");

	// Custom variables
	const siteVerifyApiEndpoint = `${SitesApiEndpoint + siteId}/verify/`;
	let instructionHtmlText = `1. ${instruction1}: ` + siteUrl + "\n\n";
	instructionHtmlText += `2. ${instruction2}: ` + "\n" + copyValue + "\n\n";
	instructionHtmlText += `3. ${instruction3}.` + "\n\n";
	instructionHtmlText += `4. ${instruction4}` + "\n\n";

	// Custom contexts
	const { state, setConfig } = useContext(SiteCrawlerAppContext);

	// Custom hooks
	const siteVerifyRef = useRef(null);

	// Handle site verification copy to clipboard
	useEffect(() => {
		if (showModal && siteVerificationId !== null) {
			setCopyValue(`<meta name="epic-crawl-id" content="${siteVerificationId}" />`);
		}
	}, [showModal, siteVerificationId]);

	// Handle input change
	const handleInputChange = ({ copyValue }) => {
		setCopyValue({ copyValue, copied });
	};

	// Handle hidden input change
	const handleHiddenInputChange = (e) => {
		setSiteVerifyId({ value: e.currentTarget.site_verify_id.value });
	};

	// Handle input copy
	const handleInputCopy = () => {
		setCopied(true);
	};

	// Reset copied state as soon as the modal is closed
	useEffect(() => {
		if (copied) {
			const timeout = setTimeout(() => {
				setCopied(false);
			}, ResetCopyStateTimeout);

			return () => {
				clearTimeout(timeout);
			};
		}
	}, [copied]);

	// Handle site verification
	const handleSiteVerification = () => {
		let isMounted = true;

		setIsLoading(true);

		(async () => {
			if (!isMounted) return;

			const body = {
				sid: siteVerifyId
			};

			const siteVerifyResponse = await handlePostMethod(siteVerifyApiEndpoint, body);
			const siteVerifyResponseData = siteVerifyResponse?.data ?? null;
			const siteVerifyResponseStatus = siteVerifyResponse?.status ?? null;
			const siteVerifyResponseMethod = siteVerifyResponse?.config?.method ?? null;

			if (siteVerifyResponseData !== null && Math.round(siteVerifyResponseStatus / 200) === 1) {
				if (siteVerifyResponseData?.verified) {
					// Show alert message after successful 200 OK or 201 Created response is issued
					setConfig({
						isVerifyUrlStep: true,
						method: siteVerifyResponseMethod,
						status: siteVerifyResponseStatus,
						isError: false
					});

					// Enable next step in site verification process and disable site verification as soon as 200 OK or 201 Created response was issued
					const timeout = setTimeout(() => {
						setEnableNextStep(true);
						setIsLoading(false);
					}, NotificationDisplayInterval);

					return () => {
						clearTimeout(timeout);
					};
				} else {
					// Show alert message after successful 200 OK or 201 Created response is issued
					setConfig({
						isVerifyUrlStep: true,
						method: siteVerifyResponseMethod,
						status: siteVerifyResponseStatus,
						isError: true
					});

					// Enable next step in site verification process and disable site verification as soon as 200 OK or 201 Created response was issued
					const timeout = setTimeout(() => {
						setIsLoading(false);
					}, NotificationDisplayInterval);

					return () => {
						clearTimeout(timeout);
					};
				}
			} else {
				// Show alert message after successful 200 OK or 201 Created response is issued
				setConfig({
					isVerifyUrlStep: true,
					method: siteVerifyResponseMethod,
					status: siteVerifyResponseStatus
				});

				// Enable next step in site verification process and disable site verification as soon as 200 OK or 201 Created response was issued
				const timeout = setTimeout(() => {
					setIsLoading(false);
				}, NotificationDisplayInterval);

				return () => {
					clearTimeout(timeout);
				};
			}
		})();

		return () => {
			isMounted = false;
		};
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
				initialFocus={siteVerifyRef}
				onClose={isLoading ? () => {} : handleCloseModal}
			>
				<div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
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
								<div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
									<InformationCircleIcon className="h-6 w-6 text-yellow-600" />
								</div>
								<div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
									<Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
										{verifySiteTitleText}
									</Dialog.Title>

									<div className="mt-2">
										<span className="text-sm font-semibold text-gray-500">
											{siteName}
											<a
												href={siteUrl}
												target="_blank"
												title={siteUrl}
												className="table cursor-pointer break-all leading-6 text-indigo-600 transition duration-150 ease-in-out hover:text-indigo-500"
												rel="noreferrer"
											>
												{siteUrl}
											</a>
										</span>

										<Dialog.Description as="p" className="mt-4 mb-3 text-sm text-gray-500">
											{instructionsText}
										</Dialog.Description>

										<ol className="ml-4 list-decimal space-y-2">
											<li className="text-sm leading-6 text-gray-500">{instruction1}</li>
											<li className="text-sm leading-6 text-gray-500">
												{instruction2}

												<div className="block w-full">
													<label htmlFor="verify-id-meta-tag" className="sr-only">
														{verifyIdMetaTagText}
													</label>
													<div className="mt-1 flex">
														<div className="relative flex flex-grow items-stretch focus-within:z-10">
															<input
																type="text"
																name="verify-id-meta-tag"
																className={classnames(
																	"block w-full rounded-none rounded-l-md border-gray-300 text-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
																	isLoading && "cursor-not-allowed bg-gray-300 opacity-50"
																)}
																value={copyValue}
																onChange={handleInputChange}
																autoComplete="off"
															/>

															<CopyToClipboard onCopy={isLoading ? () => {} : handleInputCopy} text={copyValue}>
																<button
																	ref={siteVerifyRef}
																	className={classnames(
																		"relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700",
																		isLoading
																			? "cursor-not-allowed opacity-50"
																			: "hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500  focus:ring-offset-2"
																	)}
																>
																	<ClipboardIcon className="h-4 w-4 text-gray-400" />
																	<span>{copied ? copiedText : copyText}</span>
																</button>
															</CopyToClipboard>
														</div>
													</div>
												</div>
											</li>
											<li className="text-sm leading-6 text-gray-500">{instruction3}</li>
											<li className="text-sm leading-6 text-gray-500">{instruction4}</li>
										</ol>

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
																className={classnames(
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
								{!enableNextStep ? (
									<button
										ref={siteVerifyRef}
										disabled={isLoading}
										aria-disabled={isLoading}
										aria-hidden={isLoading}
										type="button"
										onClick={handleSiteVerification}
										className={classnames(
											"inline-flex w-full justify-center rounded-md border border-transparent bg-yellow-600 px-4 py-2 text-base font-medium text-white shadow-sm sm:ml-3 sm:w-auto sm:text-sm",
											isLoading
												? "cursor-not-allowed opacity-50"
												: "hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
										)}
									>
										{isLoading ? verifyingText : verifySiteTitleText}
									</button>
								) : (
									<Link
										href="/dashboard/sites/[siteId]/overview/"
										as={`/dashboard/sites/${siteId}/overview/`}
										passHref
										replace
									>
										<a
											ref={siteVerifyRef}
											type="button"
											disabled={isLoading}
											aria-disabled={isLoading}
											aria-hidden={isLoading}
											className={classnames(
												"inline-flex w-full justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-base font-medium text-white shadow-sm sm:ml-3 sm:w-auto sm:text-sm",
												isLoading
													? "cursor-not-allowed opacity-50"
													: "hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
											)}
										>
											{goToSiteOverviewText}
										</a>
									</Link>
								)}

								<button
									type="button"
									disabled={isLoading}
									aria-disabled={isLoading}
									aria-hidden={isLoading}
									className={classnames(
										"mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm",
										isLoading ? "cursor-not-allowed opacity-50" : "hover:bg-gray-50"
									)}
									onClick={() => setShowModal(false)}
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
 * Memoized custom `SiteVerifyModal` component
 */
const ForwardRefSiteVerifyModal = forwardRef(SiteVerifyModal);
export const MemoizedSiteVerifyModal = memo(ForwardRefSiteVerifyModal);
