// React
import { useState, useEffect } from "react";

// NextJS
import Link from "next/link";

// External
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Transition } from "@headlessui/react";
import loadable from "@loadable/component";
import Moment from "react-moment";
import PropTypes from "prop-types";
import ReactHtmlParser from "react-html-parser";
import Skeleton from "react-loading-skeleton";
import tw, { styled } from "twin.macro";

// JSON
import DataTableLabel from "public/labels/components/sites/DataTable.json";

// Hooks
import useDeleteMethod from "src/hooks/useDeleteMethod";
import usePostMethod from "src/hooks/usePostMethod";
import { useScan, useStats } from "src/hooks/useSite";

// Components
const ClipboardSvg = loadable(() => import("src/components/svg/solid/ClipboardSvg"));
const ExclamationSvg = loadable(() => import("src/components/svg/solid/ExclamationSvg"));
const InformationCircleSvg = loadable(() => import("src/components/svg/solid/InformationCircleSvg"));

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
			max-width: 100%;
			display: block;
		}
	}
`;

const DataTable = ({ site, disableLocalTime }) => {
	const [componentReady, setComponentReady] = useState(false);
	const [copied, setCopied] = useState(false);
	const [copyValue, setCopyValue] = useState(`<meta name="epic-crawl-id" content="${site.verification_id}" />`);
	const [crawlInProgress, setCrawlInProgress] = useState(false);
	const [disableSiteVerify, setDisableSiteVerify] = useState(false);
	const [enableNextStep, setEnableNextStep] = useState(false);
	const [errorMsg, setErrorMsg] = useState(null);
	const [scanData, setScanData] = useState([]);
	const [scanObjId, setScanObjId] = useState(0);
	const [showDeleteSiteModal, setShowDeleteSiteModal] = useState(false);
	const [showVerifySiteModal, setShowVerifySiteModal] = useState(false);
	const [siteVerifyId, setSiteVerifyId] = useState(site.id);
	const [statsData, setStatsData] = useState([]);
	const [successMsg, setSuccessMsg] = useState(null);

	const siteIdApiEndpoint = "/api/site/" + site.id;
	const siteVerifyApiEndpoint = "/api/site/" + site.id + "/verify/";
	const calendarStrings = {
		lastDay: "[Yesterday], dddd",
		sameDay: "[Today], dddd",
		lastWeek: "MMMM DD, YYYY",
		sameElse: "MMMM DD, YYYY"
	};

	const { scan: scan } = useScan({
		querySid: site.id,
		refreshInterval: 1000
	});

	useEffect(() => {
		if (scan && scan !== undefined && Object.keys(scan).length > 0) {
			setScanData(scan);
		}
	}, [scan]);

	useEffect(() => {
		if (scanData && scanData !== undefined && scanData !== [] && Object.keys(scanData).length > 0) {
			if (scanData.results && scanData.results !== undefined && Object.keys(scanData.results).length > 0) {
				setScanObjId((prevState) => ({
					...prevState,
					id: scanData.results
						.map((e) => {
							let result = prevState;

							if (e !== undefined && e.finished_at == null) {
								result = e.id;

								setCrawlInProgress(true);

								return result;
							}

							return e.id;
						})
						.sort()
						.reverse()[0]
				}));
			}
		}
	}, [scanData]);

	useEffect(() => {
		if (crawlInProgress) {
			if (scanObjId && scanData.results && scanData.results !== undefined && Object.keys(scanData.results).length > 0) {
				scanData.results
					.filter((result) => result.id == scanObjId.id)
					.map((e) => {
						if (e !== undefined && e.finished_at !== null) {
							setCrawlInProgress(false);
						}
					});
			}
		}
	}, [crawlInProgress, scanObjId]);

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
		await useDeleteMethod(siteIdApiEndpoint);

		setTimeout(() => {
			setShowDeleteSiteModal(false);
		}, 500);
	};

	const handleSiteVerification = async (e) => {
		e.preventDefault();

		if (errorMsg) setErrorMsg("");
		if (successMsg) setSuccessMsg("");

		setDisableSiteVerify(!disableSiteVerify);

		const body = {
			sid: e.currentTarget.site_verify_id.value
		};

		try {
			const response = await usePostMethod(siteVerifyApiEndpoint, body);

			if (Math.floor(response.status / 200) === 1) {
				if (response.data.verified === true) {
					setTimeout(() => {
						setEnableNextStep(!enableNextStep);
						setSuccessMsg(DataTableLabel[13].label);
						setDisableSiteVerify(false);
					}, 500);
				} else {
					setErrorMsg(DataTableLabel[14].label);
					setTimeout(() => {
						setDisableSiteVerify(false);
					}, 500);
				}
			} else {
				// FIXME: Error handling for response
				if (response.data) {
					console.log("ERROR: " + response.data);
				} else {
					setSubmitting(false);
					resetForm({ values: "" });
					setErrorMsg(DataTableLabel[15]);
				}
			}
		} catch (error) {
			throw error.message;
		}
	};

	const { stats: stats } = useStats({
		querySid: site.id,
		scanObjId: scanObjId.id,
		refreshInterval: 1000
	});

	useEffect(() => {
		if (stats && stats !== undefined && Object.keys(stats).length > 0) {
			setStatsData(stats);
		}
	}, [stats]);

	useEffect(() => {
		setTimeout(() => {
			setComponentReady(true);
		}, 500);
	}, []);

	const setSeoErrors = () => {
		let valLength = 0;

		if (statsData && statsData !== undefined && Object.keys(statsData).length > 0) {
			if (
				(statsData.num_pages_without_title !== 0 && statsData.num_pages_without_title !== undefined) ||
				(statsData.num_pages_without_description !== 0 && statsData.num_pages_without_description !== undefined) ||
				(statsData.num_pages_without_h1_first !== 0 && statsData.num_pages_without_h1_first !== undefined) ||
				(statsData.num_pages_without_h2_first !== 0 && statsData.num_pages_without_h2_first !== undefined)
			) {
				valLength =
					(statsData ? statsData.num_pages_without_title : 0) +
					(statsData ? statsData.num_pages_without_description : 0) +
					(statsData ? statsData.num_pages_without_h1_first : 0) +
					(statsData ? statsData.num_pages_without_h2_first : 0);
			}
		}

		return valLength;
	};

	const setPageErrors = () => {
		let valLength = 0;

		if (statsData && statsData !== undefined && Object.keys(statsData).length > 0) {
			if (
				(statsData.num_pages_big !== 0 && statsData.num_pages_big !== undefined) ||
				(statsData.num_pages_tls_non_ok !== 0 && statsData.num_pages_tls_non_ok !== undefined)
			) {
				valLength = (statsData ? statsData.num_pages_big : 0) + (statsData ? statsData.num_pages_tls_non_ok : 0);
			}
		}

		return valLength;
	};

	const setImageErrors = () => {
		let valLength = 0;

		if (statsData && statsData !== undefined && Object.keys(statsData).length > 0) {
			if (statsData.num_non_ok_images !== 0 && statsData.num_non_ok_images !== undefined) {
				valLength = statsData ? statsData.num_non_ok_images : 0;
			}
		}

		return valLength;
	};

	const setTotalIssues = () => {
		let valLength = 0;

		valLength =
			statsData &&
			statsData !== undefined &&
			Object.keys(statsData).length > 0 &&
			statsData.num_non_ok_links + +setSeoErrors() + setPageErrors() + setImageErrors();

		return valLength;
	};

	return (
		<>
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
									<InformationCircleSvg className={tw`h-6 w-6 text-yellow-600`} />
								</div>
								<div tw="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
									<h3 tw="text-lg leading-6 font-medium text-gray-800" id="modal-headline">
										{DataTableLabel[3].label}: {site.name} (
										<a
											href={site.url}
											target="_blank"
											title={site.url}
											tw="cursor-pointer break-all text-base leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150"
										>
											{site.url}
										</a>
										)
									</h3>
									<div tw="mt-2">
										<p tw="text-sm leading-5 text-gray-600">{DataTableLabel[4].label}</p>
										<p tw="text-base font-medium leading-6 text-gray-700 mt-4 mb-3">{DataTableLabel[5].label}</p>
										<ol tw="space-y-2">
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
																	<ClipboardSvg className={tw`h-5 w-5 text-gray-400`} />
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
													tw`cursor-pointer inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 text-sm leading-5 font-medium text-white bg-green-600`,
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
										<Link href="/site/[siteId]/overview" as={`/site/${site.id}/overview`} passHref>
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
										onClick={() => setTimeout(() => setShowVerifySiteModal(!showVerifySiteModal), 150)}
									>
										Close
									</button>
								</span>
							</div>
						</div>
					</Transition.Child>
				</div>
			</Transition>

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
									<ExclamationSvg className={tw`h-6 w-6 text-red-600`} />
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
										tw="cursor-pointer inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-red-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition ease-in-out duration-150 sm:text-sm sm:leading-5"
										onClick={(e) => handleSiteDeletion(e)}
									>
										{DataTableLabel[10].label}
									</button>
								</span>
								<span tw="mt-3 flex w-full sm:mt-0 sm:w-auto">
									<button
										type="button"
										tw="cursor-pointer inline-flex justify-center w-full rounded-md border border-gray-300 sm:ml-3 px-4 py-2 bg-white text-sm leading-5 font-medium text-gray-700 shadow-sm sm:text-sm sm:leading-5 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition ease-in-out duration-150"
										onClick={() => setTimeout(() => setShowDeleteSiteModal(!showDeleteSiteModal), 150)}
									>
										{DataTableLabel[16].label}
									</button>
								</span>
							</div>
						</div>
					</Transition.Child>
				</div>
			</Transition>

			<DataTableDiv tw="bg-white">
				<tr>
					<td tw="flex-none px-6 py-4 whitespace-nowrap border-b border-gray-300">
						<span tw="flex items-center">
							<span>
								<span className="link-item">
									{componentReady ? (
										!site.verified ? (
											<>
												<span tw="truncate text-sm leading-5 font-semibold text-gray-500">{site.name}</span>
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
											</>
										) : (
											<Link href="/site/[siteId]/overview" as={`/site/${site.id}/overview`} passHref>
												<a tw="cursor-pointer text-sm leading-6 font-semibold transition ease-in-out duration-150 text-indigo-600 hover:text-indigo-500">
													{site.name}
												</a>
											</Link>
										)
									) : (
										<Skeleton duration={2} width={150} />
									)}
								</span>
							</span>
						</span>
					</td>
					<td tw="px-6 py-4 whitespace-nowrap border-b border-gray-300">
						{componentReady ? (
							statsData &&
							statsData !== undefined &&
							statsData !== [] &&
							Object.keys(statsData).length > 0 &&
							site.verified ? (
								<span tw="space-x-2">
									<span tw="text-sm leading-5 text-gray-500">
										{!disableLocalTime ? (
											<Moment calendar={calendarStrings} date={statsData.finished_at} local />
										) : (
											<Moment calendar={calendarStrings} date={statsData.finished_at} utc />
										)}
									</span>
									<span tw="text-sm leading-5 text-gray-500">
										{!disableLocalTime ? (
											<Moment date={statsData.finished_at} format="hh:mm:ss A" local />
										) : (
											<Moment date={statsData.finished_at} format="hh:mm:ss A" utc />
										)}
									</span>
								</span>
							) : (
								<span tw="text-sm leading-5 text-gray-500">{DataTableLabel[2].label}</span>
							)
						) : (
							<Skeleton duration={2} width={176.7} />
						)}
					</td>
					<td tw="px-6 py-4 whitespace-nowrap border-b border-gray-300">
						{componentReady ? (
							<span tw="text-sm leading-5 text-gray-500">
								{site.verified ? (crawlInProgress ? DataTableLabel[19].label : DataTableLabel[20].label) : null}
							</span>
						) : (
							<Skeleton duration={2} width={100} />
						)}
					</td>
					<td css={[tw`px-6 py-4 whitespace-nowrap border-b border-gray-300 text-sm leading-5 font-semibold`]}>
						{componentReady ? (
							site.verified ? (
								<Link href="/site/[siteId]/overview" as={`/site/${site.id}/overview`} passHref>
									<a css={[tw`cursor-pointer`, setTotalIssues() > 0 ? tw`text-red-500` : tw`text-green-500`]}>
										{setTotalIssues()}
									</a>
								</Link>
							) : null
						) : (
							<Skeleton duration={2} width={45} />
						)}
					</td>
					<td css={[tw`px-6 py-4 whitespace-nowrap border-b border-gray-300 text-sm leading-5 font-semibold`]}>
						{componentReady ? (
							site.verified ? (
								statsData.num_links > 0 ? (
									<Link href="/site/[siteId]/links" as={`/site/${site.id}/links`} passHref>
										<a tw="cursor-pointer text-sm leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150">
											{statsData.num_links}
										</a>
									</Link>
								) : (
									<span tw="text-sm leading-5 text-gray-500">{statsData.num_links}</span>
								)
							) : null
						) : (
							<Skeleton duration={2} width={45} />
						)}
					</td>
					<td css={[tw`px-6 py-4 whitespace-nowrap border-b border-gray-300 text-sm leading-5 font-semibold`]}>
						{componentReady ? (
							site.verified ? (
								statsData.num_pages > 0 ? (
									<Link href="/site/[siteId]/pages" as={`/site/${site.id}/pages`} passHref>
										<a tw="cursor-pointer text-sm leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150">
											{statsData.num_pages}
										</a>
									</Link>
								) : (
									<span tw="text-sm leading-5 text-gray-500">{statsData.num_pages}</span>
								)
							) : null
						) : (
							<Skeleton duration={2} width={45} />
						)}
					</td>
					<td css={[tw`px-6 py-4 whitespace-nowrap border-b border-gray-300 text-sm leading-5 font-semibold`]}>
						{componentReady ? (
							site.verified ? (
								statsData.num_images > 0 ? (
									<Link href="/site/[siteId]/images" as={`/site/${site.id}/images`} passHref>
										<a tw="cursor-pointer text-sm leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150">
											{statsData.num_images}
										</a>
									</Link>
								) : (
									<span tw="text-sm leading-5 text-gray-500">{statsData.num_images}</span>
								)
							) : null
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
