// React
import { useState, useEffect } from "react";

// NextJS
import Link from "next/link";

// External
import { Formik } from "formik";
import { NextSeo } from "next-seo";
import * as Yup from "yup";
import loadable from "@loadable/component";
import PropTypes from "prop-types";
import tw from "twin.macro";

// JSON
import SupportLabel from "public/labels/pages/site/support.json";

// Utils
import { getCookie } from "src/utils/cookie";

// Hooks
import usePostMethod from "src/hooks/usePostMethod";
import useUser from "src/hooks/useUser";
import { useSite } from "src/hooks/useSite";

// Layout
import Layout from "src/components/Layout";

// Components
const ChevronRightSvg = loadable(() => import("src/components/svg/ChevronRightSvg"));
const ErrorNotificationModal = loadable(() => import("src/components/modals/ErrorNotificationModal"));
const HomeSvg = loadable(() => import("src/components/svg/HomeSvg"));
const MainSidebar = loadable(() => import("src/components/sidebar/MainSidebar"));
const MobileSidebarButton = loadable(() => import("src/components/sidebar/MobileSidebarButton"));
const SiteFooter = loadable(() => import("src/components/footer/SiteFooter"));
const SuccessNotificationModal = loadable(() => import("src/components/modals/SuccessNotificationModal"));
const SupportSkeleton = loadable(() => import("src/components/skeletons/SupportSkeleton"));

const Support = ({ token }) => {
	const [disableSupportForm, setDisableSupportForm] = useState(false);
	const [errorMsg, setErrorMsg] = useState("");
	const [errorMsgLoaded, setErrorMsgLoaded] = useState(false);
	const [openMobileSidebar, setOpenMobileSidebar] = useState(false);
	const [pageLoaded, setPageLoaded] = useState(false);
	const [siteData, setSiteData] = useState([]);
	const [successMsg, setSuccessMsg] = useState("");
	const [successMsgLoaded, setSuccessMsgLoaded] = useState(false);
	const [userData, setUserData] = useState([]);

	const pageTitle = "Support";
	const homeLabel = "Home";
	const homePageLink = "/";
	const contactApiEndpoint = "/api/support/contact/";
	const siteApiEndpoint = "/api/site/";

	const { user: user, userError: userError } = useUser();
	const { site: site, siteError: siteError } = useSite({
		endpoint: siteApiEndpoint,
	});

	useEffect(() => {
		if (
			user &&
			user !== undefined &&
			Object.keys(user).length > 0 &&
			site &&
			site !== undefined &&
			Object.keys(site).length > 0 &&
			token &&
			token !== undefined &&
			token !== ""
		) {
			setTimeout(() => {
				setPageLoaded(true);
			}, 500);

			setSiteData(site);
			setUserData(user);
		}
	}, [user, site, token]);

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

	return (
		<Layout>
			<NextSeo title={pageTitle} />

			<SuccessNotificationModal
				successMsg={successMsg}
				successMsgLoaded={successMsgLoaded}
				setSuccessMsgLoaded={setSuccessMsgLoaded}
				successMsgTitle={SupportLabel[13].label}
			/>

			<ErrorNotificationModal
				errorMsg={errorMsg}
				errorMsgLoaded={errorMsgLoaded}
				setErrorMsgLoaded={setErrorMsgLoaded}
				errorMsgTitle={SupportLabel[12].label}
			/>

			<section tw="h-screen flex overflow-hidden bg-white">
				{/* FIXME: fix mobile sidebar */}
				{/* <MobileSidebar show={openMobileSidebar} setShow={setOpenMobileSidebar} /> */}
				<MainSidebar user={userData} site={siteData} />

				<div tw="flex flex-col w-0 flex-1 overflow-hidden">
					<div tw="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3">
						<MobileSidebarButton openMobileSidebar={openMobileSidebar} setOpenMobileSidebar={setOpenMobileSidebar} />
					</div>
					<main tw="flex-1 h-screen relative z-0 overflow-y-auto focus:outline-none" tabIndex="0">
						<div tw="w-full p-6 mx-auto grid gap-16 lg:grid-cols-3 lg:col-gap-5 lg:row-gap-12">
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
												<h4 className="text-2xl leading-6 font-medium text-gray-900">{SupportLabel[6].label}</h4>
												<p className="max-w-full mt-2 text-sm leading-5 text-gray-500">{SupportLabel[7].label}</p>
											</div>
										</div>
										<div tw="max-w-full lg:max-w-4xl p-8 pt-0 pb-2">
											<Formik
												initialValues={{
													message: "",
												}}
												validationSchema={Yup.object({
													message: Yup.string().required(SupportLabel[2].label),
												})}
												onSubmit={async (values, { setSubmitting, resetForm }) => {
													const body = {
														message: values.message,
													};

													const response = await usePostMethod(contactApiEndpoint, body);

													if (Math.floor(response.status / 200) === 1) {
														setSuccessMsg(SupportLabel[3].label);
														setSuccessMsgLoaded(!successMsgLoaded);
														setSubmitting(false);
														resetForm({ values: "" });
														setDisableSupportForm(!disableSupportForm);
													} else {
														if (response.data) {
															if (response.data.message) {
																setErrorMsg(response.data.message[0]);
																setErrorMsgLoaded(!errorMsgLoaded);
															}

															if (!response.data.message) {
																setErrorMsg(SupportLabel[5].label);
																setErrorMsgLoaded(!errorMsgLoaded);
															}
														} else {
															setErrorMsg(SupportLabel[5].label);
															setErrorMsgLoaded(!errorMsgLoaded);
															setSubmitting(false);
															resetForm({ values: "" });
														}
													}
												}}
											>
												{({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
													<form tw="space-y-8 divide-y divide-gray-200" onSubmit={handleSubmit}>
														<div tw="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
															<div tw="sm:col-span-4">
																<label htmlFor="about" tw="block text-sm font-medium text-gray-700">
																	{SupportLabel[8].label}
																</label>
																<div tw="my-1">
																	<textarea
																		id="message"
																		name="message"
																		rows="8"
																		disabled={isSubmitting}
																		css={[
																			tw`resize-none shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md`,
																			isSubmitting && tw`opacity-50 bg-gray-300 cursor-not-allowed`,
																			errors.message || errorMsg ? tw`border-red-300` : tw`border-gray-300`,
																		]}
																		placeholder={SupportLabel[9].label}
																		onChange={handleChange}
																		onBlur={handleBlur}
																		value={values.message}
																	/>

																	{errors.message && touched.message && (
																		<span tw="block mt-2 text-xs leading-5 text-red-700">
																			{errors.message && touched.message && errors.message}
																		</span>
																	)}
																</div>
															</div>

															<div tw="sm:col-span-4">
																<div tw="flex justify-start">
																	<button
																		type="submit"
																		disabled={isSubmitting}
																		css={[
																			tw`cursor-pointer inline-flex ring-1 ring-black ring-opacity-5 sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600`,
																			isSubmitting
																				? tw`opacity-50 bg-green-400 cursor-not-allowed`
																				: tw`hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`,
																		]}
																	>
																		{isSubmitting ? SupportLabel[11].label : SupportLabel[10].label}
																	</button>
																</div>
															</div>
														</div>
													</form>
												)}
											</Formik>
										</div>
									</>
								) : (
									<SupportSkeleton />
								)}
							</div>
						</div>
						<div tw="static bottom-0 w-full mx-auto px-12 py-4 bg-white border-t border-gray-200">
							<SiteFooter />
						</div>
					</main>
				</div>
			</section>
		</Layout>
	);
};

Support.propTypes = {};

Support.getInitialProps = async ({ req }) => {
	let token = getCookie("token", req);

	if (!token) {
		return {
			notFound: true,
		};
	}

	return {
		props: {
			token: token,
		},
	};
};

export default Support;
