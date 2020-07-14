import { Fragment, useCallback, useEffect, useState } from 'react'
import Router from 'next/router'
import Head from 'next/head'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Link from 'next/link'
import Layout from '../../../components/Layout'
import MobileSidebar from '../../../components/sidebar/MobileSidebar'
import MainSidebar from '../../../components/sidebar/MainSidebar'

const PrepareSiteProfileDiv = styled.section`
  .wizard-indicator {
    height: 0.25rem;
  }
`

const PrepareSiteProfile = props => {
  const [dataQuery, setDataQuery] = useState([])
  const pageTitle = 'Prepare Site Profile'

  useEffect(() => {
    setDataQuery(props)
    Router.prefetch('/dashboard/site/' + dataQuery.sid + '/overview')
  }, [dataQuery])

  return (
    <Layout>
      <Head>
        <title>{pageTitle}</title>
      </Head>

      <PrepareSiteProfileDiv
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
                      className={`max-w-2xl mt-4 text-sm leading-2 text-gray-400`}
                    >
                      1. Fill in site information
                    </p>
                  </div>
                  <div className={`wizard-indicator bg-green-500`}>
                    <p
                      className={`max-w-2xl mt-4 text-sm leading-2 text-gray-400`}
                    >
                      2. Verify site
                    </p>
                  </div>
                  <div className={`wizard-indicator bg-green-500`}>
                    <p
                      className={`max-w-2xl mt-4 text-sm leading-2 font-medium text-black-400`}
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
                        Prepare the site profile
                      </h4>
                      <p
                        className={`mt-1 text-sm leading-5 text-gray-500 max-w-6xl`}
                      >
                        Capitalize on low hanging fruit to identify a ballpark
                        value added activity to beta test.
                      </p>
                    </div>
                  </div>

                  <div
                    className={`mt-5 sm:flex sm:items-center sm:justify-between`}
                  >
                    <div>
                      <Link href="/dashboard/site/[id]/overview" as={`/dashboard/site/${dataQuery.sid}/overview`}>
                        <a
                          type={`button`}
                          className={`mt-3 rounded-md shadow-xs sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium text-white bg-green-600 hover:bg-green-500 focus:outline-none focus:shadow-xs-outline-green focus:border-green-700 active:bg-green-700`}
                        >
                          Go to Site Overview
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </PrepareSiteProfileDiv>
    </Layout>
  )
}

PrepareSiteProfile.getInitialProps = ({ query }) => {
  return {
    sid: query.sid,
    sname: query.sname,
    surl: query.surl,
    vid: query.vid,
    v: query.v,
  }
}

export default PrepareSiteProfile

PrepareSiteProfile.propTypes = {
  dataQuery: PropTypes.object,
  pageTitle: PropTypes.string,
}