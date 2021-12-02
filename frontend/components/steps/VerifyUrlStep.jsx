// React
import { useState, useEffect } from "react";

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
import ErrorMessageAlert from "@components/alerts/ErrorMessageAlert";
import ShowHelpModal from "@components/modals/ShowHelpModal";
import SuccessMessageAlert from "@components/alerts/SuccessMessageAlert";
import VerifyUrlStepForm from "@components/forms/VerifyUrlStepForm";

const VerifyUrl = ({ currentStep, setCurrentStep, setEditMode, setSiteId, siteData }) => {
	const [copied, setCopied] = useState(false);
	const [copyValue, setCopyValue] = useState(null);
	const [disableSiteVerify, setDisableSiteVerify] = useState(false);
	const [enableNextStep, setEnableNextStep] = useState(false);
	const [errorMsg, setErrorMsg] = useState([]);
	const [siteVerifyId, setSiteVerifyId] = useState(null);
	const [successMsg, setSuccessMsg] = useState([]);

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

	useEffect(() => {
		siteData
			? (() => {
					setCopyValue('<meta name="epic-crawl-id" content="' + siteData?.verification_id + '" />');
					setSiteVerifyId(siteData?.id);
			  })()
			: null;
	}, [siteData]);

	return currentStep == 2 ? (
		<div>
			<NextSeo title={pageTitle} />

			{errorMsg.length > 0
				? errorMsg.map((value, index) => <ErrorMessageAlert key={index} message={value} />)
				: null}

			{successMsg.length > 0
				? successMsg.map((value, index) => <SuccessMessageAlert key={index} message={value} />)
				: null}

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
							setCurrentStep={setCurrentStep}
							setDisableSiteVerify={setDisableSiteVerify}
							setEditMode={setEditMode}
							setEnableNextStep={setEnableNextStep}
							setErrorMsg={setErrorMsg}
							setSiteId={setSiteId}
							setSiteVerifyId={setSiteVerifyId}
							setSuccessMsg={setSuccessMsg}
							siteData={siteData}
							siteVerifyId={siteVerifyId}
						/>
					</div>
				</div>
			</div>
		</div>
	) : null;
};

VerifyUrl.propTypes = {
	currentStep: PropTypes.number,
	setCurrentStep: PropTypes.func,
	setEditMode: PropTypes.func,
	setSiteId: PropTypes.func,
	siteData: PropTypes.object
};

VerifyUrl.defaultProps = {
	currentStep: null,
	setCurrentStep: null,
	setEditMode: null,
	setSiteId: null,
	siteData: null
};

export default VerifyUrl;
