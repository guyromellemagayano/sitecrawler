import { useRouter } from 'next/router'
import fetch from 'node-fetch'
import Cookies from 'js-cookie'
import useSWR from 'swr'
import Link from 'next/link'
import styled from 'styled-components'
import Skeleton from 'react-loading-skeleton';

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

const SitesStats = () => {
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

  return (
    <SitesStatsDiv>
      <div>
        <div className={`mt-2 grid grid-cols-1 gap-5 sm:grid-cols-3 sm:gap-18`}>
          <div className={`bg-white overflow-hidden shadow-xs rounded-lg`}>
            <div className={`px-4 py-5 sm:p-6`}>
              <dl>
                <dt
                  className={`text-sm leading-5 font-medium text-gray-500 truncate`}
                >
                  Total Pages
                </dt>
                <dd
                  className={`mt-1 text-3xl leading-9 font-semibold text-gray-900`}
                >
                  {stats.num_pages}
                </dd>
              </dl>
            </div>
            <div className={`bg-gray-100 px-4 py-4 sm:px-6`}>
              <div className={`text-sm leading-5`}>
                <Link href={'/dashboard/site/[siteId]/pages'} as={`/dashboard/site/${query.siteId}/pages`}>
                  <a className={`font-medium text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150`}>
                    View all
                  </a>
                </Link>
              </div>
            </div>
          </div>

          <div className={`bg-white overflow-hidden shadow-xs rounded-lg`}>
            <div className={`px-4 py-5 sm:p-6`}>
              <dl>
                <dt
                  className={`text-sm leading-5 font-medium text-gray-500 truncate`}
                >
                  Total Links
                </dt>
                <dd
                  className={`mt-1 text-3xl leading-9 font-semibold text-gray-900`}
                >
                  {stats.num_links}
                </dd>
              </dl>
            </div>
            <div className={`bg-gray-100 px-4 py-4 sm:px-6`}>
              <div className={`text-sm leading-5`}>
                <Link href="/dashboard/site/[siteId]/links" as={`/dashboard/site/${query.siteId}/links`} >
                  <a className={`font-medium text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150`}>
                    View all
                  </a>
                </Link>
              </div>
            </div>
          </div>

          <div className={`bg-white overflow-hidden shadow-xs rounded-lg`}>
            <div className={`px-4 py-5 sm:p-6`}>
              <dl>
                <dt
                  className={`text-sm leading-5 font-medium text-gray-500 truncate`}
                >
                  Link Issues
                </dt>
                <dd
                  className={`mt-1 text-3xl leading-9 font-semibold text-gray-900`}
                >
                  {stats.num_non_ok_links}
                </dd>
              </dl>
            </div>
            <div className={`bg-gray-100 px-4 py-4 sm:px-6`}>
              <div className={`text-sm leading-5`}>
                <Link href="/dashboard/site/[siteId]/links?status=TIMEOUT&status=HTTP_ERROR&status=OTHER_ERROR" as={`/dashboard/site/${query.siteId}/links?status=TIMEOUT&status=HTTP_ERROR&status=OTHER_ERROR`} >
                  <a className={`font-medium text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150`}>
                    View all
                  </a>
                </Link>
              </div>
            </div>
          </div>

          <div className={`bg-white overflow-hidden shadow-xs rounded-lg`}>
            <div className={`px-4 py-5 sm:p-6`}>
              <dl>
                <dt
                  className={`text-sm leading-5 font-medium text-gray-500 truncate`}
                >
                  Total Pages Without Title
                </dt>
                <dd
                  className={`mt-1 text-3xl leading-9 font-semibold text-gray-900`}
                >
                  {stats.num_pages_without_title}
                </dd>
              </dl>
            </div>
            <div className={`bg-gray-100 px-4 py-4 sm:px-6`}>
              <div className={`text-sm leading-5`}>
                <Link href="#" as={`#`} >
                  <a className={`font-medium text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150`}>
                    View all
                  </a>
                </Link>
              </div>
            </div>
          </div>

          <div className={`bg-white overflow-hidden shadow-xs rounded-lg`}>
            <div className={`px-4 py-5 sm:p-6`}>
              <dl>
                <dt
                  className={`text-sm leading-5 font-medium text-gray-500 truncate`}
                >
                  Total Pages Without Description
                </dt>
                <dd
                  className={`mt-1 text-3xl leading-9 font-semibold text-gray-900`}
                >
                  {stats.num_pages_without_description}
                </dd>
              </dl>
            </div>
            <div className={`bg-gray-100 px-4 py-4 sm:px-6`}>
              <div className={`text-sm leading-5`}>
                <Link href="#" as={`#`} >
                  <a className={`font-medium text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150`}>
                    View all
                  </a>
                </Link>
              </div>
            </div>
          </div>

          <div className={`bg-white overflow-hidden shadow-xs rounded-lg`}>
            <div className={`px-4 py-5 sm:p-6`}>
              <dl>
                <dt
                  className={`text-sm leading-5 font-medium text-gray-500 truncate`}
                >
                  Total Pages Without First H1
                </dt>
                <dd
                  className={`mt-1 text-3xl leading-9 font-semibold text-gray-900`}
                >
                  {stats.num_pages_without_h1_first}
                </dd>
              </dl>
            </div>
            <div className={`bg-gray-100 px-4 py-4 sm:px-6`}>
              <div className={`text-sm leading-5`}>
                <Link href="#" as={`#`} >
                  <a className={`font-medium text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150`}>
                    View all
                  </a>
                </Link>
              </div>
            </div>
          </div>

          <div className={`bg-white overflow-hidden shadow-xs rounded-lg`}>
            <div className={`px-4 py-5 sm:p-6`}>
              <dl>
                <dt
                  className={`text-sm leading-5 font-medium text-gray-500 truncate`}
                >
                  Total Pages Without Second H1
                </dt>
                <dd
                  className={`mt-1 text-3xl leading-9 font-semibold text-gray-900`}
                >
                  {stats.num_pages_without_h1_second}
                </dd>
              </dl>
            </div>
            <div className={`bg-gray-100 px-4 py-4 sm:px-6`}>
              <div className={`text-sm leading-5`}>
                <Link href="#" as={`#`} >
                  <a className={`font-medium text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150`}>
                    View all
                  </a>
                </Link>
              </div>
            </div>
          </div>

          <div className={`bg-white overflow-hidden shadow-xs rounded-lg`}>
            <div className={`px-4 py-5 sm:p-6`}>
              <dl>
                <dt
                  className={`text-sm leading-5 font-medium text-gray-500 truncate`}
                >
                  Total Pages Without First H2
                </dt>
                <dd
                  className={`mt-1 text-3xl leading-9 font-semibold text-gray-900`}
                >
                  {stats.num_pages_without_h2_first}
                </dd>
              </dl>
            </div>
            <div className={`bg-gray-100 px-4 py-4 sm:px-6`}>
              <div className={`text-sm leading-5`}>
                <Link href="#" as={`#`} >
                  <a className={`font-medium text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150`}>
                    View all
                  </a>
                </Link>
              </div>
            </div>
          </div>

          <div className={`bg-white overflow-hidden shadow-xs rounded-lg`}>
            <div className={`px-4 py-5 sm:p-6`}>
              <dl>
                <dt
                  className={`text-sm leading-5 font-medium text-gray-500 truncate`}
                >
                  Total Pages Without Second H2
                </dt>
                <dd
                  className={`mt-1 text-3xl leading-9 font-semibold text-gray-900`}
                >
                  {stats.num_pages_without_h2_second}
                </dd>
              </dl>
            </div>
            <div className={`bg-gray-100 px-4 py-4 sm:px-6`}>
              <div className={`text-sm leading-5`}>
                <Link href="#" as={`#`} >
                  <a className={`font-medium text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150`}>
                    View all
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SitesStatsDiv>
  )
}

export default SitesStats
