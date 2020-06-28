import { Fragment } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import fetch from 'node-fetch'
import useSWR from 'swr'
import Cookies from 'js-cookie'
import styled from 'styled-components'
import LinksPagesContent from '../../../../public/data/links-pages.json'
import Layout from '../../../components/Layout'
import MobileSidebar from '../../../components/sidebar/MobileSidebar'
import MainSidebar from '../../../components/sidebar/MainSidebar'
import FilterLinks from '../../../components/site/FilterLinks'
import LinksTable from '../../../components/site/LinksTable'

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

const LinksDiv = styled.section``

const Links = () => {
  const { query } = useRouter()
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

  const { data: page, error: pageError } = useSWR(
    () =>
      query.id && scanObjId
        ? `/api/site/${query.id}/scan/${scanObjId}/page/`
        : null,
    fetcher, {
      refreshInterval: 1000,
    }
  )

  let pageObjId = ""

  if (page) {
    let pageObj = []

    page.results.map((val) => {
      pageObj.push(val)
      return pageObj
    })

    pageObj.map((val) => {
      pageObjId = val.id
      return pageObjId
    })
  }

  const { data: link, error: linkError } = useSWR(
    () =>
      query.id && scanObjId
        ? `/api/site/${query.id}/scan/${scanObjId}/page/${pageObjId}/link/`
        : null,
    fetcher, {
      refreshInterval: 1000,
    }
  )

  if (linkError) return <div>{linkError.message}</div>
  if (pageError) return <div>{pageError.message}</div>
  if (scanError) return <div>{scanError.message}</div>
  if (!link) return <div>Loading...</div>

  return (
    <Layout>
      <Head>
        <title>All Links</title>
      </Head>

      <LinksDiv className={`h-screen flex overflow-hidden bg-gray-100`}>
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
              <h1 className={`text-2xl font-semibold text-gray-900`}>All Links</h1>
            </div>
            <div className={`max-w-6xl mx-auto px-4 sm:px-6 md:px-8`}>
              <FilterLinks />
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
                            <th
                              className={`px-6 py-3 border-b border-gray-200 bg-white`}
                            ></th>
                          </tr>
                        </thead>
                        {page.results && page.results.map((val, key) => (
                          <LinksTable key={key} val={val} />
                        ))}
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </LinksDiv>
    </Layout>
  )
}

export default Links