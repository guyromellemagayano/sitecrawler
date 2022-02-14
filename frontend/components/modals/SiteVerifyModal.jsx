import { SitesApiEndpoint } from "@constants/ApiEndpoints";
import { NotificationDisplayInterval, ResetCopyStateTimeout } from "@constants/GlobalValues";
import { Dialog, Transition } from "@headlessui/react";
import { handlePostMethod } from "@helpers/handleHttpMethods";
import { InformationCircleIcon } from "@heroicons/react/outline";
import { ClipboardIcon } from "@heroicons/react/solid";
import { useNotificationMessage } from "@hooks/useNotificationMessage";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { forwardRef, Fragment, memo, useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import tw from "twin.macro";

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
	const [disableSiteVerify, setDisableSiteVerify] = useState(false);
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

	// Custom hooks
	const { state, setConfig } = useNotificationMessage();

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
			setTimeout(() => {
				setCopied(false);
			}, ResetCopyStateTimeout);
		}
	}, [copied]);

	// Handle site verification
	const handleSiteVerification = async (e) => {
		e.preventDefault();

		setDisableSiteVerify(true);

		const body = {
			sid: e.currentTarget.site_verify_id.value
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
					status: siteVerifyResponseStatus
				});

				// Enable next step in site verification process and disable site verification as soon as 200 OK or 201 Created response was issued
				setTimeout(() => {
					setEnableNextStep(!enableNextStep);
					setDisableSiteVerify(false);
				}, NotificationDisplayInterval);
			} else {
				// Show alert message after successful 200 OK or 201 Created response is issued
				setConfig({
					isVerifyUrlStep: true,
					method: siteVerifyResponseMethod,
					status: siteVerifyResponseStatus,
					isError: true
				});

				// Enable next step in site verification process and disable site verification as soon as 200 OK or 201 Created response was issued
				setTimeout(() => {
					setDisableSiteVerify(false);
				}, NotificationDisplayInterval);
			}
		} else {
			// Show alert message after successful 200 OK or 201 Created response is issued
			setConfig({
				isVerifyUrlStep: true,
				method: siteVerifyResponseMethod,
				status: siteVerifyResponseStatus
			});

			// Enable next step in site verification process and disable site verification as soon as 200 OK or 201 Created response was issued
			setTimeout(() => {
				setDisableSiteVerify(false);
			}, NotificationDisplayInterval);
		}
	};

	return (
		<Transition.Root show={showModal} as={Fragment}>
			<Dialog
				as="div"
				className="site-verify-modal-dialog"
				initialFocus={ref}
				onClose={!disableSiteVerify ? setShowModal : () => {}}
			>
				<div tw="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
					<Transition.Child
						as={Fragment}
						enter="site-verify-modal-first-child-enter"
						enterFrom="site-verify-modal-first-child-enter-from"
						enterTo="site-verify-modal-first-child-enter-to"
						leave="site-verify-modal-first-child-leave"
						leaveFrom="site-verify-modal-first-child-leave-from"
						leaveTo="site-verify-modal-first-child-leave-to"
					>
						<Dialog.Overlay className="site-verify-modal-dialog-overlay" />
					</Transition.Child>

					{/* This element is to trick the browser into centering the modal contents. */}
					<span tw="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
						&#8203;
					</span>

					<Transition.Child
						as={Fragment}
						enter="site-verify-modal-second-child-enter"
						enterFrom="site-verify-modal-second-child-enter-from"
						enterTo="site-verify-modal-second-child-enter-to"
						leave="site-verify-modal-second-child-leave"
						leaveFrom="site-verify-modal-second-child-leave-from"
						leaveTo="site-verify-modal-second-child-leave-to"
					>
						<div tw="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
							<div tw="sm:flex sm:items-start">
								<div tw="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
									<InformationCircleIcon tw="h-6 w-6 text-yellow-600" />
								</div>
								<div tw="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
									<Dialog.Title as="h3" className="site-verify-modal-second-child-title">
										{verifySiteTitleText}
									</Dialog.Title>

									<div tw="mt-2">
										<span tw="text-sm font-semibold text-gray-500">
											{siteName}
											<a
												href={siteUrl}
												target="_blank"
												title={siteUrl}
												tw="table cursor-pointer break-all leading-6 text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150"
												rel="noreferrer"
											>
												{siteUrl}
											</a>
										</span>

										<Dialog.Description as="p" className="site-verify-modal-second-child-description">
											{instructionsText}
										</Dialog.Description>

										<ol tw="space-y-2 list-decimal ml-4">
											<li tw="text-sm leading-6 text-gray-500">{instruction1}</li>
											<li tw="text-sm leading-6 text-gray-500">
												{instruction2}

												<div tw="w-full block">
													<label htmlFor="verify-id-meta-tag" tw="sr-only">
														{verifyIdMetaTagText}
													</label>
													<div tw="mt-1 flex">
														<div tw="relative flex items-stretch flex-grow focus-within:z-10">
															<input
																type="text"
																name="verify-id-meta-tag"
																css={[
																	tw`text-gray-400 focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300`,
																	disableSiteVerify && tw`opacity-50 bg-gray-300 cursor-not-allowed`
																]}
																value={copyValue}
																onChange={handleInputChange}
																autoComplete="off"
															/>

															<CopyToClipboard onCopy={handleInputCopy} text={copyValue}>
																<button
																	css={[
																		tw`-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50`,
																		disableSiteVerify
																			? tw`opacity-50 bg-gray-300 cursor-not-allowed`
																			: tw`hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500`
																	]}
																>
																	<ClipboardIcon tw="h-5 w-5 text-gray-400" />
																	<span>{copied ? copiedText : copyText}</span>
																</button>
															</CopyToClipboard>
														</div>
													</div>
												</div>
											</li>
											<li tw="text-sm leading-6 text-gray-500">{instruction3}</li>
											<li tw="text-sm leading-6 text-gray-500">{instruction4}</li>
										</ol>

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
									{!enableNextStep ? (
										<form onSubmit={handleSiteVerification}>
											<input
												type="hidden"
												value={siteVerifyId}
												name="site_verify_id"
												onChange={handleHiddenInputChange}
											/>
											<button
												type="submit"
												tabIndex="0"
												disabled={disableSiteVerify}
												css={[
													tw`cursor-pointer w-full mt-3 sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-yellow-600`,
													disableSiteVerify
														? tw`opacity-50 cursor-not-allowed`
														: tw`hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 active:bg-yellow-700`
												]}
											>
												{disableSiteVerify ? verifyingText : verifySiteTitleText}
											</button>
										</form>
									) : (
										<Link href="/sites/[siteId]/overview/" as={`/sites/${siteId}/overview/`} passHref replace>
											<a tw="cursor-pointer w-full mt-3 sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 active:bg-green-700">
												{goToSiteOverviewText}
											</a>
										</Link>
									)}
								</span>

								<span tw="mt-3 flex w-full sm:mt-0 sm:w-auto">
									<button
										type="button"
										disabled={disableSiteVerify}
										css={[
											tw`cursor-pointer inline-flex justify-center w-full mr-3 rounded-md border border-gray-300 px-4 py-2 shadow-sm text-sm font-medium  text-gray-700 bg-white `,
											disableSiteVerify
												? tw`opacity-50 cursor-not-allowed`
												: tw`hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`
										]}
										onClick={() => setShowModal(!showModal)}
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
 * Memoized custom `SiteVerifyModal` component
 */
const ForwardRefSiteVerifyModal = forwardRef(SiteVerifyModal);
export const MemoizedSiteVerifyModal = memo(ForwardRefSiteVerifyModal);
