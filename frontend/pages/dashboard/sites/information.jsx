import { useCallback, useEffect, useState, Fragment } from 'react'
import useSWR from 'swr'
import Cookies from 'js-cookie'
import Router from 'next/router'
import Head from 'next/head'
import styled from 'styled-components'
import Link from 'next/link'
import PropTypes from 'prop-types'
import fetchJson from '../../../hooks/fetchJson'
import Layout from '../../../components/Layout'
import MobileSidebar from '../../../components/sidebar/MobileSidebar'
import MainSidebar from '../../../components/sidebar/MainSidebar'

const SitesInformationDiv = styled.section`
  .wizard-indicator {
    height: 0.25rem
  }
`

const SitesInformation = props => {
  const [disableSiteVerify, setDisableSiteVerify] = useState(false)
  const [successMsg, setSuccessMsg] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [errorSiteUrlMsg, setErrorSiteUrlMsg] = useState("")
  const [siteName, setSiteName] = useState("")
  const [urlProtocol, setUrlProtocol] = useState("https://")
  const [siteUrl, setSiteUrl] = useState("")
  const [enableNextStep, setEnableNextStep] = useState(false)
  const [dataQuery, setDataQuery] = useState([])
  const pageTitle = "Add New Site Detail"

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (errorMsg) setErrorMsg("")
    if (successMsg) setSuccessMsg("")

    const body = {
      name: siteName,
      url: e.currentTarget.urlpath.value,
    }

    if (
      body.name !== "" &&
      body.name !== undefined &&
      body.name !== null &&
      body.url !== "" &&
      body.url !== undefined &&
      body.url !== null
    ) {
      try {
        const response = await fetch("/api/site/", {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-CSRFToken": Cookies.get("csrftoken"),
          },
        })

        const data = await response.json()

        if (response.ok) {
          if (data) {
            const result = data.results.find((site) => site.url === siteUrl)

            if (typeof result !== "undefined") {
              setErrorSiteUrlMsg(
                "Unfortunately, this site URL already exists. Please try again."
              )
              return false
            } else {
              try {
                const siteResponse = await fetch("/api/site/", {
                  method: "POST",
                  headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "X-CSRFToken": Cookies.get("csrftoken"),
                  },
                  body: JSON.stringify(body),
                }) 

                const siteData = await siteResponse.json()

                if (siteResponse.ok) {
                  if (siteData) {
                    setDataQuery(siteData)

                    setSuccessMsg("Site URL added. Proceed to the next step.")

                    setDisableSiteVerify(!disableSiteVerify)
                    setEnableNextStep(!enableNextStep)
                  }
                }
              } catch (error) {
                if (!error.data) {
                  error.data = { message: error.message }
                }

                setErrorMsg("An unexpected error occurred. Please try again.")

                throw error
              }
            }
          }
        } else {
          const error = new Error(response.statusText)

          error.response = response
          error.data = data

          throw error
        }
      } catch (error) {
        if (!error.data) {
          error.data = { message: error.message }
        }

        setErrorSiteUrlMsg("An unexpected error occurred. Please try again.")

        throw error
      }
    } else {
      if (
        (body.name === "" || body.name === undefined || body.name === null) || 
        (body.url === "" || body.url === undefined || body.url === null)
      ) {
        setErrorMsg("Please fill in the empty field.")
      }
    }
  }

  const handleUpdateSubmit = async (e) => {
    e.preventDefault()

    if (errorMsg) setErrorMsg("")
    if (successMsg) setSuccessMsg("")

    const body = {
      name: siteName,
    }

    if (
      body.name !== "" &&
      body.name !== undefined &&
      body.name !== null
    ) {
      try {
        const response = await fetch(`/api/site/${props.sid}/`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-CSRFToken": Cookies.get("csrftoken"),
          },
        })

        const data = await response.json()

        if (response.ok) {
          if (data) {
            try {
              const siteResponse = await fetch(`/api/site/${props.sid}/`, {
                method: "PATCH",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                  "X-CSRFToken": Cookies.get("csrftoken"),
                },
                body: JSON.stringify(body),
              })

              const siteData = await siteResponse.json()

              if (siteResponse.ok) {
                if (siteData) {
                  setDataQuery(siteData)

                  if (props.sid === undefined) {
                    setSuccessMsg("Site URL added. Proceed to the next step.")
                  } else {
                    setSuccessMsg("Site URL updated. Go back to the last step.")
                  }

                  setDisableSiteVerify(!disableSiteVerify)
                  setEnableNextStep(!enableNextStep)
                }
              }
            } catch (error) {
              if (!error.data) {
                error.data = { message: error.message }
              }

              setErrorMsg("An unexpected error occurred. Please try again.")

              throw error
            }
          }
        } else {
          const error = new Error(response.statusText)

          error.response = response
          error.data = data

          throw error
        }
      } catch (error) {
        if (!error.data) {
          error.data = { message: error.message }
        }

        setErrorSiteUrlMsg("An unexpected error occurred. Please try again.")

        throw error
      }
    } else {
      if (
        (body.name === "" || body.name === undefined || body.name === null)
      ) {
        setErrorMsg("Please fill in the empty field.")
      }
    }
  }

  useEffect(() => {
    if (siteName || siteUrl) {
      setErrorSiteUrlMsg("")
    }
  }, [siteName, siteUrl])

  useEffect(() => {
    Router.prefetch("/dashboard/sites/verify-url")
  }, [dataQuery])

  const { data: site } = useSWR(`/api/site/${props !== undefined ? props.sid : null}`, () => fetchSiteData(`/api/site/` + props.sid))

  useEffect(() => {
    if (site !== '' && site !== undefined) {
      setSiteName(site.name)
      setSiteUrl(site.url)
    }
  }, [site])

  const fetchSiteData = async (endpoint) => {
    const siteData = await fetchJson(endpoint, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-CSRFToken': Cookies.get('csrftoken'),
      }
    })

    return siteData
  }

  return (
    <Layout>
      <Head>
        <title>{pageTitle}</title>
      </Head>

      <SitesInformationDiv
        className={`h-screen flex overflow-hidden bg-gray-100`}
      >
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
              <div className={`bg-white overflow-hidden shadow-xs rounded-lg`}>
                <div className={`px-4 pt-4 sm:px-8 sm:pt-8`}>
                  <div className={`max-w-6xl pt-4 m-auto`}>
                    <h4
                      className={`text-2xl leading-6 font-medium text-gray-900`}
                    >
                      Add a new site
                    </h4>
                    <p
                      className={`max-w-6xl mt-2 text-sm leading-5 text-gray-500`}
                    >
                      Organically grow the holistic world view of disruptive
                      innovation via workplace diversity and empowerment.
                    </p>
                  </div>
                </div>
                <div
                  className={`max-w-6xl sm:px-8 sm:pt-6 sm:pb-8 grid gap-16 pt-12 lg:grid-cols-4 lg:col-gap-5 lg:row-gap-12`}
                >
                  <div className={`wizard-indicator bg-green-500`}>
                    <p
                      className={`max-w-2xl mt-4 text-sm leading-2 font-medium text-black-400`}
                    >
                      1. Fill in site information
                    </p>
                  </div>
                  <div className={`wizard-indicator bg-gray-100`}>
                    <p
                      className={`max-w-2xl mt-4 text-sm leading-2 text-gray-400`}
                    >
                      2. Verify site
                    </p>
                  </div>
                  <div className={`wizard-indicator bg-gray-100`}>
                    <p
                      className={`max-w-2xl mt-4 text-sm leading-2 text-gray-400`}
                    >
                      3. Prepare the site profile
                    </p>
                  </div>
                </div>

                <div className={`px-4 pt-8 pb-12 sm:px-8`}>
                  <div className={`max-w-6xl py-4 m-auto`}>
                    <div>
                      <h4
                        className={`text-lg leading-7 font-medium text-gray-900`}
                      >
                        Fill in site information
                      </h4>
                      <p
                        className={`mt-1 text-sm leading-5 text-gray-500 max-w-6xl`}
                      >
                        Capitalize on low hanging fruit to identify a ballpark
                        value added activity to beta test.
                      </p>
                    </div>

                    <form onSubmit={props.sid !== undefined ? handleUpdateSubmit : handleSubmit}>
                      <div className={`my-6 max-w-sm`}>
                        <label
                          htmlFor="sitename"
                          className={`block text-sm font-medium leading-5 text-gray-700`}
                        >
                          Site Name
                        </label>
                        <div
                          className={`mt-1 mb-1 relative rounded-md shadow-xs-sm`}
                        >
                          <input
                            id={`sitename`}
                            type="text"
                            disabled={disableSiteVerify ? true : false}
                            name={`sitename`}
                            value={siteName ? siteName : ''}
                            className={`${
                              errorMsg && !siteName
                                ? "border-red-300 text-red-900 placeholder-red-300 focus:border-red-300 focus:shadow-outline-red form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                                : "form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                            } ${disableSiteVerify ? "opacity-50 bg-gray-300 cursor-not-allowed" : ""}`}
                            placeholder="e.g. My Company Website"
                            aria-describedby={`${
                              errorMsg ? "site-name-error" : "site-name"
                            }`}
                            aria-invalid={`${errorMsg ? true : false}`}
                            onChange={(e) => setSiteName(e.target.value)}
                          />
                          {errorMsg && !siteName ? (
                            <div
                              className={`absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none`}
                            >
                              <svg
                                className={`h-5 w-5 text-red-500`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          ) : null}
                        </div>
                        {errorMsg && !siteName ? (
                          <div className={`inline-block py-2`}>
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
                        ) : null}
                      </div>
                      <div className={`my-6 max-w-sm`}>
                        <label
                          htmlFor="siteurl"
                          className={`block text-sm font-medium leading-5 text-gray-700`}
                        >
                          Site URL
                        </label>
                        <div className={`mt-1 relative rounded-md shadow-xs-sm`}>
                          <div className={`absolute inset-y-0 left-0 flex items-center`}>
                            <select
                              disabled={props.sid !== undefined ? true : false}
                              value={urlProtocol}
                              aria-label="site-url"
                              className={`form-select h-full py-0 pl-3 pr-8 border-transparent bg-transparent text-gray-500 sm:text-sm sm:leading-5`}
                              onChange={(e) => setUrlProtocol(e.target.value)}
                            >
                              <option value="https://">https://</option>
                              <option value="http://">http://</option>
                            </select>
                          </div>
                          <input
                            id={`siteurl`}
                            type={`text`}
                            name={`siteurl`}
                            disabled={props.sid !== undefined ? true : false}
                            value={siteUrl ? siteUrl.replace(/^(https?:|)\/\//, '') : ''}
                            className={`${
                              errorMsg && !siteUrl
                                ? "border-red-300 text-red-900 placeholder-red-300 focus:border-red-300 focus:shadow-outline-red form-input block pl-24 w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                                : "form-input block pl-24 w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                            } ${props.sid !== undefined ? "opacity-50 bg-gray-300 cursor-not-allowed" : ""}`}
                            placeholder="e.g. yourdomain.com"
                            aria-describedby={`site-url`}
                            aria-describedby={`${
                              errorMsg ? "site-url-error" : "site-url"
                            }`}
                            aria-invalid={`${errorMsg ? true : false}`}
                            onChange={(e) => setSiteUrl(e.target.value)}
                          />
                          <input
                            id={`urlpath`}
                            type="hidden"
                            name={`urlpath`}
                            disabled={props.sid !== undefined ? true : false}
                            value={urlProtocol + siteUrl}
                          />
                          {errorMsg && !siteUrl ? (
                            <div
                              className={`absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none`}
                            >
                              <svg
                                className={`h-5 w-5 text-red-500`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                          ) : null}
                        </div>
                        {errorMsg && !siteUrl ? (
                          <div className={`inline-block py-2`}>
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
                        ) : null}
                      </div>

                      <div
                        className={`sm:flex sm:items-center sm:justify-between`}
                      >
                        <div>
                          {props.sid === undefined ? (
                            <span className={`inline-flex rounded-md shadow-xs-sm`}>
                              {disableSiteVerify ? (
                                <button
                                  disabled={`disabled`}
                                  type={`submit`}
                                  className={`mt-3 mr-3 rounded-md shadow-xs sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 opacity-50 cursor-not-allowed`}
                                >
                                  Add Site Detail
                                </button>
                              ) : (
                                <button
                                  type={`submit`}
                                  className={`mt-3 mr-3 rounded-md shadow-xs sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:shadow-xs-outline-indigo focus:border-indigo-700 active:bg-indigo-700`}
                                >
                                  Add Site Detail
                                </button>
                              )}
                            </span>
                          ) : (
                            <span className={`inline-flex rounded-md shadow-xs-sm`}>
                              {disableSiteVerify ? (
                                <button
                                  disabled={`disabled`}
                                  type={`submit`}
                                  className={`mt-3 mr-3 rounded-md shadow-xs sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 opacity-50 cursor-not-allowed`}
                                >
                                  Update Site Detail
                                </button>
                              ) : (
                                <button
                                  type={`submit`}
                                  className={`mt-3 mr-3 rounded-md shadow-xs sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:shadow-xs-outline-indigo focus:border-indigo-700 active:bg-indigo-700`}
                                >
                                  Update Site Detail
                                </button>
                              )}
                            </span>
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

                          {errorSiteUrlMsg && (
                            <div className={`inline-block p-2`}>
                              <div className={`flex`}>
                                <div>
                                  <h3
                                    className={`text-sm leading-5 font-medium text-red-800 break-words`}
                                  >
                                    {errorSiteUrlMsg}
                                  </h3>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        {enableNextStep ? (
                          <div className={`sm:flex sm:justify-end`}>
                            <Link
                              href={{
                                pathname: "/dashboard/sites/verify-url",
                                query: {
                                  sid: dataQuery.id,
                                  sname: dataQuery.name,
                                  surl: dataQuery.url,
                                  vid: dataQuery.verification_id,
                                  v: false,
                                },
                              }}
                            >
                              <a
                                type={`button`}
                                className={`mt-3 rounded-md shadow-xs sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600 hover:bg-green-500 focus:outline-none focus:shadow-xs-outline-green focus:border-green-700 active:bg-green-700`}
                              >
                                {props.sid !== undefined ? "Go back to Step 2" : "Proceed to Step 2"}
                              </a>
                            </Link>
                          </div>
                        ) : null}
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </SitesInformationDiv>
    </Layout>
  )
}

SitesInformation.getInitialProps = ({ query }) => {
  return {
    sid: query.sid,
  }
}

export default SitesInformation

SitesInformation.propTypes = {
  disableSiteVerify: PropTypes.bool,
  errorMsg: PropTypes.string,
  successMsg: PropTypes.string,
  errorSiteUrlMsg: PropTypes.string,
  siteName: PropTypes.string,
  siteUrl: PropTypes.string,
  enableNextStep: PropTypes.bool,
  dataQuery: PropTypes.object,
  pageTitle: PropTypes.string,
  handleSubmit: PropTypes.func,
}
