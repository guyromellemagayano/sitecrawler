import { Fragment } from 'react'
import { useRouter } from 'next/router'
import fetch from 'node-fetch'
import useSWR from 'swr'
import Cookies from 'js-cookie'
import Link from 'next/link'
import styled from 'styled-components'
import Skeleton from 'react-loading-skeleton';
import DashboardPages from 'public/data/dashboard-pages.json'

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
  if (!site) {
    return (
      <Fragment>
        <PrimaryMenuDiv className={`mt-5 flex-1 px-2 bg-white`}>
          {[...Array(3)].map((val, index) => {
            return (
              <a
                key={index}
                className={`group ml-1 mt-2 flex justify-start items-center`}
              >
                <Skeleton circle={true} duration={2} width={30} height={30} />
                <span className={`ml-3`}><Skeleton duration={2} width={150} /></span>
              </a>
            )
          })}
        </PrimaryMenuDiv>
      </Fragment>
    )
  }

  return (
    <PrimaryMenuDiv className={`mt-5 flex-1 px-2 bg-white`}>
      {
        DashboardPages.map((val, key) => {
          return (
            <Fragment key={key}>
              <h3 className={`${val.slug}-headline mt-8 px-3 text-xs leading-4 font-semibold text-gray-500 uppercase tracking-wider`}>
                {val.category}
              </h3>
              <div className={`my-3`} role="group" aria-labelledby={`${val.slug}-headline`}>
                {val.links.map((val2, key) => {
                  return (
                    <Link 
                      key={key} 
                      href={val2.url}
                    >
                      <a
                        className={`${useRouter().pathname.indexOf(val2.url) == 0 ? "group mt-1 flex items-center px-2 py-2 text-sm leading-5 font-medium text-gray-900 rounded-md bg-gray-100 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:bg-gray-200 transition ease-in-out duration-150" : "mt-1 group flex items-center px-2 py-2 text-sm leading-5 font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition ease-in-out duration-150"}`}
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
                            d={val2.icon}
                          />
                        </svg>
                        <span>{val2.title}</span>
                        {val2.url === "/dashboard/sites" && (
                          <span className={`ml-auto inline-block px-3 text-xs leading-4 rounded-full bg-purple-100 text-purple-800 transition ease-in-out duration-150`}>
                            {site.count}
                          </span>
                        )}
                      </a>
                    </Link>
                  )
                })}
              </div>
            </Fragment>
          )
        })
      }
    </PrimaryMenuDiv>
  );
}

export default PrimaryMenu