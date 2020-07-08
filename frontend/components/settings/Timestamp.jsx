import { useState, useEffect } from 'react'
import fetch from 'node-fetch'
import Cookies from 'js-cookie'
import useSWR from 'swr'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import fetchJson from '../../hooks/fetchJson'

const TimestampSettingsDiv = styled.div``

const TimestampSettings = () => {
	const [errorMsg, setErrorMsg] = useState('')
	const [successMsg, setSuccessMsg] = useState('')

	const { data: user, mutate: updateUser } = useSWR(() => ('/api/auth/user/'), () => fetchUserSettings(`/api/auth/user/`))

	const fetchUserSettings = async (endpoint) => {
		const userSettingsData = await fetchJson(endpoint, {
			method: 'GET',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'X-CSRFToken': Cookies.get('csrftoken'),
			}
		})

		return userSettingsData
	}

	const updateTimestampSettings = async (endpoint, state) => {
		user.settings.enableLocalTime = state

		const response = await fetch(endpoint, {
			method: 'PATCH',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'X-CSRFToken': Cookies.get('csrftoken'),
			},
			body: JSON.stringify(user),
		})

		const data = await response.json()

		if (response.ok && response.status === 200) {
			if (data.settings.enableLocalTime) {
				setSuccessMsg('Local time enabled globally.')
			} else {
				setSuccessMsg('Local time disabled globally.')
			}
			updateUser(data)
		} else {
			const error = new Error(response.statusText)

			error.response = response
			error.data = data

			setErrorMsg('An unexpected error occurred. Please try again.')

			throw error
		}
	}

	const handleToggleTimestamp = async (e) => {
		e.preventDefault()

		await updateTimestampSettings(`/api/auth/user/`, !user.settings.enableLocalTime)
	}

	if (!user) {
		return (<div>Loading...</div>)
	}

	return (
		<TimestampSettingsDiv
			className={`mt-5 max-w-6xl bg-white shadow sm:rounded-lg`}
		>
			<div className={`px-4 py-5 sm:p-6`}>
				<div>
					<div>
						<div>
							<h3 className={`text-lg leading-6 font-medium text-gray-900`}>
								Site Settings
							</h3>
							<p className={`mt-1 text-sm leading-5 text-gray-500`}>
								User generated content in real-time will have multiple
								touchpoints for offshoring.
							</p>
						</div>
						<div
							className={`mt-6 grid sm:grid sm:grid-cols-3 sm:gap-4 sm:items-baseline`}
						>
							<div className={`sm:col-span-6`}>

								<div className={`relative flex items-center`}>
									<div className={`absolute flex items-center h-5`}>
										<span
											role="checkbox"
											tabIndex="0"
											aria-checked={user.settings.enableLocalTime}
											className={`${user.settings.enableLocalTime ? "bg-indigo-600" : "bg-gray-200"} relative inline-flex flex-shrink-0 h-6 w-10 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:shadow-outline`}
											onClick={handleToggleTimestamp}
										>
											<span
												aria-hidden="true"
												className={`${user.settings.enableLocalTime ? "translate-x-4" : "translate-x-0"} relative inline-block h-5 w-5 rounded-full bg-white shadow transform transition ease-in-out duration-200`}
											>
												<span
													className={`${user.settings.enableLocalTime ? "opacity-0 ease-out duration-100" : "opacity-100 ease-in duration-200"} absolute inset-0 h-full w-full flex items-center justify-center transition-opacity`}
												>
													<svg
														className={`h-3 w-3 text-gray-400`}
														fill="none"
														viewBox="0 0 12 12"
													>
														<path
															d="M4 8l2-2m0 0l2-2M6 6L4 4m2 2l2 2"
															stroke="currentColor"
															strokeWidth="2"
															strokeLinecap="round"
															strokeLinejoin="round"
														/>
													</svg>
												</span>
												<span
													className={`${user.settings.enableLocalTime ? "opacity-100 ease-in duration-200" : "opacity-0 ease-out duration-100"} absolute inset-0 h-full w-full flex items-center justify-center transition-opacity`}
												>
													<svg
														className={`h-3 w-3 text-indigo-600`}
														fill="currentColor"
														viewBox="0 0 12 12"
													>
														<path d="M3.707 5.293a1 1 0 00-1.414 1.414l1.414-1.414zM5 8l-.707.707a1 1 0 001.414 0L5 8zm4.707-3.293a1 1 0 00-1.414-1.414l1.414 1.414zm-7.414 2l2 2 1.414-1.414-2-2-1.414 1.414zm3.414 2l4-4-1.414-1.414-4 4 1.414 1.414z" />
													</svg>
												</span>
											</span>
										</span>
									</div>
									<div className={`ml-2 pl-12 text-sm leading-5`}>
										<label htmlFor="candidates" className={`font-medium text-gray-700`}>Enable Local Time</label>
										<p className={`text-gray-500`}>Set all sites to use local times instead of UTC</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className={`mt-8 border-t border-gray-200 pt-5`}>
					<div className={`flex justify-between`}>
						<div className={`flex justify-start`}>
							{errorMsg && (
								<div className={`inline-block p-2`}>
									<div className={`flex`}>
										<div>
											<h3
												className={`text-sm leading-5 font-medium text-red-800 break-words`}
											>
												{errorMsg}
											</h3>
										</div>
									</div>
								</div>
							)}

							{successMsg && (
								<div className={`inline-block p-2`}>
									<div className={`flex`}>
										<div>
											<h3
												className={`text-sm leading-5 font-medium text-green-800 break-words`}
											>
												{successMsg}
											</h3>
										</div>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</TimestampSettingsDiv>
	)
}

export default TimestampSettings

TimestampSettings.propTypes = {}
