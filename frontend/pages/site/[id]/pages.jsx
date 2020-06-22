import { Fragment, Suspense } from 'react'
import Cookies from 'js-cookie'
import Head from 'next/head'
import styled from 'styled-components'
import useSWR from 'swr'
import PropTypes from 'prop-types'
import useUser from '../../../hooks/useUser'
import Layout from '../../../components/Layout'
import MobileSidebar from '../../../components/sidebar/mobile-sidebar'
import MainSidebar from '../../../components/sidebar/main-sidebar'

const PagesDiv = styled.section``

const Pages = () => {
  const { user } = useUser({ 
    redirectTo: '/login',
  })

  if (user === undefined || !user) {
    return <Layout>Loading...</Layout>
  }

  return (
    <Layout>
      <Head>
        <title>Sites</title>
      </Head>

      <Suspense fallback={<div>loading...</div>}>
        <PagesDiv className={`h-screen flex overflow-hidden bg-gray-100`}>
          <MobileSidebar />
          <MainSidebar />

          <div className={`flex flex-col w-0 flex-1 overflow-hidden`}>
            <div className={`md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3`}>
              <button
                className={`-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outilne-none focus:bg-gray-200 transition ease-in-out duration-150`}
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
                  All Pages
                </h1>
              </div>
              <div className={`max-w-6xl mx-auto px-4 sm:px-6 md:px-8`}>
                {/* <AddSite /> */}

                <div className={`pb-4`}>
                  <div className={`flex flex-col`}>
                    <div
                      className={`-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8`}
                    >
                      <div
                        className={`align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-gray-200`}
                      >
                        <table className={`min-w-full`}>
                          <thead>
                            <tr>
                              {DataTableHeadsContent.map((site, key) => {
                                return (
                                  <Fragment key={key}>
                                    <th
                                      className={`px-6 py-3 border-b border-gray-200 bg-white text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider`}
                                    >
                                      {site.label}
                                    </th>
                                  </Fragment>
                                )
                              })}
                              <th
                                className={`px-6 py-3 border-b border-gray-200 bg-white`}
                              ></th>
                            </tr>
                          </thead>
                          {/* {data.results.map((val, key) => (
                            <DataTable key={key} site={val} />
                          ))} */}
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                <Pagination />
              </div>
            </main>
          </div>
        </PagesDiv>
      </Suspense>
    </Layout>
  )
}

export default Pages

Pages.propTypes = {}