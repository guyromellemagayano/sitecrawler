import { useState } from 'react'
import fetch from 'node-fetch'
import Cookies from 'js-cookie'
import useSWR from 'swr'
import Link from 'next/link'
import styled from 'styled-components'
import PropTypes from 'prop-types'

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
  const [siteData, setSiteData] = useState([])

  const { data: stats, error: statsError } = useSWR(`/api/site/${props.stats.id}/scan/`, fetcher, { refreshInterval: 1000 })

  if (statsError) return <div>{statsError.message}</div>
  if (!stats) return <div>Loading...</div>

  const useSiteResults = async (e) => {
    return await Promise.all(e.results.map(async (val, key) => {
      try {
        const res = await fetch(`/api/site/${val.site_id}/scan/${val.id}/`, {
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

        return setSiteData(data)
      } catch(error) {
        console.error(error)
      }
    }))
  }

  useSiteResults(stats)

  return (
    <SitesStatsDiv>
      <div>
        <div className={`mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3`}>
          <div className={`bg-white overflow-hidden shadow rounded-lg`}>
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
                  {siteData.num_links}
                </dd>
              </dl>
            </div>
            <div className={`bg-gray-100 px-4 py-4 sm:px-6`}>
              <div className={`text-sm leading-5`}>
                <Link href={`${siteData.site_id}` + `/links`}>
                  <a className={`font-medium text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150`}>
                    View all
                  </a>
                </Link>
              </div>
            </div>
          </div>

          <div className={`bg-white overflow-hidden shadow rounded-lg`}>
            <div className={`px-4 py-5 sm:p-6`}>
              <dl>
                <dt
                  className={`text-sm leading-5 font-medium text-gray-500 truncate`}
                >
                  Working Links
                </dt>
                <dd
                  className={`mt-1 text-3xl leading-9 font-semibold text-gray-900`}
                >
                  {siteData.num_ok_links}
                </dd>
              </dl>
            </div>
            <div className={`bg-gray-100 px-4 py-4 sm:px-6`}>
              <div className={`text-sm leading-5`}>
                <Link href={`${siteData.site_id}` + `/links/working`}>
                  <a className={`font-medium text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150`}>
                    View all
                  </a>
                </Link>
              </div>
            </div>
          </div>

          <div className={`bg-white overflow-hidden shadow rounded-lg`}>
            <div className={`px-4 py-5 sm:p-6`}>
              <dl>
                <dt
                  className={`text-sm leading-5 font-medium text-gray-500 truncate`}
                >
                  Links with Issues
                </dt>
                <dd
                  className={`mt-1 text-3xl leading-9 font-semibold text-gray-900`}
                >
                  {siteData.num_non_ok_links}
                </dd>
              </dl>
            </div>
            <div className={`bg-gray-100 px-4 py-4 sm:px-6`}>
              <div className={`text-sm leading-5`}>
                <Link href={`${siteData.site_id}` + `/links/working`}>
                  <a className={`font-medium text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150`}>
                    View all
                  </a>
                </Link>
              </div>
            </div>
          </div>

          <div className={`bg-white overflow-hidden shadow rounded-lg`}>
            <div className={`px-4 py-5 sm:p-6`}>
              <dl>
                <dt
                  className={`text-sm leading-5 font-medium text-gray-500 truncate`}
                >
                  External Links
                </dt>
                <dd
                  className={`mt-1 text-3xl leading-9 font-semibold text-gray-900`}
                >
                  {siteData.num_external_links}
                </dd>
              </dl>
            </div>
            <div className={`bg-gray-100 px-4 py-4 sm:px-6`}>
              <div className={`text-sm leading-5`}>
                <Link href={`${siteData.site_id}` + `/links/external`}>
                  <a className={`font-medium text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150`}>
                    View all
                  </a>
                </Link>
              </div>
            </div>
          </div>

          <div className={`bg-white overflow-hidden shadow rounded-lg`}>
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
                  {siteData.num_pages}
                </dd>
              </dl>
            </div>
            <div className={`bg-gray-100 px-4 py-4 sm:px-6`}>
              <div className={`text-sm leading-5`}>
                <Link href={`${siteData.site_id}` + `/links/pages`}>
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
  );
}

export default SitesStats

SitesStats.propTypes = {}