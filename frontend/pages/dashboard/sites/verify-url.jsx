import { useState, useEffect, Fragment } from 'react'
import fetch from 'node-fetch'
import Cookies from 'js-cookie'
import Head from 'next/head'
import styled from 'styled-components'
import Link from 'next/link'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import PropTypes from 'prop-types'
import Skeleton from 'react-loading-skeleton'
import Transition from 'hooks/Transition'
import useUser from 'hooks/useUser'
import Layout from 'components/Layout'
import MobileSidebar from 'components/sidebar/MobileSidebar'
import MainSidebar from 'components/sidebar/MainSidebar'
import HowToSetup from 'components/sites/HowToSetup'

const SitesVerifyUrlDiv = styled.section`
  ol {
    list-style-type: decimal;
    margin-left: 1rem;
  }

  .wizard-indicator {
    height: 0.25rem;
  }
`

const SitesVerifyUrl = props => {
  const [copyValue, setCopyValue] = useState(`<meta name="epic-crawl-id" content="${props.vid}" />`)
  const [copied, setCopied] = useState(false)
  const [siteVerifyId, setSiteVerifyId] = useState(props.sid)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [disableSiteVerify, setDisableSiteVerify] = useState(false)
  const [enableNextStep, setEnableNextStep] = useState(false)
  const [openMobileSidebar, setOpenMobileSidebar] = useState(false)
  const [showNotificationStatus, setShowNotificationStatus] = useState(false)
  const pageTitle = 'Verify Site URL'

  const handleInputChange = ({ copyValue }) => {
    setCopyValue({ copyValue, copied })
  }

  const handleHiddenInputChange = (e) => {
    setSiteVerifyId({ value: e.currentTarget.site_verify_id.value })
  }

  const handleInputCopy = () => {
    setCopied(true)
  }

  const handleSiteVerification = async (e) => {
    e.preventDefault()

    if (errorMsg) setErrorMsg('')
    if (successMsg) setSuccessMsg('')

    const body = {
      sid: e.currentTarget.site_verify_id.value,
    }

    try {
      const response = await fetch('/api/site/' + body.sid + '/verify/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRFToken': Cookies.get('csrftoken'),
        },
        body: JSON.stringify(body),
      })

      const data = await response.json()
      
      if (response.ok && data.verified) {
        setSuccessMsg('You can now proceed to the site overview.')
        setTimeout(() => setShowNotificationStatus(true), 1500)
        setDisableSiteVerify(!disableSiteVerify)
        setTimeout(() => setEnableNextStep(!enableNextStep), 1500)
      } else if (response.ok && !data.verified) {
        setErrorMsg('Site verification failed. You have not verify the site yet.')
        setTimeout(() => setShowNotificationStatus(true), 1500)
      } else {
        throw new Error(await response.text());
      }
    } catch (error) {
      setErrorMsg('Internal server error. Please try again.')
      setTimeout(() => setShowNotificationStatus(true), 1500)
    }
  }

  useEffect(() => {
    if (showNotificationStatus === true)
    setTimeout(() => setShowNotificationStatus(false), 7500)
  }, [showNotificationStatus])

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

          <SitesVerifyUrlDiv
            className={`h-screen flex overflow-hidden bg-gray-100`}
          >
            <MobileSidebar show={openMobileSidebar} />
            <MainSidebar />

            <Transition show={showNotificationStatus}>
              <div
                className={`fixed z-50 inset-0 flex items-end justify-center px-4 py-6 pointer-events-none sm:p-6 sm:items-start sm:justify-end`}
              >
                <Transition
                  enter="transform ease-out duration-300 transition"
                  enterFrom="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-2"
                  enterTo="translate-y-0 opacity-100 sm:translate-x-0"
                  leave="transition ease-in duration-100"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div
                    className={`max-w-sm w-full bg-white shadow-lg rounded-lg pointer-events-auto`}
                  >
                    <div className={`rounded-lg shadow-xs overflow-hidden`}>
                      <div className={`p-4`}>
                        <div className={`flex items-start`}>
                          <div className={`flex-shrink-0`}>
                            {errorMsg ? (
                              <svg
                                className={`h-8 w-8 text-red-400`}
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                  clipRule="evenodd"
                                ></path>
                              </svg>
                            ) : successMsg ? (
                              <svg
                                className={`h-8 w-8 text-green-400`}
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                ></path>
                              </svg>
                            ) : (
                              <svg
                                className={`h-8 w-8 text-gray-400`}
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                                  clipRule="evenodd"
                                ></path>
                              </svg>
                            )}
                          </div>
                          <div className={`ml-3 w-0 flex-1 pt-0.5`}>
                            <p
                              className={`text-sm leading-5 font-medium ${
                                errorMsg !== undefined && errorMsg !== ""
                                  ? "text-red-500"
                                  : "text-gray-900"
                              } ${
                                successMsg !== undefined && successMsg !== ""
                                  ? "text-green-500"
                                  : "text-gray-900"
                              }`}
                            >
                              {errorMsg !== undefined && errorMsg !== ""
                                ? "Site Verification Failed!"
                                : successMsg !== undefined && successMsg !== ""
                                ? "Site Verification Success!"
                                : "Verifying..."}
                            </p>
                            <p className={`mt-1 text-sm leading-5 text-gray-500`}>
                              {errorMsg !== undefined && errorMsg !== ""
                                ? errorMsg
                                : successMsg}
                            </p>
                          </div>
                          <div className={`ml-4 flex-shrink-0 flex`}>
                            <button
                              className={`inline-flex text-gray-400 focus:outline-none focus:text-gray-500 transition ease-in-out duration-150`}
                              onClick={() =>
                                setTimeout(
                                  () =>
                                    setShowNotificationStatus(
                                      !showNotificationStatus
                                    ),
                                  150
                                )
                              }
                            >
                              <svg
                                className={`h-5 w-5`}
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Transition>
              </div>
            </Transition>

            <div className={`flex flex-col w-0 flex-1 overflow-hidden`}>
              <div className={`md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3`}>
                <button
                  className={`-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:bg-gray-200 transition ease-in-out duration-150`}
                  aria-label={`Open sidebar`}
                  onClick={() =>
                    setTimeout(() => setOpenMobileSidebar(!openMobileSidebar), 150)
                  }
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
                <div
                  className={`max-w-full mx-auto px-4 md:py-4 sm:px-6 md:px-8 grid gap-16 lg:grid-cols-3 lg:col-gap-5 lg:row-gap-12`}
                >
                  <div
                    className={`lg:col-span-2 bg-white overflow-hidden shadow-xs rounded-lg`}
                  >
                    <div className={`px-8 pt-4 sm:px-8 sm:pt-8`}>
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
                          className={`max-w-2xl mt-4 text-sm leading-2 font-medium text-green-500`}
                        >
                          <span
                            className={`max-w-xs inline-flex items-center justify-between`}
                          >
                            <svg
                              className={`w-5`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                            &nbsp; Fill in site information
                          </span>
                        </p>
                      </div>
                      <div className={`wizard-indicator bg-green-500`}>
                        <p
                          className={`${
                            enableNextStep ? "text-green-500" : "text-black-400"
                          } font-medium  max-w-2xl mt-4 text-sm leading-2`}
                        >
                          <span
                            className={`max-w-xs inline-flex items-center justify-between`}
                          >
                            {enableNextStep ? (
                              <svg
                                className={`w-5`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                ></path>
                              </svg>
                            ) : (
                              "2."
                            )}
                            &nbsp;Verify Site
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className={`max-w-full block px-8 pt-8 pb-12 sm:px-8`}>
                      <div className={`max-w-full py-4 m-auto`}>
                        <div>
                          <h4
                            className={`text-lg leading-7 font-medium text-gray-900`}
                          >
                            Verify Site:{" "}
                            <a
                              href={props.surl}
                              target="_blank"
                              title={props.surl}
                              className={`break-all text-md leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150`}
                            >
                              {props.surl}
                            </a>
                          </h4>
                          <p
                            className={`max-w-full text-sm mb-5 leading-5 text-gray-600`}
                          >
                            At the end of the day, going forward, a new normal that
                            has evolved from generation X is on the runway heading
                            towards a streamlined cloud solution.
                          </p>
                          <p
                            className={`max-w-full text-md leading-6 text-gray-700 mb-3`}
                          >
                            Instructions:
                          </p>
                          <ol>
                            <li className={`text-sm leading-6 text-gray-600`}>
                              Sign in to your website.
                            </li>
                            <li className={`text-sm leading-6 text-gray-600`}>
                              Copy the meta tag below and add it within your
                              website's <strong>{`<HEAD>`}</strong> tag <br />
                              <div>
                                <div className={`my-3 flex`}>
                                  <div
                                    className={`rounded-md shadow-xs-sm max-w-sm relative flex-grow focus-within:z-10`}
                                  >
                                    <input
                                      id="email"
                                      className={`form-input block w-full rounded-none rounded-l-md transition ease-in-out duration-150 sm:text-sm sm:leading-5`}
                                      name={`verify_id_meta_tag`}
                                      value={copyValue}
                                      onChange={handleInputChange}
                                      autoComplete={`off`}
                                    />
                                  </div>
                                  <CopyToClipboard
                                    onCopy={handleInputCopy}
                                    text={copyValue}
                                  >
                                    <button
                                      className={`-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-r-md text-gray-700 bg-gray-100 hover:text-gray-500 hover:bg-white focus:outline-none focus:shadow-xs-outline-blue focus:border-blue-300 active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150`}
                                    >
                                      <span>
                                        {copied ? "Copied!" : "Copy to clipboard"}
                                      </span>
                                    </button>
                                  </CopyToClipboard>
                                </div>
                              </div>
                            </li>
                            <li className={`text-sm leading-6 text-gray-600`}>
                              Press <strong>Verify Site</strong> button below
                            </li>
                          </ol>
                        </div>
                      </div>

                      <div className={`mt-5 sm:flex sm:justify-between`}>
                        <div className={`sm:flex sm:justify-start`}>
                          <form
                            onSubmit={handleSiteVerification}
                            className={`sm:flex sm:items-center`}
                          >
                            <input
                              type="hidden"
                              value={siteVerifyId}
                              name={`site_verify_id`}
                              onChange={handleHiddenInputChange}
                            />
                            <span className={`inline-flex rounded-md shadow-xs-sm`}>
                              {disableSiteVerify ? (
                                <button
                                  disabled={`disabled`}
                                  type={`submit`}
                                  className={`w-full mt-3 mr-3 rounded-md shadow-xs sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 opacity-50 cursor-not-allowed`}
                                >
                                  Verify Site
                                </button>
                              ) : (
                                <button
                                  type={`submit`}
                                  className={`w-full mt-3 mr-3 rounded-md shadow-xs sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:shadow-xs-outline-indigo focus:border-indigo-700 active:bg-indigo-700`}
                                >
                                  Verify Site
                                </button>
                              )}
                            </span>

                            <span className={`inline-flex rounded-md shadow-xs-sm`}>
                              {disableSiteVerify ? (
                                <Link
                                  href={{
                                    pathname: "/dashboard/sites/information",
                                    query: {
                                      sid: props.sid,
                                    },
                                  }}
                                >
                                  <a
                                    disabled={`disabled`}
                                    className={`inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-sm leading-5 font-medium text-gray-700 shadow-xs-sm sm:text-sm sm:leading-5 opacity-50 cursor-not-allowed`}
                                  >
                                    Update Site Information
                                  </a>
                                </Link>
                              ) : (
                                <Link
                                  href={{
                                    pathname: "/dashboard/sites/information",
                                    query: {
                                      sid: props.sid,
                                    },
                                  }}
                                >
                                  <a
                                    className={`inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-sm leading-5 font-medium text-gray-700 shadow-xs-sm transition ease-in-out duration-150 sm:text-sm sm:leading-5 hover:text-gray-500 focus:outline-none`}
                                  >
                                    Update Site Information
                                  </a>
                                </Link>
                              )}
                            </span>
                          </form>
                        </div>

                        {enableNextStep ? (
                          <Fragment>
                            <div>
                              <Link
                                href="/dashboard/site/[id]/overview"
                                as={`/dashboard/site/${props.sid}/overview`}
                              >
                                <a
                                  className={`mt-3 mr-3 rounded-md shadow-xs sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600 hover:bg-green-500 focus:outline-none focus:shadow-xs-outline-green focus:border-green-700 active:bg-green-700`}
                                >
                                  Go to Site Overview
                                </a>
                              </Link>
                            </div>
                          </Fragment>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div
                    className={`lg:col-span-1 bg-white overflow-hidden shadow-xs rounded-lg`}
                  >
                    <HowToSetup />
                  </div>
                </div>
              </main>
            </div>
          </SitesVerifyUrlDiv>
        </Fragment>
      ) : null}
    </Layout>
  );
}

SitesVerifyUrl.getInitialProps = ({ query }) => {
  return {
    sid: query.sid,
    sname: query.sname,
    surl: query.surl,
    vid: query.vid,
    v: query.v,
  }
}

export default SitesVerifyUrl

SitesVerifyUrl.propTypes = {
  copyValue: PropTypes.string,
  copied: PropTypes.bool,
  siteVerifyId: PropTypes.number,
  errorMsg: PropTypes.string,
  successMsg: PropTypes.string,
  dataQuery: PropTypes.object,
  disableSiteVerify: PropTypes.bool,
  enableNextStep: PropTypes.bool,
  pageTitle: PropTypes.string,
}