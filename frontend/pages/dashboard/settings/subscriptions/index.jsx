import { useState, Fragment } from 'react'
import Head from 'next/head'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Skeleton from 'react-loading-skeleton'
import useUser from 'hooks/useUser'
import Layout from 'components/Layout'
import MobileSidebar from 'components/sidebar/MobileSidebar'
import MainSidebar from 'components/sidebar/MainSidebar'
import SubscriptionPlans from 'public/data/subscription-plans.json'

const SubscriptionsDiv = styled.section``

const Subscriptions = () => {
	const [openMobileSidebar, setOpenMobileSidebar] = useState(false)
	const pageTitle = 'Subscriptions'

	const { user: user, userError: userError } = useUser({
    redirectTo: '/login',
    redirectIfFound: false
	})
	
	{userError && <Layout>{userError.message}</Layout>}
	
	return (
		<Layout>
			{user ? (
				<Fragment>
					<Head>
						<title>{pageTitle}</title>
					</Head>

					<SubscriptionsDiv className={`h-screen flex overflow-hidden bg-gray-100`}>
						<MobileSidebar show={openMobileSidebar} />
						<MainSidebar />

						<div className={`flex flex-col w-0 flex-1 overflow-hidden`}>
							<div className={`md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3`}>
								<button
									className={`-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:bg-gray-200 transition ease-in-out duration-150`}
									aria-label={`Open sidebar`}
									onClick={() => setTimeout(() => setOpenMobileSidebar(!openMobileSidebar), 150)}
								>
									<svg
										className={`h-6 w-5`}
										stroke={`currentColor`}
										fill={`none`}
										viewBox={`0 0 24 24`}
									>
										<path
											strokeLinecap={`round`}
											strokeLinejoin={`round`}
											strokeWidth={`2`}
											d={`M4 6h16M4 12h16M4 18h16`}
										/>
									</svg>
								</button>
							</div>
							<main
								className={`flex-1 relative z-0 overflow-y-auto pt-2 pb-6 focus:outline-none md:py-6`}
								tabIndex={`0`}
							>
								<div className={`max-w-full px-4 py-4 sm:px-6 md:px-8`}>
									<div>
										<div className={`pt-12 px-4 sm:px-6 lg:px-8 lg:pt-20`}>
											<div className={`text-center`}>
												<p className={`text-2xl leading-9 tracking-tight font-bold text-gray-900 sm:text-3xl sm:leading-10`}>
													Choose the plan that works for you
												</p>
												<p className={`mt-3 max-w-4xl mx-auto text-md leading-7 text-gray-600 sm:mt-5 sm:text-xl sm:leading-8`}>
													7 days free trials. You can change or cancel anytime
												</p>
											</div>
										</div>

										<div className={`mt-16 pb-12 lg:mt-20 lg:pb-20`}>
											<div className={`relative z-0`}>
												<div className={`absolute inset-0 h-5/6 lg:h-2/3`}></div>
												<div className={`max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8`}>
													<div className={`relative lg:grid lg:grid-cols-7`}>
														{SubscriptionPlans.map((val, key) => {
															return (
																val.slug === 'basic' ? (
																	<div key={key} className={`mx-auto max-w-md lg:mx-0 lg:max-w-none lg:col-start-1 lg:col-end-3 lg:row-start-2 lg:row-end-3`}>
																		<div className={`h-full flex flex-col rounded-lg shadow-lg overflow-hidden lg:rounded-none lg:rounded-l-lg`}>
																			<div className={`flex-1 flex flex-col`}>
																				<div className={`bg-white px-6 py-10`}>
																					<div>
																						<h3 className={`text-center text-2xl leading-8 font-medium text-gray-900" id="tier-hobby`}>
																							{val.type}
																						</h3>
																						<div className={`mt-4 flex items-center justify-center`}>
																							<span className={`px-3 flex items-start text-6xl leading-none tracking-tight text-gray-900`}>
																								<span className={`mt-2 mr-2 text-4xl font-medium`}>
																									$
																								</span>
																								<span className={`font-bold`}>
																									{val.monthlyCost}
																								</span>
																							</span>
																							<span className={`text-xl leading-7 font-medium text-gray-500`}>
																								/month
																							</span>
																						</div>
																					</div>
																				</div>
																				<div className={`flex-1 flex flex-col justify-between border-t-2 border-gray-100 p-6 bg-gray-50 sm:p-10 lg:p-6 xl:p-10`}>
																					<ul>
																						{val.features.map((val2, key) => {
																							return (
																								<li key={key} className={`flex items-start my-3`}>
																									<div className={`flex-shrink-0`}>
																										<svg className={`h-6 w-6 text-green-500`} stroke="currentColor" fill="none" viewBox="0 0 24 24">
																											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
																										</svg>
																									</div>
																									<p className={`ml-3 text-base leading-6 font-medium text-gray-500`}>
																										{val2}
																									</p>
																								</li>
																							)
																						})}
																					</ul>
																					<div className={`mt-8`}>
																						<div className={`rounded-lg shadow-md`}>
																							<a href="#" className={`block w-full text-center rounded-lg border border-transparent bg-white px-6 py-3 text-base leading-6 font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:shadow-outline transition ease-in-out duration-150" aria-describedby="tier-hobby`}>
																								Current Plan
																							</a>
																						</div>
																					</div>
																				</div>
																			</div>
																		</div>
																	</div>
																) : val.slug === 'professional' ? (
																	<div key={key} className={`mt-10 max-w-lg mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-start-3 lg:col-end-6 lg:row-start-1 lg:row-end-4`}>
																		<div className={`relative z-10 rounded-lg shadow-xl`}>
																			<div className={`pointer-events-none absolute inset-0 rounded-lg border-2 border-indigo-600`}></div>
																			<div className={`absolute inset-x-0 top-0 transform translate-y-px`}>
																				<div className={`flex justify-center transform -translate-y-1/2`}>
																					<span className={`inline-flex rounded-full bg-indigo-600 px-4 py-1 text-sm leading-5 font-semibold tracking-wider uppercase text-white`}>
																						Most popular
																					</span>
																				</div>
																			</div>
																			<div className={`bg-white rounded-t-lg px-6 pt-12 pb-10`}>
																				<div>
																					<h3 className={`text-center text-3xl leading-9 font-semibold text-gray-900 sm:-mx-6" id="tier-growth`}>
																						{val.type}
																					</h3>
																					<div className={`mt-4 flex items-center justify-center`}>
																						<span className={`px-3 flex items-start text-6xl leading-none tracking-tight text-gray-900 sm:text-6xl`}>
																							<span className={`mt-2 mr-2 text-4xl font-medium`}>
																								$
																							</span>
																							<span className={`font-bold`}>
																								{val.monthlyCost}
																							</span>
																						</span>
																						<span className={`text-2xl leading-8 font-medium text-gray-500`}>
																							/month
																						</span>
																					</div>
																				</div>
																			</div>
																			<div className={`border-t-2 border-gray-100 rounded-b-lg pt-10 pb-8 px-6 bg-gray-50 sm:px-10 sm:py-10`}>
																				<ul>
																					{val.features.map((val2, key) => {
																						return (
																							<li key={key} className={`flex items-start my-3`}>
																								<div className={`flex-shrink-0`}>
																									<svg className={`h-6 w-6 text-green-500`} stroke="currentColor" fill="none" viewBox="0 0 24 24">
																										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
																									</svg>
																								</div>
																								<p className={`ml-3 text-base leading-6 font-medium text-gray-500`}>
																									{val2}
																								</p>
																							</li>
																						)
																					})}
																				</ul>
																				<div className={`mt-10`}>
																					<div className={`rounded-lg shadow-md`}>
																						<a href="#" className={`block w-full text-center rounded-lg border border-transparent bg-indigo-600 px-6 py-4 text-xl leading-6 font-medium text-white hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo transition ease-in-out duration-150`} aria-describedby="tier-growth">
																							Select Plan
																						</a>
																					</div>
																				</div>
																			</div>
																		</div>
																	</div>
																) : (
																	<div key={key} className={`mt-10 mx-auto max-w-md lg:m-0 lg:max-w-none lg:col-start-6 lg:col-end-8 lg:row-start-2 lg:row-end-3`}>
																		<div className={`h-full flex flex-col rounded-lg shadow-lg overflow-hidden lg:rounded-none lg:rounded-r-lg`}>
																			<div className={`flex-1 flex flex-col`}>
																				<div className={`bg-white px-6 py-10`}>
																					<div>
																						<h3 className={`text-center text-2xl leading-8 font-medium text-gray-900" id="tier-scale`}>
																							{val.type}
																						</h3>
																						<div className={`mt-4 flex items-center justify-center`}>
																							<span className={`px-3 flex items-start text-6xl leading-none tracking-tight text-gray-900`}>
																								<span className={`mt-2 mr-2 text-4xl font-medium`}>
																									$
																								</span>
																								<span className={`font-bold`}>
																									{val.monthlyCost}
																								</span>
																							</span>
																							<span className={`text-xl leading-7 font-medium text-gray-500`}>
																								/month
																							</span>
																						</div>
																					</div>
																				</div>
																				<div className={`flex-1 flex flex-col justify-between border-t-2 border-gray-100 p-6 bg-gray-50 sm:p-10 lg:p-6 xl:p-10`}>
																					<ul>
																						{val.features.map((val2, key) => {
																							return (
																								<li key={key} className={`flex items-start my-3`}>
																									<div className={`flex-shrink-0`}>
																										<svg className={`h-6 w-6 text-green-500`} stroke="currentColor" fill="none" viewBox="0 0 24 24">
																											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
																										</svg>
																									</div>
																									<p className={`ml-3 text-base leading-6 font-medium text-gray-500`}>
																										{val2}
																									</p>
																								</li>
																							)
																						})}
																					</ul>
																					<div className={`mt-8`}>
																						<div className={`rounded-lg shadow-md`}>
																							<a href="#" className={`block w-full text-center rounded-lg border border-transparent bg-white px-6 py-3 text-base leading-6 font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:shadow-outline transition ease-in-out duration-150" aria-describedby="tier-scale`}>
																								Coming Soon
																							</a>
																						</div>
																					</div>
																				</div>
																			</div>
																		</div>
																	</div>
																)
															)
														})}
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</main>
						</div>
					</SubscriptionsDiv>
				</Fragment>
			) : null}
		</Layout>
	)
}

export default Subscriptions

Subscriptions.propTypes = {
  openMobileSidebar: PropTypes.bool,
  pageTitle: PropTypes.string,
}