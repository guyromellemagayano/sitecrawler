import { useState, Fragment, useEffect } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'
import fetch from 'node-fetch'
import useSWR from 'swr'
import Cookies from 'js-cookie'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Skeleton from 'react-loading-skeleton'
import Moment from 'react-moment'
import useUser from 'hooks/useUser'
import Layout from 'components/Layout'
import MobileSidebar from 'components/sidebar/MobileSidebar'
import MainSidebar from 'components/sidebar/MainSidebar'
import SitesOverview from 'components/sites/Overview'
import SitesStats from 'components/sites/Stats'
import SitesSeoStats from 'components/sites/SeoStats'
import SitesPagesStats from 'components/sites/PagesStats'
import SitesLinksStats from 'components/sites/LinksStats'
import SitesImagesStats from 'components/sites/ImagesStats'

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
  const [recrawlable, setRecrawlable] = useState(false)
  const [crawlFinished, setCrawlFinished] = useState(false)
  const pageTitle = 'Overview |'

  const calendarStrings = {
    lastDay : '[Yesterday], dddd',
    sameDay : '[Today], dddd',
    lastWeek : 'MMMM DD, YYYY',
    sameElse : 'MMMM DD, YYYY'
  }

  const { user: user, userError: userError } = useUser({
    redirectTo: '/login',
    redirectIfFound: false
  })
  
  const { query } = useRouter()
  const { data: site, error: siteError } = useSWR(
    () => query.siteId && `/api/site/${query.siteId}`,
    fetcher
  )

  const { data: scan, error: scanError } = useSWR(
    () => query.siteId && `/api/site/${query.siteId}/scan/?ordering=-finished_at`,
    fetcher
  )

  const reCrawlEndpoint = `/api/site/${query.siteId}/start_scan/`

  const onCrawlHandler = async () => {
    setCrawlFinished(false)
    const res = await fetch(reCrawlEndpoint, {
      method: 'POST',
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

    // console.log('[onCrawlHandler]', data)
  
    return data
  }

  const crawlableHandler = (finished) => {
    if(finished)
      setCrawlFinished(true)

    if(user && user.permissions !== undefined && user.permissions[0] == 'can_start_scan' && site && site.verified && finished)
      setRecrawlable(true)
    else
      setRecrawlable(false)
  }

  useEffect(() => {
    if(user && user.permissions !== undefined && user.permissions[0] == 'can_start_scan' && site && site.verified)
      setRecrawlable(true)
    else
      setRecrawlable(false)
  }, [user, site])

  {userError && <Layout>{userError.message}</Layout>}
  {siteError && <Layout>{siteError.message}</Layout>}
  {scanError && <Layout>{scanError.message}</Layout>}

  return (
    <Layout>
      {user && scan && site ? (
        <Fragment>
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
                <div className={`max-w-full mx-auto px-4 md:py-4 sm:px-6 md:px-8`}>
                  <div className={`md:flex md:items-center md:justify-between`}>
                    <div className={`flex-1 min-w-0`}>
                      <h2 className={`text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:leading-9 sm:truncate lg:overflow-visible`}>
                        Overview
                      </h2>
                    </div>
                  </div>
                  <div>
                    <nav className={`mt-2 hidden sm:flex items-center text-sm leading-5`}>
                      <Link href='/dashboard/sites'>
                        <a className={`font-normal text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out`}>Sites</a>
                      </Link>
                      <svg className={`flex-shrink-0 mx-1 h-5 w-5 text-gray-500`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                      </svg>
                      <Link href='/dashboard/site/[siteId]/overview' as={'/dashboard/site/' + query.siteId + '/overview'}>
                        <a className={`font-medium text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out`}>{site.name}</a>
                      </Link>
                    </nav>
                  </div>
                </div>
                <div
                  className={`max-w-full px-4 py-4 sm:px-6 md:px-8`}
                >
                  <div className={`pb-4`}>
                    <SitesStats crawlableHandler={crawlableHandler} />
                  </div>
                  <div className={`grid grid-cols-2 gap-8 pb-10`}>
                    <SitesOverview
                      url={site.url}
                      verified={site.verified}
                      finishedAt={scan.results.map(e => { return e.finished_at }).sort().reverse()[0]}
                      onCrawl={onCrawlHandler}
                      crawlable={recrawlable}
                      crawlFinished={crawlFinished}
                    />
                    <SitesSeoStats
                      url={query}
                    />
                  </div>
                  <div className={`grid grid-cols-3 gap-8`}>
                    <SitesPagesStats
                      url={query}
                    />
                    <SitesLinksStats
                      url={query}
                    />
                    <SitesImagesStats
                      url={query}
                    />
                  </div>
                </div>
              </main>
            </div>
          </SitesDashboardDiv>
        </Fragment>
      ) : null}
    </Layout>
  )
}

export default SitesDashboard

SitesDashboard.propTypes = {
  openMobileSidebar: PropTypes.bool,
  pageTitle: PropTypes.string,
  query: PropTypes.elementType,
}