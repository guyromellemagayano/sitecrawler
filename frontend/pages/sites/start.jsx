import { useCallback, useEffect, useState } from 'react'
import fetch from 'node-fetch'
import Cookies from 'js-cookie'
import Router from 'next/router'
import Head from 'next/head'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import fetchJson from '../../hooks/fetchJson'
import useUser from '../../hooks/useUser'
import Layout from '../../components/layout'
import MobileSidebar from '../../components/sidebar/mobile-sidebar'
import Sidebar from '../../components/sidebar/main-sidebar'

const SitesStartDiv = styled.section`
  .wizard-indicator {
    height: 0.25rem;
  }
`

const SitesStart = () => {
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [siteUrl, setSiteUrl] = useState('')

  const handleSubmit = useCallback( async (e) => {
    e.preventDefault()

    if (errorMsg) setErrorMsg('')
    if (successMsg) setSuccessMsg('')

    const body = {
      url: siteUrl
    }

    try {
      await fetchJson('/api/site/', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'X-CSRFToken': Cookies.get('csrftoken'),
        },
        body: JSON.stringify(body),
      }).then(res => {
        Router.push({
          pathname: '/sites/verify-url',
          query: { 
            sid: res.id,
            surl: res.url,
            vid: res.verification_id,
            v: false,
          },
        })
      })
    } catch(error) {
      console.error(error)
      setErrorMsg('An unexpected error occurred. Please try again.')
    }
  })

  useEffect(() => {
    Router.prefetch('/sites/verify-url')
  })

  const { user } = useUser({ redirectTo: '/login' });

  if (user === undefined || !user) {
    return <Layout>Loading...</Layout>
  }

  return (
    <Layout>
      <Head>
        <title>Start</title>
      </Head>

      <SitesStartDiv className={`h-screen flex overflow-hidden bg-gray-100`}>
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
            <div className={`max-w-7xl mx-auto px-4 md:py-4 sm:px-6 md:px-8`}>
              <div className={`bg-white overflow-hidden shadow rounded-lg`}>
                <div className={`px-4 pt-4 sm:px-8 sm:pt-8`}>
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
                  className={`max-w-full sm:px-8 sm:pt-6 sm:pb-8 grid gap-16 pt-12 lg:grid-cols-4 lg:col-gap-5 lg:row-gap-12`}
                >
                  <div className={`wizard-indicator bg-green-500`}>
                    <p
                      className={`max-w-2xl mt-4 text-sm leading-2 text-black-600`}
                    >
                      1. Register a new URL
                    </p>
                  </div>
                  <div className={`wizard-indicator bg-gray-100`}>
                    <p
                      className={`max-w-2xl mt-4 text-sm leading-2 text-gray-400`}
                    >
                      2. Verify the added URL
                    </p>
                  </div>
                  <div className={`wizard-indicator bg-gray-100`}>
                    <p
                      className={`max-w-2xl mt-4 text-sm leading-2 text-gray-400`}
                    >
                      3. Fill in site information
                    </p>
                  </div>
                  <div className={`wizard-indicator bg-gray-100`}>
                    <p
                      className={`max-w-2xl mt-4 text-sm leading-2 text-gray-400`}
                    >
                      4. Crawl the site
                    </p>
                  </div>
                </div>

                <div className={`px-4 pt-8 pb-12 sm:px-8`}>
                  <div className={`max-w-full py-4 m-auto`}>
                    <div>
                      <h4
                        className={`text-lg leading-7 font-medium text-gray-900`}
                      >
                        Register a new URL
                      </h4>
                      <p
                        className={`max-w-full text-sm leading-5 text-gray-500`}
                      >
                        At the end of the day, going forward, a new normal that
                        has evolved from generation X is on the runway heading
                        towards a streamlined cloud solution.
                      </p>
                    </div>
                    <div className={`mt-6`}>
                      <form onSubmit={handleSubmit}>
                        <label
                          htmlFor="company_name"
                          className={`block text-sm font-medium leading-5 text-gray-700`}
                        >
                          Site URL
                        </label>
                        <div className={`mt-1 max-w-sm rounded-md shadow-sm`}>
                          <input
                            id={`site_url`}
                            type={`url`}
                            name={`siteurl`}
                            required
                            className={`form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5`}
                            placeholder="https://yourdomain.com"
                            aria-describedby="site-url"
                            onChange={(e) => setSiteUrl(e.target.value)}
                          />
                        </div>

                        {errorMsg && (
                          <div className={`max-w-sm rounded-md bg-red-100 p-4 my-4`}>
                            <div className={`flex`}>
                              <div className={`flex-shrink-0`}>
                                <svg
                                  className={`h-5 w-5 text-red-400`}
                                  fill={`currentColor`}
                                  viewBox={`0 0 20 20`}
                                >
                                  <path
                                    fillRule={`evenodd`}
                                    d={`M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z`}
                                    clipRule={`evenodd`}
                                  />
                                </svg>
                              </div>
                              <div className={`ml-3`}>
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
                          <div className={`rounded-md bg-green-100 p-4 my-4`}>
                            <div className={`flex`}>
                              <div className={`flex-shrink-0`}>
                                <svg
                                  className={`h-5 w-5 text-green-400`}
                                  fill={`currentColor`}
                                  viewBox={`0 0 20 20`}
                                >
                                  <path
                                    fillRule={`evenodd`}
                                    d={`M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z`}
                                    clipRule={`evenodd`}
                                  />
                                </svg>
                              </div>
                              <div className={`ml-3`}>
                                <h3
                                  className={`text-sm leading-5 font-medium text-green-800 break-words`}
                                >
                                  {successMsg}
                                </h3>
                              </div>
                            </div>
                          </div>
                        )}

                        <div
                          className={`mt-5 mx-auto sm:flex sm:justify-start`}
                        >
                          <button
                            type={`submit`}
                            className={`mt-3 mr-3 rounded-md shadow sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600 hover:bg-green-500 focus:outline-none focus:shadow-outline-green focus:border-green-700 active:bg-green-700`}
                          >
                            Proceed to Step 2
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </SitesStartDiv>
    </Layout>
  );
}

export default SitesStart

SitesStart.propTypes = {
  errorMsg: PropTypes.string,
  successMsg: PropTypes.string,
  handleSubmit: PropTypes.func,
}