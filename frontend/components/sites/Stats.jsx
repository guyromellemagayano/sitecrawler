import { useEffect } from 'react'
import { useRouter } from 'next/router'
import fetch from 'node-fetch'
import Cookies from 'js-cookie'
import useSWR from 'swr'
import Link from 'next/link'
import styled from 'styled-components'
import Skeleton from 'react-loading-skeleton';
import Layout from 'components/Layout'

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

const SitesStatsDiv = styled.footer``

const SitesStats = props => {
  const { query } = useRouter()
  const {
    data: scan,
    error: scanError,
  } = useSWR(() => (query.siteId ? `/api/site/${query.siteId}/scan/` : null), fetcher, {
    refreshInterval: 1000,
  })

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

  const { data: stats, error: statsError } = useSWR(
    () =>
      query.siteId && scanObjId
        ? `/api/site/${query.siteId}/scan/${scanObjId}/`
        : null,
    fetcher, {
      refreshInterval: 1000,
    }
  )

  useEffect(() => {
    if(stats && stats.finished_at)
      props.crawlableHandler(true)
    else if(stats && stats.started_at && stats.finished_at == null)
      props.crawlableHandler(false)
  }, [stats])

  {statsError && <Layout>{statsError.message}</Layout>}
  {scanError && <Layout>{scanError.message}</Layout>}

  if (!stats) {
    return (
      <SitesStatsDiv>
        <div>
          <div className={`mt-2 grid grid-cols-1 gap-5 sm:grid-cols-6 sm:gap-64`}>
            <Skeleton duration={2} width={280} height={160} />
            <Skeleton duration={2} width={280} height={160} />
          </div>
        </div>
      </SitesStatsDiv>
    )
  }

  const PageTabs = [
    {
      "title": "Total Pages",
      "count": stats.num_pages,
      "href": `/dashboard/site/[siteId]/pages`,
      "as": `/dashboard/site/${query.siteId}/pages`
    },
    {
      "title": "Total Links",
      "count": stats.num_links,
      "href": `/dashboard/site/[siteId]/links`,
      "as": `/dashboard/site/${query.siteId}/links`
    },
    {
      "title": "Link Issues",
      "count": stats.num_non_ok_links,
      "href": `/dashboard/site/[siteId]/links?status=TIMEOUT&status=HTTP_ERROR&status=OTHER_ERROR`,
      "as": `/dashboard/site/${query.siteId}/links?status=TIMEOUT&status=HTTP_ERROR&status=OTHER_ERROR`
    },
    {
      "title": "Total Pages Without Title",
      "count": stats.num_pages_without_title,
      "href": `/dashboard/site/[siteId]/seo?has_title=false`,
      "as": `/dashboard/site/${query.siteId}/seo?has_title=false`
    },
    {
      "title": "Total Pages Without Description",
      "count": stats.num_pages_without_description,
      "href": `/dashboard/site/[siteId]/seo?has_description=false`,
      "as": `/dashboard/site/${query.siteId}/seo?has_description=false`
    },
    {
      "title": "Total Pages Without First H1",
      "count": stats.num_pages_without_h1_first,
      "href": `/dashboard/site/[siteId]/seo?has_h1_first=false`,
      "as": `/dashboard/site/${query.siteId}/seo?has_h1_first=false`
    },
    {
      "title": "Total Pages Without Second H1",
      "count": stats.num_pages_without_h1_second,
      "href": `/dashboard/site/[siteId]/seo?has_h1_second=false`,
      "as": `/dashboard/site/${query.siteId}/seo?has_h1_second=false`
    },
    {
      "title": "Total Pages Without First H2",
      "count": stats.num_pages_without_h2_first,
      "href": `/dashboard/site/[siteId]/seo?has_h2_first=false`,
      "as": `/dashboard/site/${query.siteId}/seo?has_h2_first=false`
    },
    {
      "title": "Total Pages Without Second H2",
      "count": stats.num_pages_without_h2_second,
      "href": `/dashboard/site/[siteId]/seo?has_h2_second=false`,
      "as": `/dashboard/site/${query.siteId}/seo?has_h2_second=false`
    },
    {
      "title": "Total Images",
      "count": stats.num_images,
      "href": `/dashboard/site/[siteId]/images`,
      "as": `/dashboard/site/${query.siteId}/images`
    },
    {
      "title": "Total Images Working",
      "count": stats.num_ok_images,
      "href": `#`,
      "as": `#`
    },
    {
      "title": "Total Images Not Working",
      "count": stats.num_non_ok_images,
      "href": `#`,
      "as": `#`
    }
  ]

  return (
    <SitesStatsDiv>
      <div>
        <div className={`mt-2 grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-18`}>
          {PageTabs.map((val, key) => {
            return (
              <div 
                key={key}
                className={`bg-white overflow-hidden shadow-xs rounded-lg`}
              >
                <div className={`px-4 py-5 sm:p-6`}>
                  <dl>
                    <dt
                      className={`text-sm leading-5 font-medium text-gray-500 truncate`}
                    >
                      {val.title}
                    </dt>
                    <dd
                      className={`mt-1 text-3xl leading-9 font-semibold text-gray-900`}
                    >
                      {val.count}
                    </dd>
                  </dl>
                </div>
                <div className={`bg-gray-100 px-4 py-4 sm:px-6`}>
                  <div className={`text-sm leading-5`}>
                    <Link href={val.href} as={val.as} >
                      <a className={`font-medium text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150`}>
                        View all
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </SitesStatsDiv>
  )
}

export default SitesStats
