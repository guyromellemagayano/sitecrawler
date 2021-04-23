// React
import { useState, useEffect } from "react";

// NextJS
import Link from "next/link";

// External
import { CopyToClipboard } from "react-copy-to-clipboard";
import { NextSeo } from "next-seo";
import { Transition } from "@headlessui/react";
import { withResizeDetector } from "react-resize-detector";
import loadable from "@loadable/component";
import PropTypes from "prop-types";
import ReactHtmlParser from "react-html-parser";
import tw from "twin.macro";

// JSON
import VerifyUrlLabel from "public/labels/pages/add-site/verify-url.json";

// Hooks
import usePostMethod from "src/hooks/usePostMethod";
import useUser from "src/hooks/useUser";
import { useSite } from "src/hooks/useSite";

// Layout
import Layout from "src/components/Layout";

// Components
const AppLogo = loadable(() => import("src/components/logo/AppLogo"));
const ChevronRightSvg = loadable(() => import("src/components/svg/solid/ChevronRightSvg"));
const ClipboardSvg = loadable(() => import("src/components/svg/solid/ClipboardSvg"));
const ErrorNotification = loadable(() => import("src/components/notifications/ErrorNotification"));
const HomeSvg = loadable(() => import("src/components/svg/solid/HomeSvg"));
const HowToSetup = loadable(() => import("src/components/sites/HowToSetup"));
const HowToSetupSkeleton = loadable(() => import("src/components/skeletons/HowToSetupSkeleton"));
const Loader = loadable(() => import("src/components/layout/Loader"));
const MainSidebar = loadable(() => import("src/components/sidebar/MainSidebar"));
const MobileSidebarButton = loadable(() => import("src/components/sidebar/MobileSidebarButton"));
const QuestionMarkCircleSvg = loadable(() => import("src/components/svg/solid/QuestionMarkCircleSvg"));
const SiteAdditionStepsSkeleton = loadable(() => import("src/components/skeletons/SiteAdditionStepsSkeleton"));
const SiteFooter = loadable(() => import("src/components/footer/SiteFooter"));
const SuccessNotification = loadable(() => import("src/components/notifications/SuccessNotification"));

const VerifyUrl = ({ width, sid, sname, surl, vid, v }) => {
	const [copied, setCopied] = useState(false);
	const [copyValue, setCopyValue] = useState(`<meta name="epic-crawl-id" content="${vid}" />`);
	const [disableSiteVerify, setDisableSiteVerify] = useState(false);
	const [enableNextStep, setEnableNextStep] = useState(false);
	const [errorMsg, setErrorMsg] = useState("");
	const [errorMsgLoaded, setErrorMsgLoaded] = useState(false);
	const [htmlCopied, setHtmlCopied] = useState(false);
	const [openMobileSidebar, setOpenMobileSidebar] = useState(false);
	const [pageLoaded, setPageLoaded] = useState(false);
	const [showHelpModal, setShowHelpModal] = useState(false);
	const [siteData, setSiteData] = useState([]);
	const [siteVerifyId, setSiteVerifyId] = useState(sid);
	const [successMsg, setSuccessMsg] = useState("");
	const [successMsgLoaded, setSuccessMsgLoaded] = useState(false);
	const [userData, setUserData] = useState([]);

	const pageTitle = "Verify URL";
	const homeLabel = "Home";
	const homePageLink = "/";
	const sitesApiEndpoint = "/api/site/?ordering=name";

	let htmlText = "1. Sign in to the administrator account of the following website: " + surl + "\n\n";
	htmlText +=
		"2. Copy the following meta tag and add it within your website's <head> tag: " + "\n" + copyValue + "\n\n";
	htmlText += "3. Save the changes you made in that file." + "\n\n";
	htmlText += "4. Inform your client that you already made the update to the website.";

	const { user: user } = useUser({
		redirectIfFound: false,
		redirectTo: "/login"
	});

	const { site: site } = useSite({
		endpoint: sitesApiEndpoint
	});

	const handleInputChange = ({ copyValue }) => {
		setCopyValue({ copyValue, copied });
	};

	const handleTextareaChange = ({ copyValue }) => {
		setCopyValue({ copyValue, htmlCopied });
	};

	const handleHiddenInputChange = (e) => {
		setSiteVerifyId({ value: e.currentTarget.site_verify_id.value });
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
		e.preventDefault();

		try {
			setDisableSiteVerify(!disableSiteVerify);

			const body = {
				sid: e.currentTarget.site_verify_id.value
			};

			const response = await usePostMethod("/api/site/" + body.sid + "/verify/");

			if (Math.floor(response.status / 200) === 1) {
				if (response.data.verified === true) {
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
				// FIXME: Error handling for response
				if (response.data) {
					console.log("ERROR: " + response.data);
				} else {
					setSubmitting(false);
					resetForm({ values: "" });
					setErrorMsg(VerifyUrlLabel[21].label);
					setErrorMsgLoaded(!errorMsgLoaded);
				}
			}
		} catch (error) {
			throw error.message;
		}
	};

	useEffect(() => {
		if (
			user &&
			user !== undefined &&
			Object.keys(user).length > 0 &&
			site &&
			site !== undefined &&
			Object.keys(site).length > 0
		) {
			setTimeout(() => {
				setPageLoaded(true);
			}, 1000);

			setSiteData(site);
			setUserData(user);
		}
	}, [user, site]);

	useEffect(() => {
		if (successMsg && successMsg !== "") {
			setTimeout(() => {
				setSuccessMsgLoaded(true);
			}, 500);
		}

		if (errorMsg && errorMsg !== "") {
			setTimeout(() => {
				setErrorMsgLoaded(true);
			}, 500);
		}
	}, [successMsg, errorMsg]);

	useEffect(() => {
		if (successMsgLoaded) {
			setTimeout(() => {
				setSuccessMsgLoaded(false);
			}, 3500);
		}

		if (errorMsgLoaded) {
			setTimeout(() => {
				setErrorMsgLoaded(false);
			}, 3500);
		}
	}, [successMsgLoaded, errorMsgLoaded]);

	return pageLoaded ? (
		<Layout user={userData}>
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
							className="fixed inset-0 transition-opacity"
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
							className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full sm:p-6"
						>
							<div role="dialog" aria-modal="true" aria-labelledby="modal-headline">
								<div>
									<div tw="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
										<QuestionMarkCircleSvg className={tw`h-6 w-6 text-yellow-600`} />
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
														tw="h-56 resize-none block w-full p-3 pb-0 mb-3 text-gray-400 focus:ring-indigo-500 focus:border-indigo-500 block w-full rounded-md sm:text-sm border-gray-300"
														value={htmlText}
														onChange={handleTextareaChange}
													></textarea>
													<CopyToClipboard onCopy={handleTextAreaCopy} text={htmlText}>
														<button tw="cursor-pointer inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
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

			<section tw="h-screen flex overflow-hidden bg-white">
				<MainSidebar
					width={width}
					user={userData}
					site={siteData}
					openMobileSidebar={openMobileSidebar}
					setOpenMobileSidebar={setOpenMobileSidebar}
				/>

				<div tw="flex flex-col w-0 flex-1 overflow-hidden">
					<div tw="relative z-10 flex-shrink-0 flex h-16 lg:h-0 bg-white border-b lg:border-0 border-gray-200 lg:mb-4">
						<MobileSidebarButton openMobileSidebar={openMobileSidebar} setOpenMobileSidebar={setOpenMobileSidebar} />
						<Link href={homePageLink} passHref>
							<a tw="p-1 block w-full cursor-pointer lg:hidden">
								<AppLogo
									className={tw`mt-4 mx-auto h-8 w-auto`}
									src="/images/logos/site-logo-dark.svg"
									alt="app-logo"
								/>
							</a>
						</Link>
					</div>

					<main tw="flex-1 relative z-0 overflow-y-auto focus:outline-none" tabIndex="0">
						<div tw="w-full p-6 mx-auto grid gap-16 xl:grid-cols-1 2xl:grid-cols-3 lg:col-gap-5 lg:row-gap-12">
							<div tw="lg:col-span-2 xl:col-span-2 xl:pr-8 xl:border-r xl:border-gray-200">
								{pageLoaded ? (
									<>
										<div className="max-w-full py-4 px-8">
											<nav tw="flex pt-4 pb-8" aria-label="Breadcrumb">
												<ol tw="flex items-center space-x-4">
													<li>
														<div>
															<Link href={homePageLink} passHref>
																<a tw="text-gray-400 hover:text-gray-500">
																	<HomeSvg className={tw`flex-shrink-0 h-5 w-5`} />
																	<span tw="sr-only">{homeLabel}</span>
																</a>
															</Link>
														</div>
													</li>
													<li>
														<div tw="flex items-center">
															<ChevronRightSvg className={tw`flex-shrink-0 h-5 w-5 text-gray-400`} />
															<p aria-current="page" tw="cursor-default ml-4 text-sm font-medium text-gray-700">
																{pageTitle}
															</p>
														</div>
													</li>
												</ol>
											</nav>
											<div className="pt-4 m-auto">
												<h4 tw="text-2xl leading-6 font-medium text-gray-900">{VerifyUrlLabel[0].label}</h4>
												<p tw="max-w-full mt-2 text-sm leading-5 text-gray-500">{VerifyUrlLabel[0].description}</p>
											</div>
										</div>

										<nav aria-label="Site Addition Progress" tw="max-w-full p-8 pb-2">
											<ol tw="space-y-4 md:flex md:space-y-0 md:space-x-8">
												<li tw="md:flex-1">
													<span tw="pl-4 py-2 flex flex-col border-l-4 border-indigo-600 hover:border-indigo-800 md:pl-0 md:pt-4 md:pb-0 md:border-l-0 md:border-t-4">
														<span tw="text-xs text-indigo-600 font-semibold tracking-wide uppercase group-hover:text-indigo-800">
															{VerifyUrlLabel[22].label}
														</span>
														<span tw="text-sm font-medium">{VerifyUrlLabel[1].label}</span>
													</span>
												</li>

												<li tw="md:flex-1">
													<span
														tw="pl-4 py-2 flex flex-col border-l-4 border-indigo-600 md:pl-0 md:pt-4 md:pb-0 md:border-l-0 md:border-t-4"
														aria-current="step"
													>
														<span tw="text-xs text-indigo-600 font-semibold tracking-wide uppercase">
															{VerifyUrlLabel[23].label}
														</span>
														<span tw="text-sm font-medium">{VerifyUrlLabel[2].label}</span>
													</span>
												</li>
											</ol>
										</nav>

										<div tw="w-full block pt-8 pb-12 px-8">
											<div tw="max-w-full py-4 m-auto">
												<div tw="block mb-12">
													<h4 tw="text-lg leading-7 font-medium text-gray-900 mb-5">
														{VerifyUrlLabel[3].label}: {sname} (
														<a
															href={surl}
															target="_blank"
															title={surl}
															tw="break-all text-base leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150"
														>
															{surl}
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
																			<QuestionMarkCircleSvg className={tw`h-7 w-7`} />
																		</button>
																	</span>
																</div>
															</div>
														</li>
														<li tw="ml-4 text-sm leading-6 text-gray-600">
															{ReactHtmlParser(VerifyUrlLabel[9].label)}
														</li>
													</ol>
												</div>
											</div>

											<div tw="mb-5 sm:flex sm:justify-between">
												<div tw="sm:flex sm:justify-start w-full">
													<form onSubmit={handleSubmit} tw="sm:flex sm:items-center w-full">
														<input
															type="hidden"
															value={siteVerifyId}
															name="site_verify_id"
															onChange={handleHiddenInputChange}
														/>
														<div tw="flex lg:justify-between w-full">
															{enableNextStep ? (
																<span tw="inline-flex">
																	<Link href="/site/[id]/overview" as={`/site/${sid}/overview`} passHref>
																		<a
																			css={[
																				tw`cursor-pointer inline-flex sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600`,
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
																			<Link href="/" passHref>
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
																			<Link
																				href={{
																					pathname: "/add-site/information",
																					query: {
																						sid: sid,
																						edit: true
																					}
																				}}
																				passHref
																			>
																				<a
																					disabled={disableSiteVerify}
																					css={[
																						tw`cursor-pointer w-full mt-3 mr-3 sm:mt-0 relative inline-flex items-center px-4 py-2 rounded-md border border-gray-300 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white`,
																						disableSiteVerify
																							? tw`opacity-50 cursor-not-allowed`
																							: tw`hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`
																					]}
																				>
																					{VerifyUrlLabel[12].label}
																				</a>
																			</Link>
																		</span>
																	</div>
																</>
															)}
														</div>
													</form>
												</div>
											</div>
										</div>
									</>
								) : (
									<SiteAdditionStepsSkeleton />
								)}
							</div>
							<div tw="lg:col-span-1">{pageLoaded ? <HowToSetup /> : <HowToSetupSkeleton />}</div>
						</div>
						<div tw="static bottom-0 w-full mx-auto px-12 py-4 bg-white border-t border-gray-200">
							<SiteFooter />
						</div>
					</main>
				</div>
			</section>
		</Layout>
	) : (
		<Loader />
	);
};

VerifyUrl.propTypes = {};

export default withResizeDetector(VerifyUrl);

export async function getServerSideProps({ query }) {
	return {
		props: {
			sid: query.sid,
			sname: query.sname,
			surl: query.surl,
			vid: query.vid,
			v: query.v
		}
	};
}
