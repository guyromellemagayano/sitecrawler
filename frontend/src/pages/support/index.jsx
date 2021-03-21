// React
import { useState, useEffect } from 'react';

// NextJS
import Link from 'next/link';

// External
import { Formik } from 'formik';
import { NextSeo } from 'next-seo';
import { Transition } from '@headlessui/react';
import * as Yup from 'yup';
import loadable from '@loadable/component';
import PropTypes from 'prop-types';
import tw from 'twin.macro';

// JSON
import SupportLabel from 'public/labels/pages/site/support.json';

// Hooks
import usePostMethod from 'src/hooks/usePostMethod';

// Layout
import Layout from 'src/components/Layout';

// Components
const CheckCircleSvg = loadable(() =>
	import('src/components/svg/CheckCircleSvg')
);
const ChevronRightSvg = loadable(() =>
	import('src/components/svg/ChevronRightSvg')
);
const HomeSvg = loadable(() => import('src/components/svg/HomeSvg'));
const MainSidebar = loadable(() =>
	import('src/components/sidebar/MainSidebar')
);
const MenuSvg = loadable(() => import('src/components/svg/MenuSvg'));
const MobileSidebar = loadable(() =>
	import('src/components/sidebar/MobileSidebar')
);
const SiteFooter = loadable(() => import('src/components/footer/SiteFooter'));
const SupportSkeleton = loadable(() =>
	import('src/components/skeletons/SupportSkeleton')
);
const XCircleSvg = loadable(() => import('src/components/svg/XCircleSvg'));
const XSvg = loadable(() => import('src/components/svg/XSvg'));

const Support = ({ userInfo }) => {
	const [disableSupportForm, setDisableSupportForm] = useState(false);
	const [errorMsg, setErrorMsg] = useState('');
	const [errorMsgLoaded, setErrorMsgLoaded] = useState(false);
	const [openMobileSidebar, setOpenMobileSidebar] = useState(false);
	const [pageLoaded, setPageLoaded] = useState(false);
	const [successMsg, setSuccessMsg] = useState('');
	const [successMsgLoaded, setSuccessMsgLoaded] = useState(false);

	const pageTitle = 'Support';
	const homeLabel = 'Home';
	const homePageLink = '/';
	const contactApiEndpoint = '/api/support/contact/';

	useEffect(() => {
		if (userInfo && userInfo !== undefined) {
			setTimeout(() => {
				setPageLoaded(true);
			}, 500);
		}
	}, [userInfo]);

	useEffect(() => {
		if (successMsg && successMsg !== '') {
			setTimeout(() => {
				setSuccessMsgLoaded(true);
			}, 500);
		}

		if (errorMsg && errorMsg !== '') {
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

			<Transition show={successMsgLoaded}>
				<div tw='fixed z-50 inset-0 flex items-end justify-center px-4 py-6 pointer-events-none sm:p-6 sm:items-start sm:justify-end'>
					<Transition.Child
						enter='transform ease-out duration-300 transition'
						enterFrom='translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2'
						enterTo='translate-y-0 opacity-100 sm:translate-x-0'
						leave='transition ease-in duration-100'
						leaveFrom='opacity-100'
						leaveTo='opacity-0'
						className='max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden'
					>
						<div tw='p-4'>
							<div tw='flex items-start'>
								<div tw='flex-shrink-0'>
									<CheckCircleSvg className={tw`h-6 w-6 text-green-400`} />
								</div>
								<div tw='ml-3 w-0 flex-1 pt-0.5'>
									<p tw='text-sm font-medium text-green-400'>
										{SupportLabel[13].label}
									</p>
									<p tw='mt-1 text-sm text-gray-500'>{successMsg}</p>
									<div tw='mt-2'>
										<button
											tw='bg-white rounded-md text-sm font-medium text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
											onClick={() => setSuccessMsgLoaded(!successMsgLoaded)}
										>
											{SupportLabel[14].label}
										</button>
									</div>
								</div>
								<div tw='ml-4 flex-shrink-0 flex'>
									<button
										tw='bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
										onClick={() => setSuccessMsgLoaded(!successMsgLoaded)}
									>
										<span tw='sr-only'>{SupportLabel[15].label}</span>
										<XSvg className={tw`h-5 w-5`} />
									</button>
								</div>
							</div>
						</div>
					</Transition.Child>
				</div>
			</Transition>

			<Transition show={errorMsgLoaded}>
				<div tw='fixed z-50 inset-0 flex items-end justify-center px-4 py-6 pointer-events-none sm:p-6 sm:items-start sm:justify-end'>
					<Transition.Child
						enter='transform ease-out duration-300 transition'
						enterFrom='translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2'
						enterTo='translate-y-0 opacity-100 sm:translate-x-0'
						leave='transition ease-in duration-100'
						leaveFrom='opacity-100'
						leaveTo='opacity-0'
						className='max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden'
					>
						<div tw='p-4'>
							<div tw='flex items-start'>
								<div tw='flex-shrink-0'>
									<XCircleSvg className={tw`h-6 w-6 text-red-400`} />
								</div>
								<div tw='ml-3 w-0 flex-1 pt-0.5'>
									<p tw='text-sm font-medium text-red-400'>
										{SupportLabel[12].label}
									</p>
									<p tw='mt-1 text-sm text-gray-500'>{errorMsg}</p>
									<div tw='mt-2'>
										<button
											tw='bg-white rounded-md text-sm font-medium text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
											onClick={() => setErrorMsgLoaded(!errorMsgLoaded)}
										>
											{SupportLabel[14].label}
										</button>
									</div>
								</div>
								<div tw='ml-4 flex-shrink-0 flex'>
									<button
										tw='bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
										onClick={() => setErrorMsgLoaded(!errorMsgLoaded)}
									>
										<span tw='sr-only'>{SupportLabel[15].label}</span>
										<XSvg className={tw`h-5 w-5`} />
									</button>
								</div>
							</div>
						</div>
					</Transition.Child>
				</div>
			</Transition>

			<section tw='h-screen flex overflow-hidden bg-white'>
				{/* FIXME: fix mobile sidebar */}
				{/* <MobileSidebar show={openMobileSidebar} setShow={setOpenMobileSidebar} /> */}
				<MainSidebar />

				<div tw='flex flex-col w-0 flex-1 overflow-hidden'>
					<div tw='md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3'>
						<button
							tw='-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:bg-gray-200 transition ease-in-out duration-150'
							onClick={() =>
								setTimeout(() => setOpenMobileSidebar(!openMobileSidebar), 150)
							}
						>
							<span tw='sr-only'>Open sidebar</span>
							<MenuSvg className={tw`h-6 w-6`} />
						</button>
					</div>
					<main
						tw='flex-1 h-screen relative z-0 overflow-y-auto focus:outline-none'
						tabIndex='0'
					>
						<div tw='w-full p-6 mx-auto grid gap-16 lg:grid-cols-3 lg:col-gap-5 lg:row-gap-12 min-h-screen'>
							<div tw='lg:col-span-2 xl:col-span-2 xl:pr-8 xl:border-r xl:border-gray-200'>
								{pageLoaded ? (
									<>
										<div className='max-w-full py-4 px-8'>
											<nav tw='flex pt-4 pb-8' aria-label='Breadcrumb'>
												<ol tw='flex items-center space-x-4'>
													<li>
														<div>
															<Link href={homePageLink} passHref>
																<a tw='text-gray-400 hover:text-gray-500'>
																	<HomeSvg
																		className={tw`flex-shrink-0 h-5 w-5`}
																	/>
																	<span tw='sr-only'>{homeLabel}</span>
																</a>
															</Link>
														</div>
													</li>
													<li>
														<div tw='flex items-center'>
															<ChevronRightSvg
																className={tw`flex-shrink-0 h-5 w-5 text-gray-400`}
															/>
															<p
																aria-current='page'
																tw='cursor-default ml-4 text-sm font-medium text-gray-700'
															>
																{pageTitle}
															</p>
														</div>
													</li>
												</ol>
											</nav>
											<div className='pt-4 m-auto'>
												<h4 className='text-2xl leading-6 font-medium text-gray-900'>
													{SupportLabel[6].label}
												</h4>
												<p className='max-w-full mt-2 text-sm leading-5 text-gray-500'>
													{SupportLabel[7].label}
												</p>
											</div>
										</div>
										<div tw='max-w-full lg:max-w-4xl p-8 pt-0 pb-2'>
											<Formik
												initialValues={{
													message: ''
												}}
												validationSchema={Yup.object({
													message: Yup.string().required(SupportLabel[2].label)
												})}
												onSubmit={async (
													values,
													{ setSubmitting, resetForm }
												) => {
													const body = {
														message: values.message
													};

													const response = await usePostMethod(
														contactApiEndpoint,
														body
													);

													if (Math.floor(response.status / 200) === 1) {
														setErrorMsg('');
														setSuccessMsg(SupportLabel[3].label);
														setSubmitting(false);
														resetForm({ values: '' });
														setDisableSupportForm(!disableSupportForm);
													} else {
														if (response.data) {
															if (response.data.message) {
																setSuccessMsg('');
																setErrorMsg(response.data.message[0]);
															}

															if (!response.data.message) {
																setSuccessMsg('');
																setErrorMsg(SupportLabel[5].label);
															}
														} else {
															setSuccessMsg('');
															setErrorMsg(SupportLabel[5].label);
															setSubmitting(false);
															resetForm({ values: '' });
														}
													}
												}}
											>
												{({
													values,
													errors,
													touched,
													handleChange,
													handleBlur,
													handleSubmit,
													isSubmitting
												}) => (
													<form
														tw='space-y-8 divide-y divide-gray-200'
														onSubmit={handleSubmit}
													>
														<div tw='mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6'>
															<div tw='sm:col-span-4'>
																<label
																	htmlFor='about'
																	tw='block text-sm font-medium text-gray-700'
																>
																	{SupportLabel[8].label}
																</label>
																<div tw='my-1'>
																	<textarea
																		id='message'
																		name='message'
																		rows='8'
																		disabled={isSubmitting}
																		css={[
																			tw`resize-none shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md`,
																			isSubmitting &&
																				tw`opacity-50 bg-gray-300 cursor-not-allowed`,
																			errors.message || errorMsg
																				? tw`border-red-300`
																				: tw`border-gray-300`
																		]}
																		placeholder={SupportLabel[9].label}
																		onChange={handleChange}
																		onBlur={handleBlur}
																		value={values.message}
																	/>

																	{errors.message && touched.message && (
																		<span tw='block mt-2 text-xs leading-5 text-red-700'>
																			{errors.message &&
																				touched.message &&
																				errors.message}
																		</span>
																	)}
																</div>
															</div>

															<div tw='sm:col-span-4'>
																<div tw='flex justify-start'>
																	<button
																		type='submit'
																		disabled={isSubmitting}
																		css={[
																			tw`cursor-pointer inline-flex ring-1 ring-black ring-opacity-5 sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600`,
																			isSubmitting
																				? tw`opacity-50 bg-green-400 cursor-not-allowed`
																				: tw`hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`
																		]}
																	>
																		{isSubmitting
																			? SupportLabel[11].label
																			: SupportLabel[10].label}
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
						<div tw='static bottom-0 w-full mx-auto px-12 py-4 bg-white border-t border-gray-200'>
							<SiteFooter />
						</div>
					</main>
				</div>
			</section>
		</Layout>
	);
};

Support.propTypes = {};

export default Support;
