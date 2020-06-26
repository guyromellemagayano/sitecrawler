import { useState } from 'react'
import Router from "next/router";
import { useRouter } from 'next/router'
import fetch from 'node-fetch'
import Cookies from 'js-cookie'
import useSWR from 'swr'
import Head from 'next/head'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Transition from '../../../hooks/Transition'
import Layout from '../../../components/Layout'
import MobileSidebar from '../../../components/sidebar/MobileSidebar'
import MainSidebar from '../../../components/sidebar/MainSidebar'
import fetchJson from '../../../hooks/fetchJson'

const SiteSettingsDiv = styled.section``

const SiteSettings = () => {
  const [errorMsg, setErrorMsg] = useState('')
	const [successMsg, setSuccessMsg] = useState('')
  const [disableInputFields, setDisableInputFields] = useState(0)
  const [showModal, setShowModal] = useState(false)

	const { query } = useRouter()
  
  const { data: site, mutate } = useSWR(() => (query.id ? `/api/site/${query.id}/` : null), () => fetchSiteSettings(`/api/site/${query.id}/`), { refreshInterval: 1000 })

  const fetchSiteSettings = async (endpoint) => {
    const siteSettingsData = await fetchJson(endpoint, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRFToken': Cookies.get('csrftoken'),
      }
    })
    
    return siteSettingsData
  }
  
  const updateSiteSettings = async (endpoint, formData) => {    
    const response = await fetch(endpoint, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRFToken': Cookies.get('csrftoken'),
      },
      body: JSON.stringify(formData),
    })
    
    const data = await response.json()
  
    if (response.ok && response.status === 200) {
      if (data) {
        setSuccessMsg('Site information update success.')
        setDisableInputFields(!disableInputFields)

        return await response.json();
      }
    } else {
      const error = new Error(response.statusText)
  
      error.response = response
      error.data = data
  
      setErrorMsg('An unexpected error occurred. Please try again.')
  
      throw error
    }
  }

  const deleteSiteSettings = async (endpoint) => {    
    const redirectTo = '/sites'

    await fetch(endpoint, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRFToken': Cookies.get('csrftoken'),
      }
    })

    Router.push(redirectTo)
  }

  const handleSiteUpdate = async (e) => {
		e.preventDefault()
	
		const body = {
			name: e.currentTarget.site_name.value,
    }

    await updateSiteSettings(`/api/site/${query.id}/`, body)
    mutate(...site)
	}

	const handleEditSiteDetails = (e) => {
    e.preventDefault()

    setDisableInputFields(!disableInputFields)
  }

	const handleSiteDeletion = async (e) => {
    e.preventDefault()
    
    await deleteSiteSettings(`/api/site/${query.id}/`)
  }
  
  return (
    <Layout>
      <Head>
        <title>Site Settings</title>
      </Head>

      <SiteSettingsDiv className={`h-screen flex overflow-hidden bg-gray-100`}>
        <MobileSidebar />
        <MainSidebar />
        <div className={`flex flex-col w-0 flex-1 overflow-hidden`}>
          <div className={`md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3`}>
            <button
              className={`-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:bg-gray-200 transition ease-in-out duration-150`}
              aria-label={`Open sidebar`}
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
            <div className={`max-w-6xl mx-auto px-4 md:py-4 sm:px-6 md:px-8`}>
              <h1 className={`text-2xl font-semibold text-gray-900`}>
                Site Settings
              </h1>
            </div>
            <div className={`max-w-6xl mx-auto px-4 sm:px-6 md:px-8`}>
              <div className={`mt-5 max-w-6xl bg-white shadow sm:rounded-lg`}>
                <div className={`px-4 py-5 sm:p-6`}>
                  <form onSubmit={handleSiteUpdate}>
                    <div>
                      <div>
                        <div>
                          <h3
                            className={`text-lg leading-6 font-medium text-gray-900`}
                          >
                            Update Site
                          </h3>
                          <p className={`mt-1 text-sm leading-5 text-gray-500`}>
                            User generated content in real-time will have
                            multiple touchpoints for offshoring.
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
                                // value={site.name}
                                name={`site_name`}
                                disabled={
                                  disableInputFields == 0 ? true : false
                                }
                                className={`form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5 ${
                                  disableInputFields == 0 &&
                                  "opacity-50 bg-gray-300 cursor-not-allowed"
                                }`}
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
                                // value={site.url}
                                name={`site_url`}
                                disabled={`disabled`}
                                className={`form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5 opacity-50 bg-gray-300 cursor-not-allowed`}
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
                                disableInputFields == 1
                                  ? "opacity-50 bg-indigo-300 cursor-not-allowed"
                                  : "hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700"
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
                          <span
                            className={`ml-3 inline-flex rounded-md shadow-sm`}
                          >
                            <button
                              type={`submit`}
                              className={`inline-flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600 transition duration-150 ease-in-out ${
                                disableInputFields == 0
                                  ? "opacity-50 bg-green-300 cursor-not-allowed"
                                  : "hover:bg-green-500 focus:outline-none focus:border-green-700 focus:shadow-outline-green active:bg-green-700"
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

              <div className={`mt-5 max-w-6xl bg-white shadow sm:rounded-lg`}>
                <div className={`px-4 py-5 sm:p-6`}>
                  <div>
                    <div>
                      <div>
                        <h3
                          className={`text-lg leading-6 font-medium text-gray-900`}
                        >
                          Delete Site
                        </h3>
                        <p className={`mt-1 text-sm leading-5 text-gray-500`}>
                          User generated content in real-time will have multiple
                          touchpoints for offshoring.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div
                    className={`mt-8 border-t border-gray-200 pt-5 flex justify-between`}
                  >
                    <div className={`flex justify-start`}>
                      <span className={`inline-flex rounded-md shadow-sm`}>
                        <button
                          type={`button`}
                          id={`siteDeleteModalButton`}
                          className={`inline-flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-red-600 transition duration-150 ease-in-out hover:bg-red-500 focus:outline-none focus:border-red-700 focus:shadow-outline-red active:bg-red-700`}
                          onClick={() => setShowModal(!showModal)}
                        >
                          Delete Site
                        </button>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>

        <Transition show={showModal}>
          <div
            className={`fixed bottom-0 inset-x-0 px-4 pb-4 sm:inset-0 sm:flex sm:items-center sm:justify-center`}
          >
            <Transition
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-100"
            >
              <div
                className={`fixed inset-0 transition-opacity`}
              >
                <div className={`absolute inset-0 bg-gray-500 opacity-75`}></div>
              </div>
            </Transition>
            <Transition
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div
                className={`bg-white rounded-lg px-4 pt-5 pb-4 overflow-hidden shadow-xl transform transition-all sm:max-w-lg sm:w-full sm:p-6`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-headline"
              >
                <div className={`sm:flex sm:items-start`}>
                  <div
                    className={`mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10`}
                  >
                    <svg
                      className={`h-6 w-6 text-red-600`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                      />
                    </svg>
                  </div>
                  <div className={`mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left`}>
                    <h3
                      className={`text-lg leading-6 font-medium text-gray-900" id="modal-headline`}
                    >
                      Delete Site
                    </h3>
                    <div className={`mt-2`}>
                      <p className={`text-sm leading-5 text-gray-500`}>
                        Capitalize on low hanging fruit to identify a ballpark value
                        added activity to beta test. Override the digital divide
                        with additional clickthroughs from DevOps.
                      </p>
                    </div>
                  </div>
                </div>
                <div className={`mt-5 sm:mt-4 sm:flex sm:flex-row-reverse`}>
                  <span
                    className={`flex w-full rounded-md shadow-sm sm:ml-3 sm:w-auto`}
                  >
                    <button
                      type="button"
                      className={`inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-red-600 text-base leading-6 font-medium text-white shadow-sm hover:bg-red-500 focus:outline-none focus:border-red-700 focus:shadow-outline-red transition ease-in-out duration-150 sm:text-sm sm:leading-5`}
                      onClick={(e) => handleSiteDeletion(e)}
                    >
                      Delete
                    </button>
                  </span>
                  <span
                    className={`mt-3 flex w-full rounded-md shadow-sm sm:mt-0 sm:w-auto`}
                  >
                    <button
                      type="button"
                      className={`inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5`}
                      onClick={() => setTimeout(() => setShowModal(!showModal), 150)}
                    >
                      Cancel
                    </button>
                  </span>
                </div>
              </div>
            </Transition>
          </div>
        </Transition>
      </SiteSettingsDiv>
    </Layout>
  );
}

export default SiteSettings

SiteSettings.propTypes = {}