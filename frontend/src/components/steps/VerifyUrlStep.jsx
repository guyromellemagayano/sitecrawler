// React
import * as React from "react";

// External
import { ClipboardIcon, QuestionMarkCircleIcon } from "@heroicons/react/solid";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { NextSeo } from "next-seo";
import PropTypes from "prop-types";
import ReactHtmlParser from "react-html-parser";
import tw from "twin.macro";

// Hooks
import { useComponentVisible } from "@hooks/useComponentVisible";

// Enums
import { AlertLoadInterval, ComponentReadyInterval } from "@enums/GlobalValues";
import { VerifyUrlLabels } from "@enums/VerifyUrlLabels";

// Components
import ErrorNotification from "@components/notifications/ErrorNotification";
import ShowHelpModal from "@components/modals/ShowHelpModal";
import SuccessNotification from "@components/notifications/SuccessNotification";
import VerifyUrlStepForm from "@components/forms/VerifyUrlStepForm";

const VerifyUrl = ({ currentStep, setCurrentStep, setEditMode, setSiteId, siteData }) => {
	const [copied, setCopied] = React.useState(false);
	const [copyValue, setCopyValue] = React.useState(null);
	const [disableSiteVerify, setDisableSiteVerify] = React.useState(false);
	const [enableNextStep, setEnableNextStep] = React.useState(false);
	const [errorMsg, setErrorMsg] = React.useState("");
	const [errorMsgLoaded, setErrorMsgLoaded] = React.useState(false);
	const [siteVerifyId, setSiteVerifyId] = React.useState(null);
	const [successMsg, setSuccessMsg] = React.useState("");
	const [successMsgLoaded, setSuccessMsgLoaded] = React.useState(false);

	const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);

	const pageTitle = "Verify URL";

	const handleInputChange = ({ copyValue }) => {
		setCopyValue({ copyValue, copied });
	};

	const handleInputCopy = () => {
		setCopied(true);
	};

	const handleTriggerHelpModal = () => {
		setIsComponentVisible(!isComponentVisible);
	};

	React.useEffect(() => {
		siteData
			? (() => {
					setCopyValue('<meta name="epic-crawl-id" content="' + siteData?.verification_id + '" />');
					setSiteVerifyId(siteData?.id);
			  })()
			: null;
	}, [siteData]);

	React.useEffect(() => {
		successMsg
			? (() => {
					setTimeout(() => {
						setSuccessMsgLoaded(true);
					}, ComponentReadyInterval);
			  })()
			: null;

		errorMsg
			? () => {
					(() => {
						setTimeout(() => {
							setErrorMsgLoaded(true);
						}, ComponentReadyInterval);
					})();
			  }
			: null;
	}, [successMsg, errorMsg]);

	React.useEffect(() => {
		successMsgLoaded
			? (() => {
					setTimeout(() => {
						setSuccessMsgLoaded(false);
					}, AlertLoadInterval);
			  })()
			: null;

		errorMsgLoaded
			? (() => {
					setTimeout(() => {
						setErrorMsgLoaded(false);
					}, AlertLoadInterval);
			  })()
			: null;
	}, [successMsgLoaded, errorMsgLoaded]);

	return currentStep == 2 ? (
		<>
			<NextSeo title={pageTitle} />

			<SuccessNotification
				successMsg={successMsg}
				successMsgLoaded={successMsgLoaded}
				setSuccessMsgLoaded={setSuccessMsgLoaded}
				successMsgTitle={VerifyUrlLabels[27].label}
			/>

			<ErrorNotification
				errorMsg={errorMsg}
				errorMsgLoaded={errorMsgLoaded}
				setErrorMsgLoaded={setErrorMsgLoaded}
				errorMsgTitle={VerifyUrlLabels[26].label}
			/>

			<ShowHelpModal
				ref={ref}
				copyValue={copyValue}
				setCopyValue={setCopyValue}
				setShowModal={setIsComponentVisible}
				showModal={isComponentVisible}
				siteData={siteData}
			/>

			<div tw="block pt-8 pb-12 px-4">
				<div tw="max-w-full py-4 m-auto">
					<div tw="block mb-12">
						<h4 tw="text-lg leading-7 font-medium text-gray-900 mb-5">
							{VerifyUrlLabels[3].label}: {siteData?.name} (
							<a
								href={siteData?.url}
								target="_blank"
								title={siteData?.url}
								tw="break-all text-base leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150"
								rel="noreferrer"
							>
								{siteData?.url}
							</a>
							)
						</h4>
						<p tw="max-w-full text-base leading-6 text-gray-700 mb-3">
							<strong>{VerifyUrlLabels[4].label}:</strong>
						</p>
						<ol tw="list-decimal mb-5 space-y-2">
							<li tw="ml-4 text-sm leading-6 text-gray-600">{VerifyUrlLabels[5].label}.</li>
							<li tw="ml-4 text-sm leading-6 text-gray-600">
								{ReactHtmlParser(VerifyUrlLabels[6].label)}

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
													<span>
														{copied ? VerifyUrlLabels[7].label : VerifyUrlLabels[8].label}
													</span>
												</button>
											</CopyToClipboard>
										</div>
										<span tw="inline-flex">
											<button
												type="button"
												tw="inline-flex items-center ml-3 text-gray-400 focus:outline-none"
												title={VerifyUrlLabels[24].label}
												onClick={handleTriggerHelpModal}
											>
												<QuestionMarkCircleIcon tw="h-7 w-7" />
											</button>
										</span>
									</div>
								</div>
							</li>
							<li tw="ml-4 text-sm leading-6 text-gray-600">
								{ReactHtmlParser(VerifyUrlLabels[9].label)}
							</li>
						</ol>
					</div>
				</div>

				<div tw="mb-5 sm:flex sm:justify-between">
					<div tw="sm:flex sm:justify-start w-full">
						<VerifyUrlStepForm
							currentStep={currentStep}
							disableSiteVerify={disableSiteVerify}
							enableNextStep={enableNextStep}
							errorMsgLoaded={errorMsgLoaded}
							setCurrentStep={setCurrentStep}
							setDisableSiteVerify={setDisableSiteVerify}
							setEditMode={setEditMode}
							setEnableNextStep={setEnableNextStep}
							setErrorMsg={setErrorMsg}
							setErrorMsgLoaded={setErrorMsgLoaded}
							setSiteId={setSiteId}
							setSiteVerifyId={setSiteVerifyId}
							setSuccessMsg={setSuccessMsg}
							setSuccessMsgLoaded={setSuccessMsgLoaded}
							siteData={siteData}
							siteVerifyId={siteVerifyId}
							successMsgLoaded={successMsgLoaded}
						/>
					</div>
				</div>
			</div>
		</>
	) : null;
};

VerifyUrl.propTypes = {
	currentStep: PropTypes.number,
	setCurrentStep: PropTypes.func,
	setEditMode: PropTypes.func,
	setSiteId: PropTypes.func,
	siteData: PropTypes.shape({
		id: PropTypes.number,
		name: PropTypes.string,
		url: PropTypes.string,
		verification_id: PropTypes.string
	})
};

VerifyUrl.defaultProps = {
	currentStep: null,
	setCurrentStep: null,
	setEditMode: null,
	setSiteId: null,
	siteData: {
		id: null,
		name: null,
		url: null,
		verification_id: null
	}
};

export default VerifyUrl;
