import Head from 'next/head'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import Cookies from 'js-cookie'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import fetchJson from '../../hooks/fetchJson'
import useUser from '../../hooks/useUser'
import Layout from '../../components/layout'
import MobileSidebar from '../../components/sidebar/mobile-sidebar'
import MainSidebar from '../../components/sidebar/main-sidebar'
import SitesOverview from '../../components/sites/overview'
import SitesTimestamp from '../../components/sites/timestamp'
import SitesStats from '../../components/sites/stats'
import DashboardFooter from '../../components/dashboard/footer'

const fetcher = async (url) => {
  const res = await fetchJson({
    url: url,
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-CSRFToken': Cookies.get('csrftoken'),
    }
  })

  const site = await res.data.results

  if (Math.floor(res.status / 200) === 1) {
    return site
  }
}

const SitesDashboardDiv = styled.section``

const SitesDashboard = () => {
  const { query } = useRouter()
  const { data, error } = useSWR(
    () => query.id && `/api/site/${query.id}`,
    fetcher
  )

  if (error) return <div>{error.message}</div>
  if (!data) return <div>Loading...</div>

  return (
    <Layout>
      <Head>
        <title>Overview</title>
      </Head>

      <SitesDashboardDiv
        className={`h-screen flex overflow-hidden bg-gray-100`}
      >
        {/* Mobile Sidebar */}
        <MobileSidebar />

        {/* Sidebar */}
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
              <h1 className={`text-2xl font-semibold text-gray-900`}>
                Epic Design Labs
              </h1>
            </div>
            <div className={`max-w-6xl mx-auto px-4 sm:px-6 md:px-8`}>
              {/* Overview */}
              <div className={`grid grid-cols-2 gap-5 sm:grid-cols-3`}>
                <SitesOverview />
                <SitesTimestamp />
              </div>

              <div className={`pb-4`}>
                {/* Sections */}
                <SitesStats />
              </div>

              {/* Dashboard Footer */}
              <DashboardFooter />
            </div>
          </main>
        </div>
      </SitesDashboardDiv>
    </Layout>
  )
}

export default SitesDashboard