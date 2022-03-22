import { MemoizedVerifyUrlStepForm } from "@components/forms/VerifyUrlStepForm";
import { MemoizedShowHelpModal } from "@components/modals/ShowHelpModal";
import { SitesApiEndpoint } from "@constants/ApiEndpoints";
import { ResetCopyStateTimeout } from "@constants/GlobalValues";
import { ClipboardIcon, QuestionMarkCircleIcon } from "@heroicons/react/solid";
import { useComponentVisible } from "@hooks/useComponentVisible";
import { useSiteId } from "@hooks/useSiteId";
import { SiteCrawlerAppContext } from "@pages/_app";
import { classnames } from "@utils/classnames";
import useTranslation from "next-translate/useTranslation";
import PropTypes from "prop-types";
import { memo, useContext, useMemo, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/**
 * Custom function to render the `VerifyUrl` component
 */
const VerifyUrlStep = (props) => {
	const [copied, setCopied] = useState(false);
	const [copyValue, setCopyValue] = useState("");
	const [disableSiteVerify, setDisableSiteVerify] = useState(false);
	const [siteData, setSiteData] = useState(null);

	// Props
	const { sid, step, verified } = props;

	// Translation
	const { t } = useTranslation();
	const verifySiteTitle = t("sites:verifySiteTitle");
	const verifiedSiteTitle = t("sites:verifiedSiteTitle");
	const instructions = t("sites:instructions");
	const instruction1 = t("sites:instruction1");
	const instruction2 = t("sites:instruction2");
	const instruction3 = t("sites:instruction3");
	const needHelp = t("sites:needHelp");
	const verifyIdMetaTag = t("sites:verifyIdMetaTag");
	const copiedText = t("common:copiedText");
	const copyText = t("common:copyText");

	// Custom hooks
	const {
		ref: showModalRef,
		isComponentVisible: showModal,
		setIsComponentVisible: setShowModal
	} = useComponentVisible(false);

	// Custom context
	const { isComponentReady } = useContext(SiteCrawlerAppContext);

	// Custom variables
	const customSiteIdApiEndpoint = isComponentReady ? SitesApiEndpoint + sid + "/" : null;

	// SWR hooks
	const { siteId } = useSiteId(customSiteIdApiEndpoint);

	// Handle site data selection based on the given `sid` query value
	useMemo(() => {
		siteId ? setSiteData(siteId?.data) : setSiteData(null);

		return { siteData };
	}, [siteId]);

	// Handle site data
	useMemo(() => {
		const siteVerificationId = siteData?.verification_id ?? null;

		if (typeof copyValue === "string" && copyValue == "" && siteVerificationId) {
			setCopyValue('<meta name="epic-crawl-id" content="' + siteVerificationId + '" />');
		}

		return { copyValue };
	}, [siteData, copyValue]);

	// Handle input change
	const handleInputChange = ({ copyValue }) => {
		setCopyValue({ copyValue, copied });
	};

	// Handle input copy
	const handleInputCopy = () => {
		setCopied(true);
	};

	// Reset copied state after a timeout
	useMemo(() => {
		copied
			? setTimeout(() => {
					setCopied(false);
			  }, ResetCopyStateTimeout)
			: null;

		return { copied };
	}, [copied]);

	return (
		<>
			<MemoizedShowHelpModal
				ref={showModalRef}
				showModal={showModal}
				setShowModal={setShowModal}
				verificationTag={copyValue}
			/>

			<div className="block pt-8 pb-12">
				<div className="m-auto py-4">
					<div className="mb-7 block">
						<h3 className="flex-1 text-xl font-medium leading-7 text-gray-900">
							<span className="flex-1">
								{isComponentReady && siteData ? (
									step === 2 && !verified ? (
										verifySiteTitle + ": "
									) : (
										verifiedSiteTitle + ": "
									)
								) : (
									<Skeleton duration={2} width={128} height={23} />
								)}
							</span>
						</h3>
						<h4 className="mb-5 flex-1 text-lg font-normal leading-7 text-gray-600">
							{isComponentReady && siteData ? (
								<>
									<span className="flex-1">{siteData?.name}</span>
									<span className="flex-1">
										&nbsp;&#40;
										<a
											href={siteData?.url}
											target="_blank"
											title={siteData?.url}
											className="break-all text-base font-semibold leading-6 text-indigo-600 transition duration-150 ease-in-out hover:text-indigo-500"
											rel="noreferrer"
										>
											{siteData?.url}
										</a>
										&#41;
									</span>
								</>
							) : (
								<Skeleton duration={2} width={256} height={21} />
							)}
						</h4>

						{step === 2 && !verified ? (
							isComponentReady && siteData ? (
								<>
									<p className="mb-3 text-base leading-6 text-gray-700">
										<strong>{instructions}:</strong>
									</p>

									<ol className="mb-1 list-decimal space-y-2">
										<li className="ml-4 text-sm leading-6 text-gray-600">{instruction1}</li>
										<li className="ml-4 text-sm leading-6 text-gray-600">
											{instruction2}

											<div className="max-w-2xl">
												<label htmlFor="verify_id_meta_tag" className="sr-only">
													{verifyIdMetaTag}
												</label>
												<div className="mt-1 flex">
													<div className="relative flex flex-grow items-stretch focus-within:z-10">
														<input
															type="text"
															name="verifyidmetatag"
															id="verifyidmetatag"
															className={classnames(
																"block w-full rounded-none rounded-l-md border-gray-300 text-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm",
																disableSiteVerify && "cursor-not-allowed bg-gray-300 opacity-50"
															)}
															value={copyValue}
															onChange={handleInputChange}
															autoComplete="off"
														/>

														<CopyToClipboard onCopy={handleInputCopy} text={copyValue}>
															<button
																className={classnames(
																	"relative -ml-px inline-flex items-center space-x-2 rounded-r-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700",
																	disableSiteVerify
																		? "cursor-not-allowed bg-gray-300 opacity-50"
																		: "hover:bg-gray-100 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
																)}
															>
																<ClipboardIcon className="h-4 w-4 text-gray-400" />
																<span>{copied ? copiedText : copyText}</span>
															</button>
														</CopyToClipboard>
													</div>
													<span className="inline-flex">
														<button
															type="button"
															className="ml-3 inline-flex items-center text-gray-400 focus:outline-none"
															title={needHelp}
															onClick={(e) => setShowModal(!showModal)}
														>
															<QuestionMarkCircleIcon className="h-7 w-7" />
														</button>
													</span>
												</div>
											</div>
										</li>
										<li className="ml-4 text-sm leading-6 text-gray-600">{instruction3}</li>
									</ol>
								</>
							) : (
								<>
									<p className="mb-3 text-base leading-6 text-gray-700">
										<Skeleton duration={2} width={100} height={18} />
									</p>

									<div className="mb-5 list-decimal space-y-2">
										<Skeleton duration={2} width={160} height={24} />
										<Skeleton duration={2} width={320} height={24} />

										<div className="max-w-2xl">
											<div className="mt-1 flex items-center">
												<div className="relative flex flex-grow items-stretch focus-within:z-10">
													<Skeleton duration={2} width={632} height={38} />
												</div>
												<span className="inline-flex">
													<Skeleton duration={2} width={38} height={38} className="ml-3 inline-flex items-center" />
												</span>
											</div>
										</div>

										<Skeleton duration={2} width={320} height={24} />
									</div>
								</>
							)
						) : null}
					</div>

					<MemoizedVerifyUrlStepForm
						disableSiteVerify={disableSiteVerify}
						setDisableSiteVerify={setDisableSiteVerify}
						siteData={siteData}
						{...props}
					/>
				</div>
			</div>
		</>
	);
};

VerifyUrlStep.propTypes = {
	sid: PropTypes.number,
	step: PropTypes.number,
	verified: PropTypes.bool
};

/**
 * Memoized custom `VerifyUrlStep` component
 */
export const MemoizedVerifyUrlStep = memo(VerifyUrlStep);
