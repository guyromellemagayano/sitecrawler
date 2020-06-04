import { Fragment, useCallback, useEffect, useState } from 'react'
import Router from 'next/router'
import Head from 'next/head'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import useUser from '../../hooks/useUser'
import Layout from '../../components/layout'
import MobileSidebar from '../../components/sidebar/mobile-sidebar'
import Sidebar from '../../components/sidebar/main-sidebar'
import Link from 'next/link'

const SitesCrawlSiteDiv = styled.section`
  .wizard-indicator {
    height: 0.25rem;
  }
`

const SitesCrawlSite = props => {
  const [disableSiteVerify, setDisableSiteVerify] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [dataQuery, setDataQuery] = useState([])
  const [enableNextStep, setEnableNextStep] = useState(false)

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault()

    if (errorMsg) setErrorMsg('')
    if (successMsg) setSuccessMsg('')

    try {
      // API data fetch start
      // API data fetch end

      setDataQuery(props)
      setSuccessMsg('Site crawling successful. Go check the site overview.')
      setDisableSiteVerify(!disableSiteVerify)
      setEnableNextStep(!enableNextStep)
    } catch (error) {
      setErrorMsg('An unexpected error occurred. Please try again.')

      throw error
    }
  })

  useEffect(() => {
    Router.prefetch('/site/' + dataQuery.sid)
  }, [dataQuery])

  const { user } = useUser({ redirectTo: '/login' });

  if (user === undefined || !user) {
    return <Layout>Loading...</Layout>
  }

  return (
    <Layout>
      <Head>
        <title>Information</title>
      </Head>

      <SitesCrawlSiteDiv
        className={`h-screen flex overflow-hidden bg-gray-100`}
      >
        {/* Mobile Sidebar */}
        <MobileSidebar />

        {/* Sidebar */}
        <Sidebar />

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
              <div className={`bg-white overflow-hidden shadow rounded-lg`}>
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
                      className={`max-w-2xl mt-4 text-sm leading-2 text-gray-400`}
                    >
                      1. Register a new URL
                    </p>
                  </div>
                  <div className={`wizard-indicator bg-green-500`}>
                    <p
                      className={`max-w-2xl mt-4 text-sm leading-2 text-gray-400`}
                    >
                      2. Verify the added URL
                    </p>
                  </div>
                  <div className={`wizard-indicator bg-green-500`}>
                    <p
                      className={`max-w-2xl mt-4 text-sm leading-2 text-gray-400`}
                    >
                      3. Fill in site information
                    </p>
                  </div>
                  <div className={`wizard-indicator bg-green-500`}>
                    <p
                      className={`max-w-2xl mt-4 text-sm leading-2 text-black-600`}
                    >
                      4. Crawl the site
                    </p>
                  </div>
                </div>

                <div className={`px-4 pt-8 pb-12 sm:px-8`}>
                  <div className={`max-w-6xl py-4 m-auto`}>
                    <div>
                      <h4
                        className={`text-lg leading-7 font-medium text-gray-900`}
                      >
                        Crawl the site
                      </h4>
                      <p
                        className={`mt-1 text-sm leading-5 text-gray-500 max-w-6xl`}
                      >
                        Capitalize on low hanging fruit to identify a ballpark
                        value added activity to beta test.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div
                      className={`mt-5 sm:flex sm:items-center sm:justify-between`}
                    >
                      <div>
                        {disableSiteVerify ? (
                          <button
                            disabled={`disabled`}
                            type={`submit`}
                            className={`mt-3 mr-3 rounded-md shadow sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 opacity-100 cursor-not-allowed`}
                          >
                            Start Crawl
                          </button>
                        ) : (
                          <button
                            type={`submit`}
                            className={`mt-3 mr-3 rounded-md shadow sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:shadow-outline-indigo focus:border-indigo-700 active:bg-indigo-700`}
                          >
                            Start Crawl
                          </button>
                        )}

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

                      {enableNextStep ? (
                        <div>
                          <Link href="/site/[id]" as={`/site/${dataQuery.sid}`}>
                            <a
                              type={`button`}
                              className={`mt-3 rounded-md shadow sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600 hover:bg-green-500 focus:outline-none focus:shadow-outline-green focus:border-green-700 active:bg-green-700`}
                            >
                              Go to Site Overview
                            </a>
                          </Link>
                        </div>
                      ) : null}
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </main>
        </div>
      </SitesCrawlSiteDiv>
    </Layout>
  )
}

SitesCrawlSite.getInitialProps = ({ query }) => {
  return {
    sid: query.sid,
    surl: query.surl,
    vid: query.vid,
    v: query.v,
    sname: query.sname,
  }
}

export default SitesCrawlSite

SitesCrawlSite.propTypes = {
  errorMsg: PropTypes.string,
  successMsg: PropTypes.string,
  handleSubmit: PropTypes.func,
}
