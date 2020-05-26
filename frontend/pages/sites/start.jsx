import React from 'react'
import Head from 'next/head'
import styled from 'styled-components'
import MobileSidebar from '../../components/sidebar/mobile-sidebar'
import Sidebar from '../../components/sidebar/main-sidebar'

const SitesStartDiv = styled.section`
  .wizard-indicator {
    height: 0.25rem;
  }
`

const SitesStart = () => {
  const Fragment = React.Fragment

  return (
    <Fragment>
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
                  className={`max-w-3xl sm:px-8 sm:pt-6 sm:pb-8 grid gap-16 pt-12 lg:grid-cols-3 lg:col-gap-5 lg:row-gap-12`}
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
                      2. Fill in site information
                    </p>
                  </div>
                  <div className={`wizard-indicator bg-gray-100`}>
                    <p
                      className={`max-w-2xl mt-4 text-sm leading-2 text-gray-400`}
                    >
                      3. Crawl the site
                    </p>
                  </div>
                </div>

                <div className={`px-4 pt-16 pb-12 sm:px-8`}>
                  <div className={`max-w-6xl py-4 m-auto`}>
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
                    <div
                      className={`mt-6 grid grid-cols-1 row-gap-6 col-gap-4 sm:grid-cols-6`}
                    >
                      <div className={`sm:col-span-3`}>
                        <label
                          for="company_name"
                          className={`block text-sm font-medium leading-5 text-gray-700`}
                        >
                          Site URL
                        </label>
                        <div className={`mt-1 rounded-md shadow-sm`}>
                          <input
                            id={`site_url`}
                            className={`form-input block w-full transition duration-150 ease-in-out sm:text-sm sm:leading-5`}
                            placeholder="https://yourdomain.com"
                            aria-describedby="site-url"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class={`mt-5 mx-auto sm:flex sm:justify-start`}>
                    <button
                      type={`button`}
                      class={`mt-3 mr-3 rounded-md shadow sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:shadow-outline-indigo focus:border-indigo-700 active:bg-indigo-700`}
                    >
                      Check URL
                    </button>
                    <button
                      type={`button`}
                      class={`mt-3 mr-3 rounded-md shadow sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-700 active:bg-blue-700`}
                    >
                      Proceed to Step 2
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </SitesStartDiv>
    </Fragment>
  );
}

export default SitesStart
