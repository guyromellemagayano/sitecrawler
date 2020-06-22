import { useState } from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import fetch from 'node-fetch'
import useSWR from 'swr'
import Cookies from 'js-cookie'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import useUser from '../../hooks/useUser'
import Layout from '../../components/layout'
import MobileSidebar from '../../components/sidebar/mobile-sidebar'
import MainSidebar from '../../components/sidebar/main-sidebar'
import SitesOverview from '../../components/sites/overview'
import SitesCrawlInfo from '../../components/sites/crawl-info'
import SitesStats from '../../components/sites/stats'
import DashboardFooter from '../../components/dashboard/footer'

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

const SitesDashboard = props => {
  const { user } = useUser({ 
    redirectTo: '/login',
  });
  
  const { query } = useRouter()
  const { data, error } = useSWR(
    () => query.id && `/api/site/${query.id}`,
    fetcher
  )

  if (error) return <div>{error.message}</div>
  if (!data) return <div>Loading...</div>

  if (user === undefined || !user) {
    return <Layout>Loading...</Layout>
  }

  return (
    <Layout>
      <Head>
        <title>Site Overview</title>
      </Head>

      <SitesDashboardDiv
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
              <h1 className={`text-2xl font-semibold text-gray-900`}>
                {data.name}
              </h1>
            </div>
            <div className={`max-w-6xl mx-auto px-4 sm:px-6 md:px-8 grid grid-cols-2 gap-5 sm:grid-cols-2`}>
              <div>
                <SitesOverview 
                  url={data.url}
                  verified={data.verified}
                  createdAt={data.created_at}
                />
              </div>
              <div>
                <SitesCrawlInfo 
                  url={data.url}
                  finishedAt={data.finished_at}
                />
              </div>
            </div>
            <div className={`max-w-6xl mx-auto px-4 sm:px-6 md:px-8`}>
              <div className={`pb-4`}>
                <SitesStats 
                  stats={data}
                />
              </div>

              <DashboardFooter />
            </div>
          </main>
        </div>
      </SitesDashboardDiv>
    </Layout>
  )
}

export default SitesDashboard

SitesDashboard.propTypes = {}