import { Fragment, Suspense, useState } from 'react'
import Cookies from 'js-cookie'
import Head from 'next/head'
import styled from 'styled-components'
import useSWR from 'swr'
import Transition from '../../../hooks/Transition'
import DataTableHeadsContent from '../../../public/data/data-table-heads.json'
import Layout from '../../../components/Layout'
import MobileSidebar from '../../../components/sidebar/MobileSidebar'
import MainSidebar from '../../../components/sidebar/MainSidebar'
import AddSite from '../../../components/sites/AddSite'
import DataTable from '../../../components/sites/DataTable'
import Pagination from '../../../components/sites/Pagination'

const fetcher = async (url) => {
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-CSRFToken': Cookies.get('csrftoken'),
    },
  })

  const data = await res.json()

  if (res.status !== 200) {
    throw new Error(data.message)
  }

  return data
}

const SitesDiv = styled.section``

const Sites = () => {
  const [openMobileSidebar, setOpenMobileSidebar] = useState(false)
  const pageTitle = 'Sites'

  const { data: site, error: siteError } = useSWR('/api/site/', fetcher, { refreshInterval: 1000 })

  if (siteError) return <div>{siteError.message}</div>
  if (!site) return <div>Loading...</div>

  return (
    <Layout>
      <Head>
        <title>{pageTitle}</title>
      </Head>

      <Suspense fallback={<div>loading...</div>}>
        <SitesDiv className={`h-screen flex overflow-hidden bg-gray-100`}>
          <MobileSidebar show={openMobileSidebar} />
          <MainSidebar />

          <div className={`flex flex-col w-0 flex-1 overflow-hidden`}>
            <div className={`md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3`}>
              <button
                className={`-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:bg-gray-200 transition ease-in-out duration-150`}
                aria-label={`Open sidebar`}
                onClick={() => setOpenMobileSidebar(!openMobileSidebar)}
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
                  Sites
                </h1>
              </div>
              <div className={`max-w-6xl mx-auto px-4 sm:px-6 md:px-8`}>
                <AddSite />
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
                          <tbody className={`bg-white`}>
                            {site.results && site.results.map((val, key) => (
                              <DataTable key={key} site={val} />
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                <Pagination />
              </div>
            </main>
          </div>
        </SitesDiv>
      </Suspense>
    </Layout>
  )
}

export default Sites