import { Suspense, Fragment, useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import fetch from 'node-fetch'
import useSWR from 'swr'
import Cookies from 'js-cookie'
import styled from 'styled-components'
import LinksPagesContent from '../../../../public/data/links-pages.json'
import Layout from '../../../../components/Layout'
import MobileSidebar from '../../../../components/sidebar/MobileSidebar'
import MainSidebar from '../../../../components/sidebar/MainSidebar'
import LinkOptions from '../../../../components/site/LinkOptions'
import LinkPagesTable from '../../../../components/site/LinkPagesTable'
import Pagination from '../../../../components/sites/Pagination'

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

const PagesDiv = styled.section``

const Pages = props => {
  const [openMobileSidebar, setOpenMobileSidebar] = useState(false)
  const pageTitle = 'Pages |'

  const { query } = useRouter()
  const pathname = `/dashboard/site/${query.id}/pages`
  const { data: scan, error: scanError } = useSWR(
    () => (query.id ? `/api/site/${query.id}/scan/` : null),
    fetcher, {
      refreshInterval: 1000,
    }
  )

  let scanObjId = ""

  if (scan) {
    let scanObj = []

    scan.results.map((val) => {
      scanObj.push(val)
      return scanObj
    })

    scanObj.map((val) => {
      scanObjId = val.id
      return scanObjId
    })
  }

  const scanApiEndpoint = props.page !== undefined ? `/api/site/${query.id}/scan/${scanObjId}/page/?page=` + props.page : `/api/site/${query.id}/scan/${scanObjId}/page/`

  const { data: page, error: pageError } = useSWR(
    () => query.id && scanObjId ? scanApiEndpoint : null, fetcher, {
      refreshInterval: 1000,
  })

  if (pageError) return <div>{pageError.message}</div>
  if (scanError) return <div>{scanError.message}</div>
  if (!page) return <div>Loading...</div>

  return (
    <Layout>
      <Head>
        <title>{pageTitle}</title>
      </Head>

      <Suspense fallback={<div>loading...</div>}>
        <PagesDiv className={`h-screen flex overflow-hidden bg-gray-100`}>
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
                <h1 className={`text-2xl font-semibold text-gray-900`}>All Pages</h1>
              </div>
              <div className={`max-w-6xl mx-auto px-4 sm:px-6 md:px-8`}>
                <LinkOptions />
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
                              {LinksPagesContent.map((site, key) => {
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
                            </tr>
                          </thead>
                          {page.results && page.results.map((val, key) => (
                            <LinkPagesTable key={key} val={val} />
                          ))}
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                <Pagination 
                  pathName={pathname}
                  apiEndpoint={scanApiEndpoint}
                  page={props.page ? props.page : 0}
                />
              </div>
            </main>
          </div>
        </PagesDiv>
      </Suspense>
    </Layout>
  )
}

Pages.getInitialProps = ({ query }) => {
  return {
    page: query.page,
  }
}

export default Pages