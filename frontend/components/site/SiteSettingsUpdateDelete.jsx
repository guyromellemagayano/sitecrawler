import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import fetch from 'node-fetch'
import Cookies from 'js-cookie'
import styled from 'styled-components'
import useSWR from 'swr'
import PropTypes from 'prop-types'

const fetcher = async (url) => {
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-CSRFToken': Cookies.get('csrftoken'),
    },
  })

  const data = await res.json()

  if (res.status !== 200) {
    throw new Error(data.message)
  }

  return data
}

const SiteSettingsUpdateDeleteDiv = styled.div``

const SiteSettingsUpdateDelete = () => {
	const [errorMsg, setErrorMsg] = useState('')
	const [successMsg, setSuccessMsg] = useState('')
	const [disableInputFields, setDisableInputFields] = useState(0)
	const [siteName, setSiteName] = useState('')
  const [siteUrl, setSiteUrl] = useState('')

	let { query } = useRouter()
	
	const { data: site, error: siteError } = useSWR(() => (query.id ? `/api/site/${query.id}/` : null), fetcher, { refreshInterval: 1000 })

	// useEffect(() => {
	// 	setSiteName(site.name)
	// 	setSiteUrl(site.url)
	// }, [])

	if (siteError) return <div>{siteError.message}</div>
	if (!site) return <div>Loading...</div>
	
	const handleSiteUpdate = async (e) => {
		e.preventDefault()

		if (errorMsg) setErrorMsg('')
		if (successMsg) setSuccessMsg('')
	
		const body = {
			site_name: e.currentTarget.site_name.value,
			site_url: e.currentTarget.site_url.value
		}

		try {
			const response = await fetch(`/api/site/${query.id}/`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRFToken': Cookies.get('csrftoken'),
        },
        body: JSON.stringify(body),
			})
      
			const data = await response.json()

      if (response.ok && response.status === 200) {
        if (data) {
          setSuccessMsg('Site information update success.')
          setDisableInputFields(!disableInputFields)
        }
      } else {
        const error = new Error(response.statusText)
  
        error.response = response
        error.data = data
  
        throw error
      }
		} catch(error) {
			if (!error.data) {
				error.data = { message: error.message }
			}

			setErrorMsg('An unexpected error occurred. Please try again.')

      throw error
		}
	}

	const handleEditSiteDetails = (e) => {
    e.preventDefault()

    setDisableInputFields(!disableInputFields)
  }

  const handleSiteNameInputChange = (e) => {
    setSiteName(e.target.value)
  }

  const handleSiteUrlInputChange = (e) => {
    setSiteUrl(e.target.value)
  }

	const handleSiteDeletion = async (e) => {
    
	}

	return (
		<SiteSettingsUpdateDeleteDiv>
			<div className={`mt-5 max-w-6xl bg-white shadow sm:rounded-lg`}>
				<div className={`px-4 py-5 sm:p-6`}>
					<form onSubmit={handleSiteUpdate}>
						<div>
							<div>
								<div>
									<h3 className={`text-lg leading-6 font-medium text-gray-900`}>
										Update Site
									</h3>
									<p className={`mt-1 text-sm leading-5 text-gray-500`}>
										User generated content in real-time will have multiple touchpoints for offshoring.
									</p>
								</div>
								<div
									className={`mt-6 grid grid-cols-1 row-gap-6 col-gap-4 sm:grid-cols-6`}
								>
									<div className={`sm:col-span-6`}>
										<label
											htmlFor={`site_name`}
											className={`block text-sm font-medium leading-5 text-gray-700`}
										>
											New Site Name
										</label>
										<div className={`mt-1 flex rounded-md shadow-sm`}>
											<input
												type={`text`}
												id={`site_name`}
												value={siteName}
												name={`site_name`}
												disabled={disableInputFields == 0 ? true : false}
												className={`form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5 ${
												  disableInputFields == 0 &&
												  "opacity-50 bg-gray-300 cursor-not-allowed"
												  }`}
												onChange={handleSiteNameInputChange}
											/>
										</div>
									</div>
								</div>
								<div
									className={`mt-6 grid grid-cols-1 row-gap-6 col-gap-4 sm:grid-cols-6`}
								>
									<div className={`sm:col-span-6`}>
										<label
											htmlFor={`password1`}
											className={`block text-sm font-medium leading-5 text-gray-700`}
										>
											New Site URL Link
										</label>
										<div className={`mt-1 flex rounded-md shadow-sm`}>
											<input
												type={`text`}
												id={`site_url`}
												value={siteUrl}
												name={`site_url`}
												disabled={disableInputFields == 0 ? true : false}
												className={`form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5 ${
													disableInputFields == 0 &&
													"opacity-50 bg-gray-300 cursor-not-allowed"
													}`}
												onChange={handleSiteUrlInputChange}
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className={`mt-8 border-t border-gray-200 pt-5`}>
							<div className={`flex justify-between`}>
								<div className={`flex justify-start`}>
									<span className={`inline-flex rounded-md shadow-sm`}>
										<button
											type={`submit`}
											disabled={disableInputFields == 1 ? true : false}
											className={`inline-flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 transition duration-150 ease-in-out ${
												disableInputFields == 1 ?
													"opacity-50 bg-indigo-300 cursor-not-allowed" : "hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700"
												}`}
											onClick={handleEditSiteDetails}
										>
											Edit Site
										</button>
									</span>

									{errorMsg && (
										<div className={`inline-block ml-2 p-2`}>
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
										<div className={`inline-block ml-2 p-2`}>
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
								<div className={`flex justify-end`}>
									<span className={`ml-3 inline-flex rounded-md shadow-sm`}>
										<button
											type={`submit`}
											className={`inline-flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600 transition duration-150 ease-in-out ${
												disableInputFields == 0 ?
													"opacity-50 bg-green-300 cursor-not-allowed" : "hover:bg-green-500 focus:outline-none focus:border-green-700 focus:shadow-outline-green active:bg-green-700"
												}`}
										>
											Save Changes
										</button>
									</span>
								</div>
							</div>
						</div>
					</form>
				</div>
			</div>

			{/* <div className={`mt-5 max-w-6xl bg-white shadow sm:rounded-lg`}>
				<div className={`px-4 py-5 sm:p-6`}>
					<form onSubmit={handleSiteDeletion}>
						<div>
							<div>
								<div>
									<h3 className={`text-lg leading-6 font-medium text-gray-900`}>
										Delete Site
									</h3>
									<p className={`mt-1 text-sm leading-5 text-gray-500`}>
										User generated content in real-time will have multiple touchpoints for offshoring.
									</p>
								</div>
							</div>
						</div>
						<div className={`mt-8 border-t border-gray-200 pt-5 flex justify-between`}>
							<div className={`flex justify-start`}>
								<span className={`inline-flex rounded-md shadow-sm`}>
									<button
										type={`button`}
										className={`inline-flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-red-600 transition duration-150 ease-in-out hover:bg-red-500 focus:outline-none focus:border-red-700 focus:shadow-outline-red active:bg-red-700`}
									>
										Delete Site
									</button>
								</span>
							</div>
						</div>
					</form>
				</div>
			</div> */}
		</SiteSettingsUpdateDeleteDiv>
	)
}

export default SiteSettingsUpdateDelete

SiteSettingsUpdateDelete.propTypes = {}