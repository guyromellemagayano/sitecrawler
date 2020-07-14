import { useState } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'
import fetch from 'node-fetch'
import useSWR from 'swr'
import Cookies from 'js-cookie'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Layout from '../../../../components/Layout'
import MobileSidebar from '../../../../components/sidebar/MobileSidebar'
import MainSidebar from '../../../../components/sidebar/MainSidebar'
import SitesOverview from '../../../../components/sites/Overview'
import SitesStats from '../../../../components/sites/Stats'

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

const SitesDashboardDiv = styled.section``

const SitesDashboard = () => {
  const [openMobileSidebar, setOpenMobileSidebar] = useState(false)
  const pageTitle = 'Overview |'

  const { query } = useRouter()
  const { data: site, error: siteError } = useSWR(
    () => query.id && `/api/site/${query.id}`,
    fetcher
  )

  if (siteError) return <div>{siteError.message}</div>
  if (!site) return <div>Loading...</div>

  return (
    <Layout>
      <Head>
        <title>{pageTitle} {site.name}</title>
      </Head>

      <SitesDashboardDiv
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
            <div className={`max-w-6xl mx-auto px-4 md:py-4 sm:px-6 md:px-8`}>
              <div>
                <nav className={`hidden sm:flex items-center text-sm leading-5`}>
                  <Link href={'/dashboard/site/' + query.id + '/overview'}>
                    <a className={`font-normal text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out`}>{site.name}</a>
                  </Link>
                </nav>
              </div>
              <div className={`mt-2 md:flex md:items-center md:justify-between`}>
                <div className={`flex-1 min-w-0`}>
                  <h2 className={`text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:leading-9 sm:truncate lg:overflow-visible`}>
                    Overview - {site.name}
                  </h2>
                </div>
              </div>
            </div>
            <div
              className={`max-w-6xl mx-auto px-4 py-4 sm:px-6 md:px-8`}
            >
              <div>
                <SitesOverview
                  url={site.url}
                  verified={site.verified}
                  finishedAt={site.updated_at}
                />
              </div>
            </div>
            <div className={`max-w-6xl mx-auto px-4 sm:px-6 md:px-8`}>
              <div className={`pb-4`}>
                <SitesStats />
              </div>
            </div>
          </main>
        </div>
      </SitesDashboardDiv>
    </Layout>
  )
}

export default SitesDashboard

SitesDashboard.propTypes = {
  openMobileSidebar: PropTypes.bool,
  pageTitle: PropTypes.string,
  query: PropTypes.elementType,
}