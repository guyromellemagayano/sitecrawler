import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import fetch from 'node-fetch'
import useSWR from 'swr'
import Cookies from 'js-cookie'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import SitePages from '../../config/site-pages.json'

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

const SiteMenuDiv = styled.nav`
  a:first-child {
    margin-bottom: 1rem;
  }
`

const SiteMenu = props => {
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

  console.log(siteData)

  return (
    <SiteMenuDiv className={`mt-5 flex-1 px-2 bg-white`}>
      {
        SitePages.map((val, key) => {
          return (
            <Link key={key} href={val.url.indexOf('/sites') > -1 ? val.url : '/site/' + useRouter().query.id + val.url}>
              <a
                className={`${'/site/' + useRouter().query.id + val.url === useRouter().asPath ? "group mt-1 flex items-center px-2 py-2 text-sm leading-5 font-medium text-gray-900 rounded-md bg-gray-100 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:bg-gray-200 transition ease-in-out duration-150" : "mt-1 group flex items-center px-2 py-2 text-sm leading-5 font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition ease-in-out duration-150"}`}
              >
                <svg
                  className={`mr-3 h-6 w-5 text-gray-400 group-hover:text-gray-500 group-focus:text-gray-500 transition ease-in-out duration-150`}
                  stroke={`currentColor`}
                  fill={`none`}
                  viewBox={`0 0 24 24`}
                >
                  <path
                    strokeLinecap={`round`}
                    strokeLinejoin={`round`}
                    strokeWidth={`2`}
                    d={val.icon}
                  />
                  {val.icon2 ? (
                    <path
                      strokeLinecap={`round`}
                      strokeLinejoin={`round`}
                      strokeWidth={`2`}
                      d={val.icon2}
                    />
                  ) : null}
                </svg>
                <span className={`truncate`}>
                  {val.title}
                </span>
                {val.slug === "all-pages" && siteData.num_pages > 0 ? (
                  <span className={`ml-auto inline-block py-0.5 px-3 text-xs leading-4 rounded-full text-gray-600 bg-gray-200 group-hover:bg-gray-200 group-focus:bg-gray-300 transition ease-in-out duration-150`}>
                    {siteData.num_pages}
                  </span>
                ) : val.slug === "all-links" && siteData.num_links > 0 ? (
                  <span className={`ml-auto inline-block py-0.5 px-3 text-xs leading-4 rounded-full text-gray-600 bg-gray-200 group-hover:bg-gray-200 group-focus:bg-gray-300 transition ease-in-out duration-150`}>
                    {siteData.num_links}
                  </span>
                ) : val.slug === "working-links" && siteData.num_ok_links > 0 ? (
                  <span className={`ml-auto inline-block py-0.5 px-3 text-xs leading-4 rounded-full text-gray-600 bg-gray-200 group-hover:bg-gray-200 group-focus:bg-gray-300 transition ease-in-out duration-150`}>
                    {siteData.num_ok_links}
                  </span> 
                ) : val.slug === "links-with-issues" && siteData.num_non_ok_links > 0 ? (
                  <span className={`ml-auto inline-block py-0.5 px-3 text-xs leading-4 rounded-full text-gray-600 bg-gray-200 group-hover:bg-gray-200 group-focus:bg-gray-300 transition ease-in-out duration-150`}>
                    {siteData.num_non_ok_links}
                  </span>
                ) : val.slug === "external-links" && siteData.num_external_links > 0 ? (
                  <span className={`ml-auto inline-block py-0.5 px-3 text-xs leading-4 rounded-full text-gray-600 bg-gray-200 group-hover:bg-gray-200 group-focus:bg-gray-300 transition ease-in-out duration-150`}>
                    {siteData.num_external_links}
                  </span>
                ) : null}
              </a>
            </Link>
          )
        })
      }
    </SiteMenuDiv>
  )
}

export default SiteMenu

SiteMenu.propTypes = {}