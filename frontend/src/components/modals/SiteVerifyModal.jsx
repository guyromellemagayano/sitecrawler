// React
import * as React from "react";

// NextJS
import Link from "next/link";

// External
import { ClipboardIcon, InformationCircleIcon, XCircleIcon } from "@heroicons/react/solid";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Transition } from "@headlessui/react";
import * as Sentry from "@sentry/nextjs";
import axios from "axios";
import Cookies from "js-cookie";
import PropTypes from "prop-types";
import tw from "twin.macro";
import ReactHtmlParser from "react-html-parser";

// JSON
import DataTableLabel from "public/labels/components/sites/DataTable.json";
import SiteVerifyModalLabel from "./labels/SiteVerifyModal.json";

export const SiteVerifyModal = (props) => {
	const [copied, setCopied] = React.useState(false);
	const [copyValue, setCopyValue] = React.useState(
		`<meta name="epic-crawl-id" content="${props.siteVerificationId}" />`
	);
	const [disableSiteVerify, setDisableSiteVerify] = React.useState(false);
	const [enableNextStep, setEnableNextStep] = React.useState(false);
	const [errorMsg, setErrorMsg] = React.useState(null);
	const [siteVerifyId, setSiteVerifyId] = React.useState(props.siteId);
	const [successMsg, setSuccessMsg] = React.useState(null);

	const siteVerifyApiEndpoint = `/api/site/${props.siteId}/verify/`;
	const siteApiEndpoint = `/api/site/`;

	const handleHideSiteVerifyModal = (e) => {
		return e?.key === "Escape" ? props.setShowModal(false) : null;
	};

	React.useEffect(() => {
		document.addEventListener("keydown", handleHideSiteVerifyModal, true);

		return () => {
			document.removeEventListener("keydown", handleHideSiteVerifyModal, true);
		};
	});

	const handleInputChange = ({ copyValue }) => {
		setCopyValue({ copyValue, copied });
	};

	const handleHiddenInputChange = (e) => {
		setSiteVerifyId({ value: e.currentTarget.site_verify_id.value });
	};

	const handleInputCopy = () => {
		setCopied(true);
	};

	const handleSiteVerification = async (e) => {
		e.preventDefault();

		if (errorMsg) setErrorMsg("");
		if (successMsg) setSuccessMsg("");

		setDisableSiteVerify(!disableSiteVerify);

		const body = {
			sid: e.currentTarget.site_verify_id.value
		};

		const response = await axios
			.post(siteVerifyApiEndpoint, body, {
				headers: {
					"Accept": "application/json",
					"Content-Type": "application/json",
					"X-CSRFToken": Cookies.get("csrftoken")
				}
			})
			.then((response) => {
				return response;
			})
			.catch((error) => {
				return error?.response;
			});

		Math.floor(response?.status / 200) === 1
			? (() => {
					response?.data.verified
						? (() => {
								setTimeout(() => {
									setEnableNextStep(!enableNextStep);
									setSuccessMsg(DataTableLabel[13].label);
									setDisableSiteVerify(false);
								}, 500);
						  })()
						: (() => {
								setErrorMsg(DataTableLabel[14].label);
								setTimeout(() => {
									setDisableSiteVerify(false);
								}, 500);
						  })();
			  })()
			: (() => {
					setErrorMsg(DataTableLabel[15].label);
					setTimeout(() => {
						setDisableSiteVerify(false);
					}, 500);
			  })();
	};

	return (
		<Transition show={props.show}>
			<div tw="fixed z-20 bottom-0 inset-x-0 px-4 pb-4 sm:inset-0 sm:flex sm:items-center sm:justify-center">
				<Transition.Child
					enter="ease-out duration-300"
					enterFrom="opacity-0"
					enterTo="opacity-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100"
					leaveTo="opacity-100"
				>
					<div tw="fixed inset-0 transition-opacity">
						<div tw="absolute inset-0 bg-gray-500 opacity-75"></div>
					</div>
				</Transition.Child>
				<Transition.Child
					enter="ease-out duration-300"
					enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
					enterTo="opacity-100 translate-y-0 sm:scale-100"
					leave="ease-in duration-200"
					leaveFrom="opacity-100 translate-y-0 sm:scale-100"
					leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
				>
					<div
						tw="bg-white rounded-lg px-4 pt-5 pb-4 overflow-hidden transform transition-all sm:max-w-lg sm:w-full sm:p-6"
						role="dialog"
						aria-modal="true"
						aria-labelledby="modal-headline"
					>
						<div tw="sm:flex sm:items-start">
							<div tw="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
								<InformationCircleIcon tw="h-6 w-6 text-yellow-600" />
							</div>
							<div tw="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
								<h3 tw="text-lg leading-6 font-medium text-gray-800" id="modal-headline">
									{DataTableLabel[0].label}
								</h3>

								<div tw="mt-2">
									<span tw="flex flex-col justify-start text-sm font-semibold text-gray-500">
										{props.siteName}
										<a
											href={props.siteUrl}
											target="_blank"
											title={props.siteUrl}
											tw="cursor-pointer break-all leading-6 text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150"
											rel="noreferrer"
										>
											{props.siteUrl}
										</a>
									</span>

									<p tw="text-base font-medium leading-6 text-gray-700 mt-4 mb-3">{DataTableLabel[5].label}</p>
									<ol tw="space-y-2 list-decimal ml-4">
										<li tw="text-sm leading-6 text-gray-500">{DataTableLabel[6].label}</li>
										<li tw="text-sm leading-6 text-gray-500">
											{ReactHtmlParser(DataTableLabel[7].label)}
											<div tw="max-w-2xl">
												<label htmlFor="verify-id-meta-tag" tw="sr-only">
													{SiteVerifyModalLabel[0].label}
												</label>
												<div tw="mt-1 flex">
													<div tw="relative flex items-stretch flex-grow focus-within:z-10">
														<input
															type="text"
															name="verify-id-meta-tag"
															id="verifyidmetatag"
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
																<span>{copied ? DataTableLabel[17].label : DataTableLabel[18].label}</span>
															</button>
														</CopyToClipboard>
													</div>
												</div>
											</div>
										</li>
										<li tw="text-sm leading-6 text-gray-500">{ReactHtmlParser(DataTableLabel[8].label)}</li>
									</ol>
								</div>
								{errorMsg ? (
									<div tw="block my-5">
										<div tw="flex justify-center sm:justify-start">
											<div>
												<h3 tw="text-sm leading-5 font-medium text-red-800 break-words">{errorMsg}</h3>
											</div>
										</div>
									</div>
								) : successMsg ? (
									<div tw="block my-5">
										<div tw="flex justify-center sm:justify-start">
											<div>
												<h3 tw="text-sm leading-5 font-medium text-green-800 break-words">{successMsg}</h3>
											</div>
										</div>
									</div>
								) : null}
							</div>
						</div>

						<div tw="w-full my-3 sm:mt-4 sm:inline-flex sm:flex-row-reverse">
							{!enableNextStep ? (
								<span tw="mt-3 sm:ml-3 flex w-full sm:mt-0 sm:w-auto">
									<form onSubmit={handleSiteVerification} tw="w-full">
										<input
											type="hidden"
											value={siteVerifyId}
											name="site_verify_id"
											onChange={handleHiddenInputChange}
										/>
										<button
											type="submit"
											disabled={disableSiteVerify}
											css={[
												tw`cursor-pointer inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-green-600 text-sm leading-5 font-medium text-white shadow-sm sm:text-sm sm:leading-5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition ease-in-out duration-150`,
												disableSiteVerify
													? tw`opacity-50 cursor-not-allowed`
													: tw`hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 active:bg-green-700`
											]}
										>
											{disableSiteVerify ? DataTableLabel[12].label : DataTableLabel[0].label}
										</button>
									</form>
								</span>
							) : (
								<span tw="mt-3 sm:ml-3 flex w-full sm:mt-0 sm:w-auto">
									<Link href="/site/[siteId]/overview" as={`/site/${props.siteId}/overview`} passHref>
										<a tw="cursor-pointer inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 text-sm leading-5 font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 active:bg-green-700">
											{SiteVerifyModalLabel[5].label}
										</a>
									</Link>
								</span>
							)}

							<span tw="mt-3 flex w-full sm:mt-0 sm:w-auto">
								<button
									type="button"
									disabled={disableSiteVerify}
									css={[
										tw`cursor-pointer inline-flex justify-center w-full rounded-md border border-gray-300 sm:ml-3 px-4 py-2 bg-white text-sm leading-5 font-medium text-gray-700 shadow-sm sm:text-sm sm:leading-5`,
										disableSiteVerify
											? tw`opacity-50 cursor-not-allowed`
											: tw`hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition ease-in-out duration-150`
									]}
									onClick={() => props.setShowModal(!props.show)}
								>
									{SiteVerifyModalLabel[3].label}
								</button>
							</span>
						</div>
					</div>
				</Transition.Child>
			</div>
		</Transition>
	);
};

SiteVerifyModal.propTypes = {};

export const SiteVerifyErrorModal = (props) => {
	const sitesLink = "/sites";

	const handleHideSiteVerifyErrorModal = (e) => {
		return e?.key === "Escape" ? props.setShowModal(false) : null;
	};

	React.useEffect(() => {
		document.addEventListener("keydown", handleHideSiteVerifyErrorModal, true);

		return () => {
			document.removeEventListener("keydown", handleHideSiteVerifyErrorModal, true);
		};
	});

	return (
		<Transition
			show={props.show}
			tw="fixed z-50 bottom-0 inset-x-0 px-4 pb-4 sm:inset-0 sm:flex sm:items-center sm:justify-center"
		>
			<Transition.Child
				enter="ease-out duration-300"
				enterFrom="opacity-0"
				enterTo="opacity-100"
				leave="ease-in duration-200"
				leaveFrom="opacity-100"
				leaveTo="opacity-0"
			>
				<div tw="fixed inset-0 transition-opacity" aria-hidden="true">
					<div tw="absolute inset-0 bg-gray-500 opacity-75"></div>
				</div>
			</Transition.Child>

			<span tw="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>

			<Transition.Child
				enter="ease-out duration-300"
				enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
				enterTo="opacity-100 translate-y-0 sm:scale-100"
				leave="ease-in duration-200"
				leaveFrom="opacity-100 translate-y-0 sm:scale-100"
				leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
			>
				<div
					tw="bg-white rounded-lg px-4 pt-5 pb-4 overflow-hidden transform transition-all sm:max-w-lg sm:w-full sm:p-6"
					role="dialog"
					aria-modal="true"
					aria-labelledby="modal-headline"
				>
					<div tw="sm:flex sm:items-start">
						<div tw="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
							<XCircleIcon tw="h-6 w-6 text-red-600" aria-hidden="true" />
						</div>
						<div tw="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
							<h3 tw="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
								{SiteVerifyModalLabel[1].label}
							</h3>
							<div tw="mt-2">
								<p tw="text-sm leading-5 text-gray-500">{ReactHtmlParser(SiteVerifyModalLabel[2].label)}</p>
							</div>
						</div>
					</div>
					<div tw="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
						<span tw="flex w-full rounded-md shadow-sm sm:w-auto">
							<Link href={sitesLink} passHref>
								<a tw="cursor-pointer w-full mt-3 sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
									{SiteVerifyModalLabel[4].label}
								</a>
							</Link>
						</span>
						<span tw="mt-3 flex w-full sm:mt-0 sm:w-auto">
							<button
								type="button"
								tw="cursor-pointer inline-flex justify-center w-full mr-3 rounded-md border border-gray-300 px-4 py-2 shadow-sm text-sm font-medium  text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
								onClick={() => props.setShowModal(!props.show)}
							>
								{SiteVerifyModalLabel[3].label}
							</button>
						</span>
					</div>
				</div>
			</Transition.Child>
		</Transition>
	);
};

SiteVerifyErrorModal.propTypes = {};
