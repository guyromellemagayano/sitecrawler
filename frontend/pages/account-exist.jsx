import React from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import ReactHtmlParser from 'react-html-parser'
import AccountExistContent from '../config/account-exist.json'

const AccountExistDiv = styled.div``

const AccountExist = () => {
	const Fragment = React.Fragment

	return (
		<AccountExistDiv className={`sm:mx-auto sm:w-full sm:max-w-md`}>
			{
				AccountExistContent.map((val, key) => {
					return (
						<Fragment key={key}>
							<div className={`min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8`}>
								<div className={`bg-white shadow sm:rounded-lg`}>
									<div className={`px-4 py-5 sm:p-6`}>
										<h3 className={`text-lg leading-6 font-medium text-red-600`}>
											{val.title}
									</h3>
										<div className={`mt-2 max-w-xl text-sm leading-5 text-gray-100`}>
											<p>{val.description}</p>
										</div>
										<div className={`mt-3 text-sm leading-5`}>
											{
												val.cta.map((val2, key) => {
													return(
														<Fragment key={key}>
															<Link href={`${val2.url}`}>
																<a className={`font-medium text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150`}>
																	{ReactHtmlParser(val2.label)}
																</a>
															</Link>
														</Fragment>
													)
												})
											}
										</div>
									</div>
								</div>
							</div>
						</Fragment>
					)
				})
			}
		</AccountExistDiv>
	)
}

export default AccountExist