// React
import * as React from "react";

// NextJS
import Link from "next/link";
import { useRouter } from "next/router";

// External
import { ClipboardIcon, ExclamationIcon, InformationCircleIcon } from "@heroicons/react/solid";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Transition } from "@headlessui/react";
import axios from "axios";
import Cookies from "js-cookie";
import Moment from "react-moment";
import PropTypes from "prop-types";
import ReactHtmlParser from "react-html-parser";
import Skeleton from "react-loading-skeleton";
import tw, { styled } from "twin.macro";

// JSON
import DataTableLabel from "public/labels/components/sites/DataTable.json";

// Hooks
import { useScan, useStats } from "src/hooks/useSite";

// Global axios defaults
axios.defaults.headers.common["Accept"] = "application/json";
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.headers.common["X-CSRFToken"] = Cookies.get("csrftoken");

const DataTableDiv = styled.tbody`
	td {
		& > div {
			max-width: 100%;
			display: block;

			& > div {
				max-width: 100%;
				display: block;
			}
		}
	}

	.link-item {
		max-width: 100%;
		display: block;

		a {
			display: inline-block;
			clear: both;
		}
	}

	.truncate-link {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		max-width: 20rem;
	}
`;

const DataTable = ({ siteId, siteName, siteUrl, siteVerified, siteVerificationId, disableLocalTime, mutateSite }) => {
	const [componentReady, setComponentReady] = React.useState(false);
	const [copied, setCopied] = React.useState(false);
	const [copyValue, setCopyValue] = React.useState(`<meta name="epic-crawl-id" content="${siteVerificationId}" />`);
	const [disableSiteVerify, setDisableSiteVerify] = React.useState(false);
	const [enableNextStep, setEnableNextStep] = React.useState(false);
	const [errorMsg, setErrorMsg] = React.useState(null);
	const [isCrawlFinished, setIsCrawlFinished] = React.useState(null);
	const [isCrawlStarted, setIsCrawlStarted] = React.useState(null);
	const [scanCount, setScanCount] = React.useState(null);
	const [scanForceHttps, setScanForceHttps] = React.useState(null);
	const [scanObjId, setScanObjId] = React.useState(null);
	const [scanFinishedAt, setScanFinishedAt] = React.useState(null);
	const [showDeleteSiteModal, setShowDeleteSiteModal] = React.useState(false);
	const [showVerifySiteModal, setShowVerifySiteModal] = React.useState(false);
	const [siteVerifyId, setSiteVerifyId] = React.useState(siteId);
	const [successMsg, setSuccessMsg] = React.useState(null);
	const [disableDeleteSite, setDisableDeleteSite] = React.useState(false);

	const siteVerifyApiEndpoint = "/api/site/" + siteId + "/verify/";
	const sitesPage = "/sites";

	const calendarStrings = {
		lastDay: "[Yesterday], dddd",
		sameDay: "[Today], dddd",
		lastWeek: "MMMM DD, YYYY",
		sameElse: "MMMM DD, YYYY"
	};

	const router = useRouter();

	const { scan } = useScan({
		querySid: siteId
	});

	React.useEffect(() => {
		let currentScanCount = scan?.count;
		let currentScanObjId = currentScanCount > 1 ? scan?.results[1]?.id : scan?.results[0]?.id;
		let currentScanFinishedAt = scan?.results[0]?.finished_at ?? null;
		let currentScanForcehttps = scan?.results[0]?.force_https ?? null;

		setScanObjId(currentScanObjId);
		setScanCount(currentScanCount);
		setScanFinishedAt(currentScanFinishedAt);
		setScanForceHttps(currentScanForcehttps);

		scanFinishedAt == null && scanForceHttps == null
			? () => {
					setIsCrawlStarted(true);
					setIsCrawlFinished(false);
			  }
			: () => {
					setIsCrawlStarted(false);
					setIsCrawlFinished(true);
			  };
	}, [scan]);

	const { stats } = useStats({
		querySid: siteId,
		scanObjId: scanObjId
	});

	React.useEffect(() => {
		setTimeout(() => {
			setComponentReady(true);
		}, 500);

		return setComponentReady(false);
	}, []);

	const setLinkErrors = () => {
		let valLength = stats?.num_non_ok_links;

		return valLength;
	};

	const setPageErrors = () => {
		let valLength = stats?.num_pages_big + stats?.num_pages_tls_non_ok;

		return valLength;
	};

	const setImageErrors = () => {
		let valLength = stats?.num_non_ok_images + stats?.num_images_with_missing_alts + stats?.num_images_tls_non_ok;

		return valLength;
	};

	const setSeoErrors = () => {
		let valLength =
			stats?.num_pages_without_title +
			stats?.num_pages_without_description +
			stats?.num_pages_without_h1_first +
			stats?.num_pages_without_h2_first;

		return valLength;
	};

	const setTotalIssues = () => {
		let valLength = 0;

		stats
			? (() => {
					valLength = setLinkErrors() + setPageErrors() + setImageErrors() + setSeoErrors();
			  })()
			: null;

		return valLength;
	};

	const handleInputChange = ({ copyValue }) => {
		setCopyValue({ copyValue, copied });
	};

	const handleHiddenInputChange = (e) => {
		setSiteVerifyId({ value: e.currentTarget.site_verify_id.value });
	};

	const handleInputCopy = () => {
		setCopied(true);
	};

	const handleSiteDeletion = async () => {
		let siteIdApiEndpoint = "/api/site/" + siteId + "/";

		setDisableDeleteSite(!disableDeleteSite);

		const response = await axios
			.delete(siteIdApiEndpoint)
			.then((response) => {
				return response;
			})
			.catch((error) => {
				return error?.response;
			});

		Math.floor(response?.status / 200) === 1
			? (() => {
					setShowDeleteSiteModal(!showDeleteSiteModal);
					setDisableDeleteSite(!disableDeleteSite);
			  })()
			: null;

		mutateSite;
		router.push(sitesPage);
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
			.post(siteVerifyApiEndpoint, body)
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
					setSubmitting(false);
					resetForm({ values: "" });
					setErrorMsg(DataTableLabel[15]);
			  })();
	};

	return (
		<>
			{/* TODO: Convert this to a single component */}
			<Transition show={showVerifySiteModal}>
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
										{DataTableLabel[0].label}: {siteName} (
										<a
											href={siteUrl}
											target="_blank"
											title={siteUrl}
											tw="cursor-pointer break-all text-base leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150"
											rel="noreferrer"
										>
											{siteUrl}
										</a>
										)
									</h3>
									<div tw="mt-2">
										<p tw="text-base font-medium leading-6 text-gray-700 mt-4 mb-3">{DataTableLabel[5].label}</p>
										<ol tw="space-y-2 list-decimal ml-4">
											<li tw="text-sm leading-6 text-gray-600">{DataTableLabel[6].label}</li>
											<li tw="text-sm leading-6 text-gray-600">
												{ReactHtmlParser(DataTableLabel[7].label)}
												<div tw="max-w-2xl">
													<label htmlFor="verify-id-meta-tag" tw="sr-only">
														Verify ID Meta Tag
													</label>
													<div tw="mt-1 flex">
														<div tw="relative flex items-stretch flex-grow focus-within:z-10">
															<input
																type="text"
																name="verify-id-meta-tag"
																id="verifyidmetatag"
																css={[
																	tw`text-gray-400 focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300`,
																	disableSiteVerify && tw`opacity-50 bg-gray-200 cursor-not-allowed`
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
																			? tw`opacity-50 bg-gray-200 cursor-not-allowed`
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
											<li tw="text-sm leading-6 text-gray-600">{ReactHtmlParser(DataTableLabel[8].label)}</li>
										</ol>
									</div>

									{errorMsg && (
										<div tw="block my-5">
											<div tw="flex justify-center sm:justify-start">
												<div>
													<h3 tw="text-sm leading-5 font-medium text-red-800 break-words">{errorMsg}</h3>
												</div>
											</div>
										</div>
									)}

									{successMsg && (
										<div tw="block my-5">
											<div tw="flex justify-center sm:justify-start">
												<div>
													<h3 tw="text-sm leading-5 font-medium text-green-800 break-words">{successMsg}</h3>
												</div>
											</div>
										</div>
									)}
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
										<Link href="/site/[siteId]/overview" as={`/site/${siteId}/overview`} passHref>
											<a tw="cursor-pointer inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 text-sm leading-5 font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 active:bg-green-700">
												Go to Site Overview
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
										onClick={() => {
											setTimeout(() => setShowVerifySiteModal(!showVerifySiteModal), 500);
										}}
									>
										Close
									</button>
								</span>
							</div>
						</div>
					</Transition.Child>
				</div>
			</Transition>

			{/* TODO: Convert this to a single component */}
			<Transition show={showDeleteSiteModal}>
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
								<div tw="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
									<ExclamationIcon tw="h-6 w-6 text-red-600" />
								</div>
								<div tw="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
									<h3 tw="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
										{DataTableLabel[1].label}
									</h3>
									<div tw="mt-2">
										<p tw="text-sm leading-5 text-gray-500">{DataTableLabel[9].label}</p>
									</div>
								</div>
							</div>
							<div tw="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
								<span tw="flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto">
									<button
										type="button"
										disabled={disableDeleteSite}
										css={[
											tw`cursor-pointer inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-red-600 text-sm leading-5 font-medium text-white shadow-sm sm:text-sm sm:leading-5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition ease-in-out duration-150`,
											disableDeleteSite
												? tw`opacity-50 cursor-not-allowed`
												: tw`hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 active:bg-red-700`
										]}
										onClick={handleSiteDeletion}
									>
										{disableDeleteSite ? DataTableLabel[23].label : DataTableLabel[10].label}
									</button>
								</span>
								<span tw="mt-3 flex w-full sm:mt-0 sm:w-auto">
									<button
										type="button"
										disabled={disableDeleteSite}
										css={[
											tw`cursor-pointer inline-flex justify-center w-full rounded-md border border-gray-300 sm:ml-3 px-4 py-2 bg-white text-sm leading-5 font-medium text-gray-700 shadow-sm sm:text-sm sm:leading-5`,
											disableDeleteSite
												? tw`opacity-50 cursor-not-allowed`
												: tw`hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition ease-in-out duration-150`
										]}
										onClick={() => {
											setTimeout(() => setShowDeleteSiteModal(!showDeleteSiteModal), 150);
										}}
									>
										{DataTableLabel[16].label}
									</button>
								</span>
							</div>
						</div>
					</Transition.Child>
				</div>
			</Transition>

			<DataTableDiv tw="relative">
				<tr>
					<td tw="flex-none px-6 py-4 whitespace-nowrap border-b border-gray-300">
						<span tw="flex items-center">
							<span>
								{componentReady ? (
									!siteVerified ? (
										<>
											<span
												aria-label="Not Verified"
												tw="relative -left-3 flex-shrink-0 inline-block h-2 w-2 rounded-full leading-5 bg-red-400"
											></span>
											<div tw="inline-flex flex-col justify-start items-start">
												{scanCount > 0 ? (
													<Link href="/site/[siteId]/overview" as={`/site/${siteId}/overview`} passHref>
														<a
															className="truncate-link"
															tw="max-w-2xl text-sm leading-6 font-semibold text-blue-900 hover:text-blue-900"
															title={siteName}
														>
															{siteName}
														</a>
													</Link>
												) : (
													<span tw="flex items-center justify-start text-sm leading-6 font-semibold text-gray-600">
														{siteName}
													</span>
												)}

												<span tw="flex justify-start text-sm leading-5 text-gray-500">
													<button
														type="button"
														id="siteVerifySiteModalButton"
														tw="cursor-pointer flex items-center justify-start text-sm focus:outline-none leading-6 font-semibold text-yellow-600 hover:text-yellow-500 transition ease-in-out duration-150"
														onClick={() => setShowVerifySiteModal(!showVerifySiteModal)}
													>
														{DataTableLabel[0].label}
													</button>
													<button
														type="button"
														id="siteVerifySiteModalButton"
														tw="cursor-pointer ml-3 flex items-center justify-start text-sm focus:outline-none leading-6 font-semibold text-red-600 hover:text-red-500 transition ease-in-out duration-150"
														onClick={(e) => setShowDeleteSiteModal(!showDeleteSiteModal)}
													>
														{DataTableLabel[1].label}
													</button>
												</span>
											</div>
										</>
									) : (
										<>
											<span
												aria-label="Verified"
												css={[
													tw`relative -left-3 flex-shrink-0 inline-block h-2 w-2 rounded-full`,
													isCrawlStarted && !isCrawlFinished ? tw`bg-yellow-400` : tw`bg-green-400`
												]}
											></span>
											<div tw="inline-flex flex-col justify-start items-start">
												<Link href="/site/[siteId]/overview" as={`/site/${siteId}/overview`} passHref>
													<a
														className="truncate-link"
														tw="max-w-2xl text-sm leading-6 font-semibold text-blue-900 hover:text-blue-900"
														title={siteName}
													>
														{siteName}
													</a>
												</Link>
												<span tw="flex justify-start text-sm leading-5">
													<Link href={siteUrl} passHref>
														<a
															tw="cursor-pointer flex items-center justify-start text-sm focus:outline-none leading-6 font-semibold text-gray-600 hover:text-gray-500 transition ease-in-out duration-150"
															title={DataTableLabel[26].label}
															target="_blank"
														>
															{DataTableLabel[26].label}
														</a>
													</Link>
												</span>
											</div>
										</>
									)
								) : (
									<>
										<span tw="flex flex-row items-center py-2 space-x-3">
											<Skeleton circle={true} duration={2} width={9} height={9} className="relative top-1" />
											<Skeleton duration={2} width={150} />
										</span>
										<span tw="ml-5 flex justify-start text-sm leading-5 text-gray-500">
											<Skeleton duration={2} width={75} />
										</span>
									</>
								)}
							</span>
						</span>
					</td>
					<td tw="px-6 py-4 whitespace-nowrap border-b border-gray-300 text-sm text-gray-500 leading-5">
						{componentReady ? (
							<span
								css={[
									tw`text-sm leading-5 text-gray-500`,
									scanFinishedAt == null && scanForceHttps == null ? tw`text-yellow-500` : tw`text-green-500`
								]}
							>
								{scanFinishedAt == null && scanForceHttps == null && scanCount > 1
									? DataTableLabel[19].label
									: scanFinishedAt !== null && scanForceHttps !== null && scanCount > 1
									? DataTableLabel[20].label
									: scanFinishedAt == null && scanForceHttps == null && scanCount == 1
									? DataTableLabel[24].label
									: scanFinishedAt !== null && scanForceHttps !== null && scanCount == 1
									? DataTableLabel[21].label
									: DataTableLabel[2].label}
							</span>
						) : (
							<Skeleton duration={2} width={100} />
						)}
					</td>
					<td tw="px-6 py-4 whitespace-nowrap border-b border-gray-300 text-sm text-gray-500 leading-5">
						{componentReady ? (
							scanCount > 0 ? (
								<span tw="space-x-2">
									<span tw="text-sm leading-5 text-gray-500">
										{!disableLocalTime ? (
											<Moment
												calendar={calendarStrings}
												date={
													scanFinishedAt == null && scanForceHttps == null && scanCount > 1
														? scan?.results[1]?.finished_at
														: scan?.results[0]?.finished_at
												}
												local
											/>
										) : (
											<Moment
												calendar={calendarStrings}
												date={
													scanFinishedAt == null && scanForceHttps == null && scanCount > 1
														? scan?.results[1]?.finished_at
														: scan?.results[0]?.finished_at
												}
												utc
											/>
										)}
									</span>
									<span tw="text-sm leading-5 text-gray-500">
										{!disableLocalTime ? (
											<Moment
												date={
													scanFinishedAt == null && scanForceHttps == null && scanCount > 1
														? scan?.results[1]?.finished_at
														: scan?.results[0]?.finished_at
												}
												format="hh:mm:ss A"
												local
											/>
										) : (
											<Moment
												date={
													scanFinishedAt == null && scanForceHttps == null && scanCount > 1
														? scan?.results[1]?.finished_at
														: scan?.results[0]?.finished_at
												}
												format="hh:mm:ss A"
												utc
											/>
										)}
									</span>
									{disableLocalTime && <span tw="text-sm leading-5 font-medium text-gray-500">(UTC)</span>}
								</span>
							) : (
								<span tw="space-x-2">
									<span tw="text-sm leading-5 text-gray-500">{DataTableLabel[22].label}</span>
								</span>
							)
						) : (
							<Skeleton duration={2} width={176.7} />
						)}
					</td>
					<td tw="px-6 py-4 whitespace-nowrap border-b border-gray-300 text-sm text-gray-500 leading-5 font-semibold">
						{componentReady ? (
							stats ? (
								<Link href="/site/[siteId]/overview" as={`/site/${siteId}/overview`} passHref>
									<a css={[tw`cursor-pointer`, setTotalIssues() > 0 ? tw`text-red-500` : tw`text-green-500`]}>
										{setTotalIssues()}
									</a>
								</Link>
							) : (
								0
							)
						) : (
							<Skeleton duration={2} width={45} />
						)}
					</td>
					<td
						css={[
							tw`px-6 py-4 whitespace-nowrap border-b border-gray-300 text-sm text-gray-500 leading-5 font-semibold`
						]}
					>
						{componentReady ? (
							stats ? (
								<Link href="/site/[siteId]/links" as={`/site/${siteId}/links`} passHref>
									<a tw="cursor-pointer text-sm leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150">
										{stats.num_links}
									</a>
								</Link>
							) : (
								0
							)
						) : (
							<Skeleton duration={2} width={45} />
						)}
					</td>
					<td tw="px-6 py-4 whitespace-nowrap border-b border-gray-300 text-sm text-gray-500 leading-5 font-semibold">
						{componentReady ? (
							stats ? (
								<Link href="/site/[siteId]/pages" as={`/site/${siteId}/pages`} passHref>
									<a tw="cursor-pointer text-sm leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150">
										{stats.num_pages}
									</a>
								</Link>
							) : (
								0
							)
						) : (
							<Skeleton duration={2} width={45} />
						)}
					</td>
					<td tw="px-6 py-4 whitespace-nowrap border-b border-gray-300 text-sm text-gray-500 leading-5 font-semibold">
						{componentReady ? (
							stats ? (
								<Link href="/site/[siteId]/images" as={`/site/${siteId}/images`} passHref>
									<a tw="cursor-pointer text-sm leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150">
										{stats.num_images}
									</a>
								</Link>
							) : (
								0
							)
						) : (
							<Skeleton duration={2} width={45} />
						)}
					</td>
				</tr>
			</DataTableDiv>
		</>
	);
};

DataTable.propTypes = {};

export default DataTable;
