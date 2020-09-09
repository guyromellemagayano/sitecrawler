import { useEffect, useState, Fragment } from 'react'
import useSWR from 'swr'
import Cookies from 'js-cookie'
import Url from 'url-parse'
import Router, { withRouter } from 'next/router'
import Head from 'next/head'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Skeleton from 'react-loading-skeleton'
import ReactHtmlParser from 'react-html-parser';
import fetchJson from 'hooks/fetchJson'
import useUser from 'hooks/useUser'
import Layout from 'components/Layout'
import MobileSidebar from 'components/sidebar/MobileSidebar'
import MainSidebar from 'components/sidebar/MainSidebar'
import HowToSetup from 'components/sites/HowToSetup'

const SitesInformationDiv = styled.section`
  .wizard-indicator {
    height: 0.25rem
  }
`

const SitesInformation = props => {
  const [disableSiteVerify, setDisableSiteVerify] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [errorSiteNameMsg, setErrorSiteNameMsg] = useState("")
  const [errorSiteUrlMsg, setErrorSiteUrlMsg] = useState("")
  const [dupSiteProtocolExists, setDupSiteProtocolExists] = useState(false)
  const [siteName, setSiteName] = useState("")
  const [urlProtocol, setUrlProtocol] = useState("https://")
  const [siteUrl, setSiteUrl] = useState("")
  const [openMobileSidebar, setOpenMobileSidebar] = useState(false)
  const pageTitle = "Add a New Site"
  const { router } = props

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (errorMsg) setErrorMsg("")
    if (errorSiteNameMsg) setErrorSiteNameMsg("")
    if (errorSiteUrlMsg) setErrorSiteUrlMsg("")

    const siteUrl = new Url(e.currentTarget.urlpath.value)
    const body = {
      url: siteUrl.href,
      name: siteName,
    }
    
    if (
      body.name !== undefined && body.url !== "https://undefined" && body.url !== "http://undefined"
    ) {      
      if (
        siteUrl.origin === "https://https:" || 
        siteUrl.origin === "https://http:" ||
        siteUrl.origin === "http://https:" ||
        siteUrl.origin === "http://http:"
      ) {
        setDupSiteProtocolExists(true)
        setErrorSiteUrlMsg(ReactHtmlParser("You should only add hostname inside the input <br /><em>e.g. yourdomain.com</em>"))
      } else {
        try {
          const response = await fetch("/api/site/", {
            method: "GET",
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json",
              "X-CSRFToken": Cookies.get("csrftoken"),
            },
          })
  
          if (response.ok) {
            const data = await response.json()
  
            if (data) {
              const result = data.results.find((site) => site.url === siteUrl.href)
  
              if (typeof result !== "undefined") {
                setErrorMsg(
                  "Unfortunately, this site URL already exists. Please try again."
                )
                return false
              } else {
                try {
                  const siteResponse = await fetch("/api/site/", {
                    method: "POST",
                    headers: {
                      "Accept": "application/json",
                      "Content-Type": "application/json",
                      "X-CSRFToken": Cookies.get("csrftoken"),
                    },
                    body: JSON.stringify(body),
                  })
  
                  if (siteResponse.ok) {
                    const siteData = await siteResponse.json()
  
                    if (siteData) {
                      setDisableSiteVerify(!disableSiteVerify)

                      Router.push({
                        pathname: "/dashboard/sites/verify-url",
                        query: {
                          sid: siteData.id,
                          sname: siteData.name,
                          surl: siteData.url,
                          vid: siteData.verification_id,
                          v: false,
                        },
                      })
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
  
          setErrorMsg("An unexpected error occurred. Please try again.")
  
          throw error
        }
      }
    } else {
      setErrorSiteNameMsg("Please fill in the empty field.")
      setErrorSiteUrlMsg("Please fill in the empty field.")
    }
  }

  const handleUpdateSubmit = async (e) => {
    e.preventDefault()

    if (errorMsg) setErrorMsg("")

    const body = {
      name: siteName,
    }

    if (body.name !== "" && body.name !== undefined && body.name !== null) {
      try {
        const response = await fetch(`/api/site/${router.query.sid}/`, {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "X-CSRFToken": Cookies.get("csrftoken"),
          },
        })

        const data = await response.json()

        if (response.ok) {
          if (data) {
            try {
              const siteResponse = await fetch(`/api/site/${router.query.sid}/`, {
                method: "PATCH",
                headers: {
                  "Accept": "application/json",
                  "Content-Type": "application/json",
                  "X-CSRFToken": Cookies.get("csrftoken"),
                },
                body: JSON.stringify(body),
              })

              if (siteResponse.ok) {
                const siteData = await siteResponse.json()

                if (siteData) {
                  setDisableSiteVerify(!disableSiteVerify)

                  Router.push({
                    pathname: "/dashboard/sites/verify-url",
                    query: {
                      sid: siteData.id,
                      sname: siteData.name,
                      surl: siteData.url,
                      vid: siteData.verification_id,
                      v: false,
                    },
                  })
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
      if (body.name === "" || body.name === undefined || body.name === null) {
        setErrorSiteNameMsg("Please fill in the empty field.")
      }
    }
  }

  const fetchSiteData = async (endpoint) => {
    const siteData = await fetchJson(endpoint, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-CSRFToken": Cookies.get("csrftoken"),
      },
    })

    return siteData
  }

  const { data: sites } = useSWR(
    `/api/site/`,
    () =>
      fetchSiteData(
        `/api/site/`
      )
  )

  useEffect(() => {
    if (sites !== "" && sites !== undefined) {
      setSiteName(sites.name)
      setSiteUrl(sites.url)
    }
  }, [sites])

  if (router.query.sid !== undefined) {
    const { data: site } = useSWR(
      `/api/site/${router.query.sid}`,
      () =>
        fetchSiteData(
          `/api/site/${router.query.sid}`
        )
    )

    useEffect(() => {
      if (site !== "" && site !== undefined) {
        setSiteName(site.name)
        setSiteUrl(site.url)
      }
    }, [site])
  }

  const { user: user, userError: userError } = useUser({
    redirectTo: '/',
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

          <SitesInformationDiv
            className={`h-screen flex overflow-hidden bg-gray-100`}
          >
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
                <div className={`max-w-full mx-auto px-4 md:py-4 sm:px-6 md:px-8 grid gap-16 lg:grid-cols-3 lg:col-gap-5 lg:row-gap-12`}>
                  <div className={`lg:col-span-2 bg-white overflow-hidden shadow-xs rounded-lg`}>
                    <div className={`px-4 pt-4 px-8 sm:pt-8`}>
                      <div className={`max-w-full pt-4 m-auto`}>
                        <h4
                          className={`text-2xl leading-6 font-medium text-gray-900`}
                        >
                          Add a new site
                        </h4>
                        <p
                          className={`max-w-full mt-2 text-sm leading-5 text-gray-500`}
                        >
                          Organically grow the holistic world view of disruptive
                          innovation via workplace diversity and empowerment.
                        </p>
                      </div>
                    </div>
                    <div
                      className={`max-w-full px-8 pb-8 sm:pt-6 grid gap-16 pt-12 lg:grid-cols-2 lg:col-gap-5 lg:row-gap-12`}
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
                          className={`max-w-2xl mt-4 text-sm leading-2 font-medium text-black-400`}
                        >
                          2. Verify site
                        </p>
                      </div>
                    </div>
                    <div className={`inline-block pt-8 pb-12 px-8`}>
                      <div className={`max-w-full py-4 m-auto`}>
                        <div>
                          <h4
                            className={`text-lg leading-7 font-medium text-gray-900`}
                          >
                            Fill in site information
                          </h4>
                          <p
                            className={`mt-1 text-sm leading-5 text-gray-500 max-w-full`}
                          >
                            Capitalize on low hanging fruit to identify a ballpark
                            value added activity to beta test.
                          </p>
                        </div>

                        <form
                          onSubmit={
                            router.query.sid ? handleUpdateSubmit : handleSubmit
                          }
                        >
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
                                value={siteName ? siteName : ""}
                                className={`${
                                  errorSiteNameMsg && !siteName
                                    ? "border-red-300 text-red-900 placeholder-red-300 focus:border-red-300 focus:shadow-outline-red form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                                    : "form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                                } ${
                                  disableSiteVerify
                                    ? "opacity-50 bg-gray-300 cursor-not-allowed"
                                    : ""
                                }`}
                                placeholder="e.g. My Company Website"
                                aria-describedby={`${
                                  errorSiteNameMsg ? "site-name-error" : "site-name"
                                }`}
                                aria-invalid={`${errorSiteNameMsg ? true : false}`}
                                onChange={(e) => setSiteName(e.target.value)}
                              />
                              {errorSiteNameMsg && !siteName ? (
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

                            {errorSiteNameMsg && !siteName ? (
                              <div className={`inline-block py-2`}>
                                <div className={`flex`}>
                                  <div>
                                    <h3
                                      className={`text-sm leading-5 font-medium text-red-800 break-words`}
                                    >
                                      {errorSiteNameMsg}
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
                            <div
                              className={`mt-1 relative rounded-md shadow-xs-sm`}
                            >
                              <div
                                className={`absolute inset-y-0 left-0 flex items-center`}
                              >
                                <select
                                  disabled={disableSiteVerify || router.query.sid !== undefined ? true : false}
                                  tabIndex="-1"
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
                                disabled={disableSiteVerify || router.query.sid !== undefined ? true : false}
                                value={
                                  siteUrl
                                    ? siteUrl.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "")
                                    : ""
                                }
                                className={`${
                                  errorSiteUrlMsg && !siteUrl || dupSiteProtocolExists
                                    ? "border-red-300 text-red-900 placeholder-red-300 focus:border-red-300 focus:shadow-outline-red form-input block pl-24 w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                                    : "form-input block pl-24 w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                                } ${
                                  router.query.sid || disableSiteVerify
                                    ? "opacity-50 bg-gray-300 cursor-not-allowed"
                                    : ""
                                }`}
                                placeholder="e.g. yourdomain.com"
                                aria-describedby={`site-url`}
                                aria-describedby={`${
                                  errorSiteUrlMsg ? "site-url-error" : "site-url"
                                }`}
                                aria-invalid={`${errorSiteUrlMsg ? true : false}`}
                                onChange={(e) => setSiteUrl((e.target.value).replace(/\/+$/, ''))}
                              />
                              <input
                                id={`urlpath`}
                                type="hidden"
                                disabled={disableSiteVerify || router.query.sid !== undefined ? true : false}
                                name={`urlpath`}
                                value={urlProtocol.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "") + siteUrl}
                              />
                              
                              {errorSiteUrlMsg && !siteUrl || dupSiteProtocolExists ? (
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

                            {errorSiteUrlMsg && !siteUrl || dupSiteProtocolExists ? (
                              <div className={`inline-block py-2`}>
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
                            ) : null}
                          </div>

                          <div
                            className={`sm:flex sm:items-center sm:justify-start`}
                          >
                            <div>
                              {router.query.sid === undefined ? (
                                <span
                                  className={`inline-flex rounded-md shadow-xs-sm`}
                                >
                                  {disableSiteVerify ? (
                                    <button
                                      disabled={`disabled`}
                                      type={`submit`}
                                      className={`mt-3 mr-3 rounded-md shadow-xs sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 opacity-50 cursor-not-allowed`}
                                    >
                                      Proceed to Step 2
                                    </button>
                                  ) : (
                                    <button
                                      type={`submit`}
                                      className={`mt-3 mr-3 rounded-md shadow-xs sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:shadow-xs-outline-indigo focus:border-indigo-700 active:bg-indigo-700`}
                                    >
                                      Proceed to Step 2
                                    </button>
                                  )}
                                </span>
                              ) : (
                                <span
                                  className={`inline-flex rounded-md shadow-xs-sm`}
                                >
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
                            </div>

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
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>

                  <div className={`lg:col-span-1 bg-white overflow-hidden shadow-xs rounded-lg`}>
                    <HowToSetup />
                  </div>
                </div>
              </main>
            </div>
          </SitesInformationDiv>
        </Fragment>
      ) : null}
    </Layout>
  )
}

SitesInformation.getInitialProps = ({ query }) => {
  return {
    sid: query.sid,
  }
}

export default withRouter(SitesInformation)

SitesInformation.propTypes = {
  disableSiteVerify: PropTypes.bool,
  errorMsg: PropTypes.string,
  errorSiteUrlMsg: PropTypes.string,
  siteName: PropTypes.string,
  siteUrl: PropTypes.string,
  pageTitle: PropTypes.string,
  handleSubmit: PropTypes.func,
  handleUpdateSubmit: PropTypes.func,
}
