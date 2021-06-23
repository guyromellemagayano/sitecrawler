// React
import * as React from "react";

// NextJS
import Link from "next/link";

// External
import { ClipboardIcon, QuestionMarkCircleIcon } from "@heroicons/react/solid";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { NextSeo } from "next-seo";
import { Transition } from "@headlessui/react";
import axios from "axios";
import Cookies from "js-cookie";
import loadable from "@loadable/component";
import PropTypes from "prop-types";
import ReactHtmlParser from "react-html-parser";
import tw, { styled } from "twin.macro";

// JSON
import VerifyUrlLabel from "public/labels/pages/add-new-site/verify-url.json";

// Loadable
const ErrorNotification = loadable(() => import("src/components/notifications/ErrorNotification"));
const SuccessNotification = loadable(() => import("src/components/notifications/SuccessNotification"));

// Global axios defaults
axios.defaults.headers.common["Accept"] = "application/json";
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.headers.common["X-CSRFToken"] = Cookies.get("csrftoken");

const VerifyUrlDiv = styled.div``;

const VerifyUrl = (props) => {
	const [copied, setCopied] = React.useState(false);
	const [copyValue, setCopyValue] = React.useState(null);
	const [disableSiteVerify, setDisableSiteVerify] = React.useState(false);
	const [enableNextStep, setEnableNextStep] = React.useState(false);
	const [errorMsg, setErrorMsg] = React.useState("");
	const [errorMsgLoaded, setErrorMsgLoaded] = React.useState(false);
	const [htmlCopied, setHtmlCopied] = React.useState(false);
	const [showHelpModal, setShowHelpModal] = React.useState(false);
	const [siteVerifyId, setSiteVerifyId] = React.useState(null);
	const [successMsg, setSuccessMsg] = React.useState("");
	const [successMsgLoaded, setSuccessMsgLoaded] = React.useState(false);

	const pageTitle = "Verify URL";

	let htmlText = "1. Sign in to the administrator account of the following website: " + props?.siteData?.url + "\n\n";
	htmlText +=
		"2. Copy the following meta tag and add it within your website's <head> tag: " + "\n" + copyValue + "\n\n";
	htmlText += "3. Save the changes you made in that file." + "\n\n";
	htmlText += "4. Inform your client that you already made the update to the website.";

	const handleInputChange = ({ copyValue }) => {
		setCopyValue({ copyValue, copied });
	};

	const handleTextareaChange = ({ copyValue }) => {
		setCopyValue({ copyValue, htmlCopied });
	};

	const handleHiddenInputChange = (e) => {
		setSiteVerifyId({ value: e?.currentTarget.site_verify_id.value });
	};

	const handleInputCopy = () => {
		setCopied(true);
	};

	const handleTextAreaCopy = () => {
		setHtmlCopied(true);
	};

	const handleTriggerHelpModal = () => {
		setShowHelpModal(!showHelpModal);
	};

	const handleSubmit = async (e) => {
		e?.preventDefault();

		setDisableSiteVerify(!disableSiteVerify);

		const body = {
			sid: e?.currentTarget?.site_verify_id?.value
		};

		const response = await axios
			.post("/api/site/" + body?.sid + "/verify/", body)
			.then((response) => {
				return response;
			})
			.catch((error) => {
				return error.response;
			});
		const data = await response?.data;

		if (Math.floor(response?.status / 200) === 1) {
			if (data?.verified === true) {
				setSuccessMsg(VerifyUrlLabel[20].label);
				setSuccessMsgLoaded(!successMsgLoaded);
				setTimeout(() => {
					setEnableNextStep(!enableNextStep);
					setDisableSiteVerify(false);
				}, 1000);
			} else {
				setErrorMsg(VerifyUrlLabel[21].label);
				setErrorMsgLoaded(!errorMsgLoaded);
				setTimeout(() => {
					setDisableSiteVerify(false);
				}, 1000);
			}
		} else {
			setErrorMsg(VerifyUrlLabel[21].label);
			setErrorMsgLoaded(!errorMsgLoaded);

			return null;
		}
	};

	const handleEditMode = (e) => {
		e.preventDefault();

		props?.setSiteId(props?.siteData?.id);
		props?.setEditMode(true);
		props?.setCurrentStep(props?.currentStep - 1);
	};

	React.useEffect(() => {
		setCopyValue('<meta name="epic-crawl-id" content="' + props?.siteData?.verification_id + '" />');
		setSiteVerifyId(props?.siteData?.id);
	}, [props]);

	React.useEffect(() => {
		successMsg
			? (() => {
					setTimeout(() => {
						setSuccessMsgLoaded(true);
					}, 500);
			  })()
			: null;

		errorMsg
			? () => {
					(() => {
						setTimeout(() => {
							setErrorMsgLoaded(true);
						}, 500);
					})();
			  }
			: null;
	}, [successMsg, errorMsg]);

	React.useEffect(() => {
		successMsgLoaded
			? (() => {
					setTimeout(() => {
						setSuccessMsgLoaded(false);
					}, 3500);
			  })()
			: null;

		errorMsgLoaded
			? (() => {
					setTimeout(() => {
						setErrorMsgLoaded(false);
					}, 3500);
			  })()
			: null;
	}, [successMsgLoaded, errorMsgLoaded]);

	return props?.currentStep == 2 ? (
		<>
			<NextSeo title={pageTitle} />

			<SuccessNotification
				successMsg={successMsg}
				successMsgLoaded={successMsgLoaded}
				setSuccessMsgLoaded={setSuccessMsgLoaded}
				successMsgTitle={VerifyUrlLabel[27].label}
			/>

			<ErrorNotification
				errorMsg={errorMsg}
				errorMsgLoaded={errorMsgLoaded}
				setErrorMsgLoaded={setErrorMsgLoaded}
				errorMsgTitle={VerifyUrlLabel[26].label}
			/>

			{/* TODO: Convert this into a single component */}
			<Transition show={showHelpModal}>
				<div tw="fixed z-50 inset-0 overflow-y-auto">
					<div tw="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
						<Transition.Child
							enter="ease-out duration-300"
							enterFrom="opacity-0"
							enterTo="opacity-100"
							leave="ease-in duration-200"
							leaveFrom="opacity-100"
							leaveTo="opacity-0"
							tw="fixed inset-0 transition-opacity"
						>
							<div aria-hidden="true">
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
							tw="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full sm:p-6"
						>
							<div role="dialog" aria-modal="true" aria-labelledby="modal-headline">
								<div>
									<div tw="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
										<QuestionMarkCircleIcon tw="h-6 w-6 text-yellow-600" />
									</div>
									<div tw="w-full text-center mt-5 sm:rounded-lg inline-block">
										<h3 tw="text-lg leading-6 font-medium text-gray-900">{VerifyUrlLabel[14].label}</h3>
										<div tw="mt-2 max-w-full text-sm leading-5 text-gray-800">
											<p tw="italic mb-3">{VerifyUrlLabel[15].label}</p>
											<ol tw="mt-8 mb-3 text-left list-decimal space-y-3">
												<li tw="ml-4 text-sm leading-6 text-gray-800">
													{ReactHtmlParser(VerifyUrlLabel[16].label)}
													<br tw="mb-2" />
													<textarea
														name="verify_site_instructions"
														id="instructions"
														tw="h-56 resize-none block w-full p-3 pb-0 mb-3 text-gray-400 focus:ring-indigo-500 focus:border-indigo-500 rounded-md sm:text-sm border-gray-300"
														value={htmlText}
														onChange={handleTextareaChange}
													></textarea>
													<CopyToClipboard onCopy={handleTextAreaCopy} text={htmlText}>
														<button tw="cursor-pointer inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
															<span>{htmlCopied ? VerifyUrlLabel[7].label : VerifyUrlLabel[8].label}</span>
														</button>
													</CopyToClipboard>
												</li>
												<li tw="ml-4 text-sm leading-6 text-gray-800">{VerifyUrlLabel[17].label}</li>
											</ol>
										</div>
									</div>
								</div>
								<div tw="mt-5 sm:mt-6">
									<button
										type="button"
										tw="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
										onClick={() => setTimeout(() => setShowHelpModal(!showHelpModal), 150)}
									>
										{VerifyUrlLabel[25].label}
									</button>
								</div>
							</div>
						</Transition.Child>
					</div>
				</div>
			</Transition>

			<VerifyUrlDiv tw="block pt-8 pb-12 px-4">
				<div tw="max-w-full py-4 m-auto">
					<div tw="block mb-12">
						<h4 tw="text-lg leading-7 font-medium text-gray-900 mb-5">
							{VerifyUrlLabel[3].label}: {props?.siteData?.name} (
							<a
								href={props?.siteData?.url}
								target="_blank"
								title={props?.siteData?.url}
								tw="break-all text-base leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150"
								rel="noreferrer"
							>
								{props?.siteData?.url}
							</a>
							)
						</h4>
						<p tw="max-w-full text-base leading-6 text-gray-700 mb-3">
							<strong>{VerifyUrlLabel[4].label}:</strong>
						</p>
						<ol tw="list-decimal mb-5 space-y-2">
							<li tw="ml-4 text-sm leading-6 text-gray-600">{VerifyUrlLabel[5].label}.</li>
							<li tw="ml-4 text-sm leading-6 text-gray-600">
								{ReactHtmlParser(VerifyUrlLabel[6].label)}

								<div tw="max-w-2xl">
									<label htmlFor="verify_id_meta_tag" tw="sr-only">
										Verify ID Meta Tag
									</label>
									<div tw="mt-1 flex">
										<div tw="relative flex items-stretch flex-grow focus-within:z-10">
											<input
												type="text"
												name="verifyidmetatag"
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
													<span>{copied ? VerifyUrlLabel[7].label : VerifyUrlLabel[8].label}</span>
												</button>
											</CopyToClipboard>
										</div>
										<span tw="inline-flex">
											<button
												type="button"
												tw="inline-flex items-center ml-3 text-gray-400 focus:outline-none"
												title={VerifyUrlLabel[24].label}
												onClick={handleTriggerHelpModal}
											>
												<QuestionMarkCircleIcon tw="h-7 w-7" />
											</button>
										</span>
									</div>
								</div>
							</li>
							<li tw="ml-4 text-sm leading-6 text-gray-600">{ReactHtmlParser(VerifyUrlLabel[9].label)}</li>
						</ol>
					</div>
				</div>

				<div tw="mb-5 sm:flex sm:justify-between">
					<div tw="sm:flex sm:justify-start w-full">
						<form onSubmit={handleSubmit} tw="sm:flex sm:items-center w-full">
							<input type="hidden" value={siteVerifyId} name="site_verify_id" onChange={handleHiddenInputChange} />
							<div tw="flex lg:justify-between w-full">
								{enableNextStep ? (
									<span tw="inline-flex">
										<Link href="/site/[id]/overview" as={`/site/${props?.siteData?.id}/overview`} passHref>
											<a
												css={[
													tw`cursor-pointer inline-flex sm:mt-0 relative items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600`,
													disableSiteVerify
														? tw`opacity-50 bg-green-400 cursor-not-allowed`
														: tw`hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`
												]}
											>
												{VerifyUrlLabel[13].label}
											</a>
										</Link>
									</span>
								) : (
									<>
										<div>
											<span tw="inline-flex">
												<button
													type="submit"
													disabled={disableSiteVerify}
													css={[
														tw`w-full mt-3 mr-3 sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600`,
														disableSiteVerify
															? tw`opacity-50 cursor-not-allowed`
															: tw`hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`
													]}
												>
													{disableSiteVerify ? VerifyUrlLabel[18].label : VerifyUrlLabel[10].label}
												</button>
											</span>

											<span tw="inline-flex">
												<Link href="/sites" passHref>
													<a
														disabled={disableSiteVerify}
														css={[
															tw`cursor-pointer w-full mt-3 mr-3 sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-yellow-600`,
															disableSiteVerify
																? tw`opacity-50 cursor-not-allowed`
																: tw`hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500`
														]}
													>
														{VerifyUrlLabel[11].label}
													</a>
												</Link>
											</span>
										</div>

										<div>
											<span tw="inline-flex">
												<button
													disabled={disableSiteVerify}
													css={[
														tw`cursor-pointer w-full mt-3 mr-3 sm:mt-0 relative inline-flex items-center px-4 py-2 rounded-md border border-gray-300 text-sm leading-5 font-medium text-gray-700 bg-white`,
														disableSiteVerify
															? tw`opacity-50 cursor-not-allowed`
															: tw`hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`
													]}
													onClick={handleEditMode}
												>
													{VerifyUrlLabel[12].label}
												</button>
											</span>
										</div>
									</>
								)}
							</div>
						</form>
					</div>
				</div>
			</VerifyUrlDiv>
		</>
	) : null;
};

export default VerifyUrl;
