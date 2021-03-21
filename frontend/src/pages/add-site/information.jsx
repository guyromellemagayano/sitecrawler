// React
import { useEffect, useState } from 'react';

// NextJS
import Link from 'next/link';
import Router, { useRouter } from 'next/router';

// External
import { Formik } from 'formik';
import { NextSeo } from 'next-seo';
import { Transition } from '@headlessui/react';
import * as Yup from 'yup';
import loadable from '@loadable/component';
import PropTypes from 'prop-types';
import tw from 'twin.macro';
import useSWR from 'swr';

// JSON
import InformationLabel from 'public/labels/pages/sites/information.json';

// Hooks
import useFetcher from 'src/hooks/useFetcher';
import useGetMethod from 'src/hooks/useGetMethod';
import usePostMethod from 'src/hooks/usePostMethod';
import usePatchMethod from 'src/hooks/usePatchMethod';

// Contexts
import { useAuth } from 'src/contexts/auth';

// Layout
import Layout from 'src/components/Layout';

// Components
const ChevronRightSvg = loadable(() =>
	import('src/components/svg/ChevronRightSvg')
);
const ErrorNotificationOverlay = loadable(() =>
	import('src/components/overlay/ErrorNotificationOverlay')
);
const HomeSvg = loadable(() => import('src/components/svg/HomeSvg'));
const HowToSetup = loadable(() => import('src/components/sites/HowToSetup'));
const HowToSetupSkeleton = loadable(() =>
	import('src/components/skeletons/HowToSetupSkeleton')
);
const MainSidebar = loadable(() =>
	import('src/components/sidebar/MainSidebar')
);
const MenuSvg = loadable(() => import('src/components/svg/MenuSvg'));
const MobileSidebar = loadable(() =>
	import('src/components/sidebar/MobileSidebar')
);
const SiteAdditionStepsSkeleton = loadable(() =>
	import('src/components/skeletons/SiteAdditionStepsSkeleton')
);
const SiteFooter = loadable(() => import('src/components/footer/SiteFooter'));
const XCircleSvg = loadable(() => import('src/components/svg/XCircleSvg'));
const XSvg = loadable(() => import('src/components/svg/XSvg'));

const SitesInformation = (props) => {
	const [disableSubmitButton, setDisableSubmitButton] = useState(true);
	const [errorMsg, setErrorMsg] = useState('');
	const [errorMsgLoaded, setErrorMsgLoaded] = useState(false);
	const [openMobileSidebar, setOpenMobileSidebar] = useState(false);
	const [pageLoaded, setPageLoaded] = useState(false);
	const [siteName, setSiteName] = useState('');
	const [siteUrl, setSiteUrl] = useState('');

	const pageTitle = 'Information';
	const homeLabel = 'Home';
	const homePageLink = '/dashboard/sites';
	const siteApiEndpoint = '/api/site/';
	const urlRegex = /^(www.)?(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i;

	const { user } = useAuth();
	const router = useRouter();

	if (props.sid !== undefined && props.edit) {
		const { data: site } = useSWR(`/api/site/${router.query.sid}`, useFetcher);

		useEffect(() => {
			if (site !== '' && site !== undefined) {
				setSiteName(site.name);
				setSiteUrl(site.url);
			}
		}, [site]);
	}

	useEffect(() => {
		if (user && user !== undefined) {
			setTimeout(() => {
				setPageLoaded(true);
			}, 500);
		}
	}, [user]);

	useEffect(() => {}, []);

	return (
		<Layout>
			<NextSeo title={pageTitle} />

			<Transition show={errorMsgLoaded}>
				<div tw='fixed z-50 inset-0 flex items-end justify-center px-4 py-6 pointer-events-none sm:p-6 sm:items-start sm:justify-end'>
					<Transition.Child
						enter='transform ease-out duration-300 transition'
						enterFrom='translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2'
						enterTo='translate-y-0 opacity-100 sm:translate-x-0'
						leave='transition ease-in duration-100'
						leaveFrom='opacity-100'
						leaveTo='opacity-0'
						tw='max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden'
					>
						<div tw='p-4'>
							<div tw='flex items-start'>
								<div tw='flex-shrink-0'>
									<XCircleSvg className={tw`h-6 w-6 text-red-400`} />
								</div>
								<div tw='ml-3 w-0 flex-1 pt-0.5'>
									<p tw='text-sm font-medium text-red-400'>
										{InformationLabel[16].label}
									</p>
									<p tw='mt-1 text-sm text-gray-500'>{errorMsg}</p>
									<div tw='mt-2'>
										<button
											tw='bg-white rounded-md text-sm font-medium text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
											onClick={() => setErrorMsgLoaded(!errorMsgLoaded)}
										>
											{InformationLabel[17].label}
										</button>
									</div>
								</div>
								<div tw='ml-4 flex-shrink-0 flex'>
									<button
										tw='bg-white rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
										onClick={() => setErrorMsgLoaded(!errorMsgLoaded)}
									>
										<span tw='sr-only'>{InformationLabel[15].label}</span>
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
						tw='flex-1 relative z-0 overflow-y-auto focus:outline-none'
						tabIndex='0'
					>
						<div tw='w-full p-6 mx-auto grid gap-16 lg:grid-cols-3 lg:col-gap-5 lg:row-gap-12'>
							<div tw='lg:col-span-2 xl:col-span-2 xl:pr-8 xl:border-r xl:border-gray-200'>
								{pageLoaded ? (
									<>
										<div tw='max-w-full py-4 px-8'>
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
											<div tw='pt-4 m-auto'>
												<h4 tw='text-2xl leading-6 font-medium text-gray-900'>
													{InformationLabel[0].label}
												</h4>
												<p tw='max-w-full mt-2 text-sm leading-5 text-gray-500'>
													{InformationLabel[0].description}
												</p>
											</div>
										</div>
										<nav
											aria-label='Site Addition Progress'
											tw='max-w-full p-8 pb-2'
										>
											<ol tw='space-y-4 md:flex md:space-y-0 md:space-x-8'>
												<li tw='md:flex-1'>
													<span
														tw='pl-4 py-2 flex flex-col border-l-4 border-indigo-600 md:pl-0 md:pt-4 md:pb-0 md:border-l-0 md:border-t-4'
														aria-current='step'
													>
														<span tw='text-xs text-indigo-600 font-semibold tracking-wide uppercase'>
															{InformationLabel[13].label}
														</span>
														<span tw='text-sm font-medium'>
															{InformationLabel[1].label}
														</span>
													</span>
												</li>

												<li tw='md:flex-1'>
													<span
														className='group'
														tw='pl-4 py-2 flex flex-col border-l-4 border-gray-200 hover:border-gray-300 md:pl-0 md:pt-4 md:pb-0 md:border-l-0 md:border-t-4'
													>
														<span tw='text-xs text-gray-500 font-semibold tracking-wide uppercase group-hover:text-gray-700'>
															{InformationLabel[14].label}
														</span>
														<span tw='text-sm font-medium'>
															{InformationLabel[2].label}
														</span>
													</span>
												</li>
											</ol>
										</nav>

										<div tw='block pt-8 pb-12 px-8'>
											<div tw='max-w-full py-4 m-auto'>
												<div tw='block mb-12'>
													<h4 tw='text-lg leading-7 font-medium text-gray-900'>
														{InformationLabel[3].label}
													</h4>
													<span tw='max-w-full mt-1 block'>
														<p tw='text-sm leading-5 text-gray-500'>
															{InformationLabel[3].description}
														</p>
													</span>
												</div>

												<Formik
													enableReinitialize={
														props.sid !== undefined && props.edit ? true : false
													}
													initialValues={{
														siteurlprotocol: 'https://',
														siteurl:
															props.sid !== undefined && props.edit
																? siteUrl.replace(/^\/\/|^.*?:(\/\/)?/, '')
																: '',
														sitename:
															props.sid !== undefined && props.edit
																? siteName
																: ''
													}}
													validationSchema={Yup.object({
														siteurl: Yup.string()
															.matches(urlRegex, InformationLabel[8].label)
															.required(InformationLabel[7].label),
														sitename: Yup.string().required(
															InformationLabel[7].label
														)
													})}
													onSubmit={async (
														values,
														{ setSubmitting, resetForm }
													) => {
														if (props.sid !== undefined && props.edit) {
															if (errorMsg) setErrorMsg('');

															const response = await useGetMethod(
																'/api/site/' + router.query.sid + '/'
															);

															if (Math.floor(response.status / 200) === 1) {
																const body = {
																	name: values.sitename
																};

																const siteResponse = await usePatchMethod(
																	'/api/site/' + router.query.sid + '/',
																	body
																);

																if (
																	Math.floor(siteResponse.status / 200) === 1
																) {
																	setSubmitting(false);

																	Router.push({
																		pathname: '/dashboard/sites/verify-url',
																		query: {
																			sid: siteResponse.data.id,
																			sname: siteResponse.data.name,
																			surl: siteResponse.data.url,
																			vid: siteResponse.data.verification_id,
																			v: false
																		}
																	});
																} else {
																	// FIXME: Error handling for siteResponse
																	if (siteResponse.data) {
																		console.log('ERROR: ' + siteResponse.data);
																	} else {
																		setSubmitting(false);
																		resetForm({ values: '' });
																		setErrorMsg(InformationLabel[12]);
																	}
																}
															} else {
																// FIXME: Error handling for response
																if (response.data) {
																	console.log('ERROR: ' + response.data);
																} else {
																	setSubmitting(false);
																	resetForm({ values: '' });
																	setErrorMsg(InformationLabel[12]);
																}
															}
														} else {
															const body = {
																url: values.siteurlprotocol + values.siteurl,
																name: values.sitename
															};

															const response = await useGetMethod(
																siteApiEndpoint
															);

															if (errorMsg) setErrorMsg('');

															if (Math.floor(response.status / 200) === 1) {
																const siteResult = response.data.results.find(
																	(site) => site.url === body.url
																);

																if (siteResult !== undefined) {
																	setErrorMsg(InformationLabel[11].label);
																	return false;
																} else {
																	const siteResponse = await usePostMethod(
																		siteApiEndpoint,
																		body
																	);

																	if (
																		Math.floor(siteResponse.status / 200) === 1
																	) {
																		setSubmitting(false);
																		resetForm({ values: '' });

																		Router.push({
																			pathname: '/dashboard/sites/verify-url/',
																			query: {
																				sid: siteResponse.data.id,
																				sname: siteResponse.data.name,
																				surl: siteResponse.data.url,
																				vid: siteResponse.data.verification_id,
																				v: false,
																				edit: false
																			}
																		});
																	} else {
																		// FIXME: Error handling for siteResponse
																		if (siteResponse.data) {
																			console.log(
																				'ERROR: ' + siteResponse.data
																			);
																		} else {
																			setSubmitting(false);
																			resetForm({ values: '' });
																			setErrorMsg(InformationLabel[12]);
																		}
																	}
																}
															} else {
																// FIXME: Error handling for response
																if (response.data) {
																	console.log('ERROR: ' + response.data);
																} else {
																	setSubmitting(false);
																	resetForm({ values: '' });
																	setErrorMsg(InformationLabel[12]);
																}
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
																<div tw='sm:col-span-3'>
																	<label
																		htmlFor='sitename'
																		tw='block text-sm font-medium leading-5 text-gray-700'
																	>
																		{InformationLabel[4].label}
																	</label>
																	<div tw='my-1'>
																		<input
																			id='sitename'
																			type='text'
																			name='sitename'
																			disabled={isSubmitting}
																			placeholder={
																				InformationLabel[4].placeholder
																			}
																			css={[
																				tw`shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm rounded-md`,
																				isSubmitting &&
																					tw`opacity-50 bg-gray-200 cursor-not-allowed`,
																				errors.sitename || errorMsg
																					? tw`border-red-300`
																					: tw`border-gray-300`
																			]}
																			aria-describedby='sitename'
																			onChange={handleChange}
																			onBlur={handleBlur}
																			value={values.sitename}
																		/>

																		{errors.sitename && touched.sitename && (
																			<span tw='block mt-2 text-xs leading-5 text-red-700'>
																				{errors.sitename &&
																					touched.sitename &&
																					errors.sitename}
																			</span>
																		)}
																	</div>
																</div>

																<div tw='sm:col-span-3'>
																	<label
																		htmlFor='siteurl'
																		tw='block text-sm font-medium leading-5 text-gray-700'
																	>
																		{InformationLabel[5].label}
																	</label>
																	<div tw='mt-1 relative rounded-md shadow-sm'>
																		<div tw='absolute inset-y-0 left-0 flex items-center'>
																			<label
																				htmlFor='siteurlprotocol'
																				tw='sr-only'
																			>
																				Site URL Protocol
																			</label>
																			<select
																				id='siteurlprotocol'
																				name='siteurlprotocol'
																				css={[
																					tw`focus:ring-indigo-500 focus:border-indigo-500 h-full py-0 pl-3 pr-7 border-transparent bg-transparent sm:text-sm rounded-md`,
																					props.sid !== undefined &&
																						props.edit &&
																						tw`opacity-50 bg-gray-200 cursor-not-allowed`
																				]}
																				disabled={
																					isSubmitting ||
																					(props.sid !== undefined &&
																						props.edit)
																						? true
																						: false
																				}
																				onChange={handleChange}
																				onBlur={handleBlur}
																				value={values.siteurlprotocol}
																			>
																				<option value='https://'>
																					https://
																				</option>
																				<option value='http://'>http://</option>
																			</select>
																		</div>
																		<input
																			id='siteurl'
																			type='text'
																			name='siteurl'
																			disabled={
																				isSubmitting ||
																				(props.sid !== undefined && props.edit)
																					? true
																					: false
																			}
																			css={[
																				tw`focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-24 sm:text-sm border-gray-300 rounded-md`,
																				props.sid !== undefined && props.edit
																					? tw`opacity-50 bg-gray-200 cursor-not-allowed`
																					: isSubmitting &&
																					  tw`text-gray-500 opacity-50 bg-gray-200 cursor-not-allowed`,
																				(errors.siteurl || errorMsg) &&
																				props.sid === undefined &&
																				!props.edit
																					? tw`border-red-300`
																					: tw`border-gray-300`
																			]}
																			placeholder={
																				InformationLabel[5].placeholder
																			}
																			aria-describedby='siteurl'
																			onChange={handleChange}
																			onBlur={handleBlur}
																			value={
																				props.sid !== undefined && props.edit
																					? siteUrl.replace(
																							/^\/\/|^.*?:(\/\/)?/,
																							''
																					  )
																					: values.siteurl
																			}
																		/>
																	</div>

																	{errors.siteurl &&
																		touched.siteurl &&
																		props.sid === undefined &&
																		!props.edit && (
																			<span tw='block mt-2 text-xs leading-5 text-red-700'>
																				{errors.siteurl &&
																					touched.siteurl &&
																					errors.siteurl}
																			</span>
																		)}
																</div>

																<div tw='sm:col-span-6'>
																	<div tw='flex justify-start'>
																		<button
																			type='submit'
																			disabled={
																				isSubmitting ||
																				Object.keys(errors).length > 0 ||
																				(!Object.keys(values.siteurl).length >
																					0 &&
																					!urlRegex.test(values.siteurl) &&
																					!Object.keys(values.sitename).length >
																						0)
																			}
																			css={[
																				tw`mt-3 ring-1 ring-black ring-opacity-5 sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600`,
																				isSubmitting ||
																				Object.keys(errors).length > 0 ||
																				(!Object.keys(values.siteurl).length >
																					0 &&
																					!urlRegex.test(values.siteurl) &&
																					!Object.keys(values.sitename).length >
																						0)
																					? tw`opacity-50 bg-indigo-300 cursor-not-allowed`
																					: tw`hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`
																			]}
																		>
																			{isSubmitting
																				? InformationLabel[10].label
																				: props.sid === undefined && !props.edit
																				? InformationLabel[6].label
																				: InformationLabel[9].label}
																		</button>
																	</div>
																</div>
															</div>
														</form>
													)}
												</Formik>
											</div>
										</div>
									</>
								) : (
									<SiteAdditionStepsSkeleton />
								)}
							</div>
							<div tw='lg:col-span-1'>
								{pageLoaded ? <HowToSetup /> : <HowToSetupSkeleton />}
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

SitesInformation.getInitialProps = ({ query }) => {
	return {
		sid: query.sid,
		edit: query.edit
	};
};

SitesInformation.propTypes = {};

export default SitesInformation;
