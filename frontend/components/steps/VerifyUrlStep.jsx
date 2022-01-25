import { MemoizedVerifyUrlStepForm } from "@components/forms/VerifyUrlStepForm";
import { MemoizedShowHelpModal } from "@components/modals/ShowHelpModal";
import { ClipboardIcon, QuestionMarkCircleIcon } from "@heroicons/react/solid";
import { useComponentVisible } from "@hooks/useComponentVisible";
import { useLoading } from "@hooks/useLoading";
import { useSites } from "@hooks/useSites";
import useTranslation from "next-translate/useTranslation";
import PropTypes from "prop-types";
import { memo, useCallback, useEffect, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import ReactHtmlParser from "react-html-parser";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import tw from "twin.macro";

/**
 * Custom function to render the `VerifyUrl` component
 */
const VerifyUrlStep = (props) => {
	const [copied, setCopied] = useState(false);
	const [copyValue, setCopyValue] = useState("");
	const [disableSiteVerify, setDisableSiteVerify] = useState(false);
	const [siteData, setSiteData] = useState(null);

	// Props
	const { sid = null, step = null, verified = false } = props;

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

	// SWR hooks
	const { sites, errorSites, validatingSites } = useSites();

	// Custom hooks
	const {
		ref: showModalRef,
		isComponentVisible: showModal,
		setIsComponentVisible: setShowModal
	} = useComponentVisible(false);
	const { isComponentReady } = useLoading();

	// Handle site data selection based on the given `sid` query value
	const handleSiteDataSelection = useCallback(async () => {
		if (!validatingSites) {
			if (!errorSites && typeof sites !== "undefined" && sites !== null) {
				setSiteData(sites?.data?.results?.find((site) => site?.id === sid) ?? null);
			}
		}
	}, [sid, sites, errorSites, validatingSites]);

	useEffect(() => {
		let isMounted = true;

		if (isMounted) {
			handleSiteDataSelection();
		}

		return () => {
			isMounted = false;
		};
	}, [handleSiteDataSelection]);

	// Handle site data
	const handleSiteData = useCallback(async () => {
		if (siteData !== null && Object.keys(siteData)?.length > 0) {
			const siteVerificationId = siteData?.verification_id ?? null;

			if (typeof copyValue === "string" && copyValue == "") {
				setCopyValue('<meta name="epic-crawl-id" content="' + siteVerificationId + '" />');
			}
		}
	}, [siteData]);

	useEffect(() => {
		let isMounted = true;

		if (isMounted) {
			handleSiteData();
		}

		return () => {
			isMounted = false;
		};
	}, [handleSiteData]);

	// Handle input change
	const handleInputChange = ({ copyValue }) => {
		setCopyValue({ copyValue, copied });
	};

	return step === 2 || step === 3 ? (
		<>
			<MemoizedShowHelpModal ref={showModalRef} showModal={showModal} setShowModal={setShowModal} siteData={siteData} />

			<div tw="block pt-8 pb-12">
				<div tw="py-4 m-auto">
					<div tw="block mb-12">
						<h3 tw="flex-1 text-xl leading-7 font-medium text-gray-900">
							<span tw="flex-1">
								{isComponentReady && siteData !== null && Object.keys(siteData)?.length > 0 ? (
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
						<h4 tw="flex-1 text-lg leading-7 font-normal text-gray-600 mb-5">
							{isComponentReady && siteData !== null && Object.keys(siteData)?.length > 0 ? (
								<>
									<span tw="flex-1">{siteData?.name}</span>
									<span tw="flex-1">
										&nbsp;&#40;
										<a
											href={siteData?.url}
											target="_blank"
											title={siteData?.url}
											tw="break-all text-base leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150"
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
							isComponentReady && siteData !== null && Object.keys(siteData)?.length > 0 ? (
								<>
									<p tw="text-base leading-6 text-gray-700 mb-3">
										<strong>{instructions}:</strong>
									</p>

									<ol tw="list-decimal mb-5 space-y-2">
										<li tw="ml-4 text-sm leading-6 text-gray-600">{instruction1}</li>
										<li tw="ml-4 text-sm leading-6 text-gray-600">
											{ReactHtmlParser(instruction2)}

											<div tw="max-w-2xl">
												<label htmlFor="verify_id_meta_tag" tw="sr-only">
													{verifyIdMetaTag}
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

														<CopyToClipboard onCopy={() => setCopied(true)} text={copyValue}>
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
													<span tw="inline-flex">
														<button
															type="button"
															tw="inline-flex items-center ml-3 text-gray-400 focus:outline-none"
															title={needHelp}
															onClick={() => setShowModal(true)}
														>
															<QuestionMarkCircleIcon tw="h-7 w-7" />
														</button>
													</span>
												</div>
											</div>
										</li>
										<li tw="ml-4 text-sm leading-6 text-gray-600">{instruction3}</li>
									</ol>
								</>
							) : (
								<>
									<p tw="text-base leading-6 text-gray-700 mb-3">
										<Skeleton duration={2} width={100} height={18} />
									</p>

									<div tw="list-decimal mb-5 space-y-2">
										<Skeleton duration={2} width={160} height={24} />
										<Skeleton duration={2} width={320} height={24} />

										<div tw="max-w-2xl">
											<div tw="mt-1 flex items-center">
												<div tw="relative flex items-stretch flex-grow focus-within:z-10">
													<Skeleton duration={2} width={632} height={38} />
												</div>
												<span tw="inline-flex">
													<Skeleton duration={2} width={38} height={38} tw="inline-flex items-center ml-3" />
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
						{...props}
					/>
				</div>
			</div>
		</>
	) : null;
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
