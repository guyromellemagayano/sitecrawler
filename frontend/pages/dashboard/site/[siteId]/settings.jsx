import { useState, useEffect } from 'react'
import Router from "next/router";
import { useRouter } from 'next/router'
import fetch from 'node-fetch'
import Cookies from 'js-cookie'
import useSWR from 'swr'
import Head from 'next/head'
import Link from 'next/link'
import styled from 'styled-components'
import Skeleton from 'react-loading-skeleton'
import PropTypes from 'prop-types'
import Layout from '../../../../components/Layout'
import MobileSidebar from '../../../../components/sidebar/MobileSidebar'
import MainSidebar from '../../../../components/sidebar/MainSidebar'
import Transition from '../../../../hooks/Transition'
import fetchJson from '../../../../hooks/fetchJson'

const SiteSettingsDiv = styled.section``

const SiteSettings = () => {
  const [openMobileSidebar, setOpenMobileSidebar] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
	const [successMsg, setSuccessMsg] = useState('')
  const [disableInputFields, setDisableInputFields] = useState(0)
  const [siteName, setSiteName] = useState('')
  const [siteUrl, setSiteUrl] = useState('')
  const [showModal, setShowModal] = useState(false)

  const { query } = useRouter()
  const pageTitle = 'Site Settings |'
  const { data: site, error: siteError } = useSWR(() => (query.siteId ? `/api/site/${query.siteId}/` : null), () => fetchSiteSettings(`/api/site/${query.siteId}/`), { refreshInterval: 1000 })

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
    const redirectTo = '/dashboard/sites'

    await fetch(endpoint, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRFToken': Cookies.get('csrftoken'),
      }
    })

    setTimeout(
      () => Router.push(redirectTo),
      150
    )
  }

  const handleSiteUpdate = async (e) => {
		e.preventDefault()
	
		const body = {
      name: e.currentTarget.site_name.value,
      url: e.currentTarget.site_url.value
    }

    await updateSiteSettings(`/api/site/${query.siteId}/`, body)
	}

	const handleEditSiteDetails = (e) => {
    e.preventDefault()

    setDisableInputFields(!disableInputFields)
  }

  const handleSiteNameInputChange = (e) => {
    setSiteName(e.target.value)
  }

	const handleSiteDeletion = async (e) => {
    e.preventDefault()
    
    await deleteSiteSettings(`/api/site/${query.siteId}/`)
  }

  useEffect(() => {
		if (site !== '' && site !== undefined) {
			setSiteName(site.name)
      setSiteUrl(site.url)
    }
  }, [site])

  if (!site) {
    return (
      <SiteSettingsDiv className={`h-screen flex overflow-hidden bg-gray-100`}>
        <MainSidebar />

        <div className={`flex flex-col w-0 flex-1 overflow-hidden`}>
          <div className={`md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3`}>
            <span
              className={`-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center`}
            >
              <Skeleton duration={2} width={30} height={30} />
            </span>
          </div>
          <main
            className={`flex-1 relative z-0 overflow-y-auto pt-2 pb-6 focus:outline-none md:py-6`}
            tabIndex={`0`}
          >
            <div className={`max-w-full mx-auto px-4 md:py-4 sm:px-6 md:px-8`}>
              <div>
                <Skeleton duration={2} width={120} />
              </div>
              <div className={`mt-2 md:flex md:items-center md:justify-between`}>
                <div className={`flex-1 min-w-0`}>
                  <Skeleton duration={2} width={280} />
                </div>
              </div>
            </div>
            <div className={`max-w-full mx-auto px-4 sm:px-6 md:px-8`}>
              <div className={`mt-5 max-w-full`}>
                <div>
                  <Skeleton duration={2} width={280} height={359} />
                </div>
              </div>

              <div className={`mt-5 max-w-full`}>
                <div>
                  <Skeleton duration={2} width={280} height={187} />
                </div>
              </div>
            </div>
          </main>
        </div>
      </SiteSettingsDiv>
    )
  }
  
  return (
    <Layout>
      <Head>
        <title>{pageTitle} {siteName}</title>
      </Head>

      <SiteSettingsDiv className={`h-screen flex overflow-hidden bg-gray-100`}>
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
            <div className={`max-w-full mx-auto px-4 md:py-4 sm:px-6 md:px-8`}>
              <div>
                <nav className={`sm:hidden`}>
                  <Link href={'/dashboard/site/' + query.siteId + '/overview'}>
                    <a className={`flex items-center text-sm leading-5 font-medium text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out`}>
                      <svg className={`flex-shrink-0 -ml-1 mr-1 h-5 w-5 text-gray-400`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                      Back to Overview
                    </a>
                  </Link>
                </nav>
                <nav className={`hidden sm:flex items-center text-sm leading-5`}>
                  <Link href={'/dashboard/site/' + query.siteId + '/overview'}>
                    <a className={`font-normal text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out`}>{siteName}</a>
                  </Link>
                  <svg className={`flex-shrink-0 mx-2 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor`}>
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                  </svg>
                  <Link href={'/dashboard/site/' + query.siteId + '/settings'}>
                    <a className={`font-medium text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out`}>Site Settings</a>
                  </Link>
                </nav>
              </div>
              <div className={`mt-2 md:flex md:items-center md:justify-between`}>
                <div className={`flex-1 min-w-0`}>
                  <h2 className={`text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:leading-9 sm:truncate lg:overflow-visible`}>
                    Site Settings - {siteName}
                  </h2>
                </div>
              </div>
            </div>
            <div className={`max-w-3xl px-4 sm:px-6 md:px-8`}>
              <div className={`mt-5 max-w-full bg-white shadow-xs rounded-lg`}>
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
                            <div className={`mt-1 flex rounded-md shadow-xs-sm`}>
                              <input
                                type={`text`}
                                id={`site_name`}
                                value={siteName}
                                name={`site_name`}
                                disabled={
                                  disableInputFields == 0 ? true : false
                                }
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
                            <div className={`mt-1 flex rounded-md shadow-xs-sm`}>
                              <input
                                type={`text`}
                                id={`site_url`}
                                value={siteUrl}
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
                          <span className={`inline-flex rounded-md shadow-xs-sm`}>
                            <button
                              type={`submit`}
                              disabled={disableInputFields == 1 ? true : false}
                              className={`inline-flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 transition duration-150 ease-in-out ${
                                disableInputFields == 1
                                  ? "opacity-50 bg-indigo-300 cursor-not-allowed"
                                  : "hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-xs-outline-indigo active:bg-indigo-700"
                              }`}
                              onClick={handleEditSiteDetails}
                            >
                              Edit Site
                            </button>
                          </span>

                          <span className={`inline-flex rounded-md shadow-xs-sm`}>
                            <button
                              disabled={disableInputFields == 1 ? false : true}
                              className={`inline-flex justify-center w-full rounded-md border border-gray-300 sm:ml-3 px-4 py-2 bg-white text-sm leading-5 font-medium text-gray-700 shadow-xs-sm transition ease-in-out duration-150 sm:text-sm sm:leading-5 ${
                                disableInputFields == 1 ?
                                  "hover:text-gray-500 focus:outline-none" : "opacity-50 cursor-not-allowed"
                                }`}
                              onClick={handleEditSiteDetails}
                            >
                              Cancel Edit
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
                            className={`ml-3 inline-flex rounded-md shadow-xs-sm`}
                          >
                            <button
                              type={`submit`}
                              className={`inline-flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600 transition duration-150 ease-in-out ${
                                disableInputFields == 0
                                  ? "opacity-50 bg-green-300 cursor-not-allowed"
                                  : "hover:bg-green-500 focus:outline-none focus:border-green-700 focus:shadow-xs-outline-green active:bg-green-700"
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

              <div className={`mt-5 max-w-full bg-white shadow-xs rounded-lg`}>
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
                      <span className={`inline-flex rounded-md shadow-xs-sm`}>
                        <button
                          type={`button`}
                          id={`siteDeleteModalButton`}
                          className={`inline-flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-red-600 transition duration-150 ease-in-out hover:bg-red-500 focus:outline-none focus:border-red-700 focus:shadow-xs-outline-red active:bg-red-700`}
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
                className={`bg-white rounded-lg px-4 pt-5 pb-4 overflow-hidden shadow-xs-xl transform transition-all sm:max-w-lg sm:w-full sm:p-6`}
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
                      className={`text-lg leading-6 font-medium text-gray-900`} id="modal-headline"
                    >
                      Delete Site
                    </h3>
                    <div className={`mt-2`}>
                      <p className={`text-sm leading-5 text-gray-500`}>
                        Are you sure you want to delete this website? You will lose all its data and settings.
                      </p>
                    </div>
                  </div>
                </div>
                <div className={`mt-5 sm:mt-4 sm:flex sm:flex-row-reverse`}>
                  <span
                    className={`flex w-full rounded-md shadow-xs-sm sm:ml-3 sm:w-auto`}
                  >
                    <button
                      type="button"
                      className={`inline-flex justify-center w-full rounded-md border border-transparent px-4 py-2 bg-red-600 text-base leading-6 font-medium text-white shadow-xs-sm hover:bg-red-500 focus:outline-none focus:border-red-700 focus:shadow-xs-outline-red transition ease-in-out duration-150 sm:text-sm sm:leading-5`}
                      onClick={(e) => handleSiteDeletion(e)}
                    >
                      Delete
                    </button>
                  </span>
                  <span
                    className={`mt-3 flex w-full rounded-md shadow-xs-sm sm:mt-0 sm:w-auto`}
                  >
                    <button
                      type="button"
                      className={`inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium text-gray-700 shadow-xs-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-xs-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5`}
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

SiteSettings.propTypes = {
  openMobileSidebar: PropTypes.bool,
  errorMsg: PropTypes.string,
  successMsg: PropTypes.string,
  disableInputFields: PropTypes.func,
  siteName: PropTypes.string,
  siteUrl: PropTypes.string,
  showModal: PropTypes.bool,
  query: PropTypes.func,
  pageTitle: PropTypes.string,
  fetchSiteSettings: PropTypes.func,
  updateSiteSettings: PropTypes.func,
  deleteSiteSettings: PropTypes.func,
  handleSiteUpdate: PropTypes.func,
  handleEditSiteDetails: PropTypes.func,
  handleSiteNameInputChange: PropTypes.func,
  handleSiteDeletion: PropTypes.func,
}