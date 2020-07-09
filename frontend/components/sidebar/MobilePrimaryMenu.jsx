import { Fragment } from 'react'
import { useRouter } from 'next/router'
import fetch from 'node-fetch'
import useSWR from 'swr'
import Cookies from 'js-cookie'
import Link from 'next/link'
import styled from 'styled-components'
import DashboardPages from '../../public/data/dashboard-pages.json'

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

const PrimaryMenuDiv = styled.nav``

const PrimaryMenu = () => {
  const {
    data: site,
    error: siteError,
  } = useSWR('/api/site/', fetcher)

  if (siteError) return <div>{siteError.message}</div>
  if (!site) return <div>Loading...</div>

  return (
    <PrimaryMenuDiv className={`mt-5 flex-1 px-2 bg-white`}>
      {
        DashboardPages.map((val, key) => {
          return (
            <Fragment key={key}>
              <Link href={val.url}>
                <a
                  className={`${useRouter().pathname.indexOf(val.url) == 0 ? "group mt-1 flex items-center px-2 py-2 text-sm leading-5 font-medium text-gray-900 rounded-md bg-gray-100 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:bg-gray-200 transition ease-in-out duration-150" : "mt-1 group flex items-center px-2 py-2 text-sm leading-5 font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition ease-in-out duration-150"}`}
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
                  </svg>
                  <span>{val.title}</span>
                  {val.url === "/dashboard/sites" && (
                    <span className={`ml-auto inline-block px-3 text-xs leading-4 rounded-full bg-purple-100 text-purple-800 transition ease-in-out duration-150`}>
                      {site.count}
                    </span>
                  )}
                </a>
              </Link>
            </Fragment>
          )
        })
      }
    </PrimaryMenuDiv>
  );
}

export default PrimaryMenu