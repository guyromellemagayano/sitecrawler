import { Fragment } from 'react'
import { useRouter } from 'next/router'
import fetch from 'node-fetch'
import useSWR from 'swr'
import Cookies from 'js-cookie'
import Link from 'next/link'
import styled from 'styled-components'
import Skeleton from 'react-loading-skeleton';
import SitePages from 'public/data/site-pages.json'
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

const SiteMenuDiv = styled.nav`
  .back-nav {
    margin-bottom: 1rem;
  }
`

const SiteMenu = props => {
  const { query, asPath } = useRouter()
  const sitesApiEndpoint = props.page !== undefined ? '/api/site/?page=' + props.page : '/api/site/'

  const {
    data: scan,
    error: scanError,
  } = useSWR(() => (query.siteId ? `/api/site/${query.siteId}/scan/` : null), fetcher)

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
    fetcher
  )

  const { data: site, error: siteError } = useSWR(sitesApiEndpoint, fetcher, {
    refreshInterval: 1000,
  })
  
  return (
    <Fragment>
      {statsError && <Layout>{statsError.message}</Layout>}
      {scanError && <Layout>{scanError.message}</Layout>}
      {siteError && <Layout>{siteError.message}</Layout>}

      {!stats || !site ? (
        <SiteMenuDiv className={`mt-5 flex-1 px-2 bg-white`}>
          {[...Array(5)].map((val, index) => {
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
        </SiteMenuDiv>
      ) : (
        <SiteMenuDiv className={`flex-1 px-4 bg-gray-1000`}>
          <div className={`pt-3`}>
            <div className={`text-left py-4`}>
              <div className={`space-y-1`}>
                <div className={`relative`}>
                  <span className={`inline-block w-full rounded-md shadow-sm`}>
                    <button type="button" aria-haspopup="listbox" aria-expanded="true" aria-labelledby="listbox-label" className={`cursor-default relative w-full rounded-md border border-gray-300 bg-white pl-3 pr-10 py-2 text-left focus:outline-none focus:shadow-outline-blue focus:border-blue-300 transition ease-in-out duration-150 sm:text-sm sm:leading-5`}>
                      <div className={`flex items-center space-x-3`}>
                        {/* On: "bg-green-400", Off: "bg-gray-200" */}
                        <span aria-label="Online" className={`bg-green-400 flex-shrink-0 inline-block h-2 w-2 rounded-full`}></span>
                        <span className={`block truncate`}>
                          Tom Cook
                        </span>
                      </div>
                      <span className={`absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none`}>
                        <svg className={`h-5 w-5 text-gray-400`} viewBox="0 0 20 20" fill="none" stroke="currentColor">
                          <path d="M7 7l3-3 3 3m0 6l-3 3-3-3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </button>
                  </span>

                  {/* Select popover, show/hide based on select state. */}
                  <div className={`absolute mt-1 w-full rounded-md bg-white shadow-lg`}>
                    <ul tabIndex="-1" role="listbox" aria-labelledby="listbox-label" aria-activedescendant="listbox-item-3" className={`h-32 rounded-md py-1 text-base leading-6 shadow-xs overflow-auto focus:outline-none sm:text-sm sm:leading-5`}>
                      {site.results.map((val, key) => {
                        return (
                          <li key={key} id="listbox-item-0" role="option" className={`text-gray-900 cursor-default select-none relative py-2 pl-3 pr-9`}>
                            <div className={`flex items-center space-x-3`}>
                              <span aria-label="Online" className={`${val.verified ? "bg-green-400" : "bg-red-400"} flex-shrink-0 inline-block h-2 w-2 rounded-full`}></span>
                              <span className={`font-normal block truncate`}>
                                {val.name}
                              </span>
                            </div>
                          </li>
                        )
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {SitePages.map((val, key) => {
            return (
              <Fragment key={key}>
                {val.slug !== 'navigation' && val.slug !== 'dashboard' ? (
                  <Fragment>
                    <h3 className={`${val.slug}-headline mt-8 text-xs leading-4 font-semibold text-gray-300 uppercase tracking-wider`}>
                      {val.category}
                    </h3>
                    <div className={`my-3`} role="group" aria-labelledby={`${val.slug}-headline`}>
                      {val.links.map((val2, key) => {
                        const hrefVal = val2.url.indexOf('/dashboard/sites') > -1 ? val2.url : `/dashboard/site/[siteId]${val2.url}`
                        const asVal = val2.url.indexOf('/dashboard/sites') > -1 ? val2.url : '/dashboard/site/' + query.siteId + val2.url

                        return (
                          <Link key={key} href={hrefVal} as={asVal}>
                            <a
                              className={`${
                                asPath.includes("/dashboard/site/" + query.siteId + val2.url)  
                                  ? "group mt-1 flex items-center px-3 py-2 text-sm leading-5 font-medium text-gray-600 rounded-md bg-white hover:text-gray-600 hover:bg-white focus:outline-none focus:bg-gray-200 transition ease-in-out duration-150"
                                  : "mt-1 group flex items-center px-3 py-2 text-sm leading-5 font-medium text-gray-500 rounded-md hover:text-gray-600 hover:bg-white focus:outline-none focus:bg-white transition ease-in-out duration-150"
                              }`}
                            >
                              <svg
                                className={`mr-3 h-6 w-5 text-gray-500 group-hover:text-gray-500 group-focus:text-gray-500 transition ease-in-out duration-150`}
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
                                {val2.icon2 ? (
                                  <path
                                    strokeLinecap={`round`}
                                    strokeLinejoin={`round`}
                                    strokeWidth={`2`}
                                    d={val2.icon2}
                                  />
                                ) : null}
                              </svg>
                              <span>{val2.title}</span>
                              {val2.url === "/links" && (
                                <span className={`ml-auto inline-block px-3 text-xs leading-4 rounded-full bg-white text-black transition ease-in-out duration-150`}>
                                  {stats.num_links}
                                </span>
                              )}
                              {val2.url === "/pages" && (
                                <span className={`ml-auto inline-block px-3 text-xs leading-4 rounded-full bg-white text-black transition ease-in-out duration-150`}>
                                  {stats.num_pages}
                                </span>
                              )}
                              {val2.url === "/seo" && (
                                <span className={`ml-auto inline-block px-3 text-xs leading-4 rounded-full bg-white text-black transition ease-in-out duration-150`}>
                                  {stats.num_pages}
                                </span>
                              )}
                              {val2.url === "/images" && (
                                <span className={`ml-auto inline-block px-3 text-xs leading-4 rounded-full bg-white text-black transition ease-in-out duration-150`}>
                                  {stats.num_images}
                                </span>
                              )}
                              {val2.url === "/stylesheets" && (
                                <span className={`ml-auto inline-block px-3 text-xs leading-4 rounded-full bg-white text-black transition ease-in-out duration-150`}>
                                  {stats.num_stylesheets}
                                </span>
                              )}
                              {val2.url === "/scripts" && (
                                <span className={`ml-auto inline-block px-3 text-xs leading-4 rounded-full bg-white text-black transition ease-in-out duration-150`}>
                                  {stats.num_scripts}
                                </span>
                              )}
                            </a>
                          </Link>
                        )
                      })}
                    </div>
                  </Fragment>
                ) : (
                  <div className={`mt-1`} role="group" aria-labelledby={`${val.slug}-headline`}>
                    {val.links.map((val2, key) => {
                      const hrefVal = val2.url.indexOf('/dashboard/sites') > -1 ? val2.url : `/dashboard/site/[siteId]${val2.url}`
                      const asVal = val2.url.indexOf("/dashboard/sites") > -1 ? val2.url : "/dashboard/site/" + query.siteId + val2.url

                      return (
                        <Link
                          key={key}
                          href={hrefVal}
                          as={asVal}
                        >
                          <a
                            className={`${
                              asPath.includes("/dashboard/site/" + query.siteId + val2.url)  
                                ? "group mt-1 flex items-center px-3 py-2 text-sm leading-5 font-medium text-gray-600 rounded-md bg-white hover:text-gray-600 hover:bg-white focus:outline-none focus:bg-gray-200 transition ease-in-out duration-150"
                                : "back-nav mt-1 group flex items-center px-3 py-2 text-sm leading-5 font-medium text-gray-500 rounded-md hover:text-gray-600 hover:bg-white focus:outline-none focus:bg-white transition ease-in-out duration-150"
                            }`}
                          >
                            <svg
                              className={`mr-3 h-6 w-5 text-gray-500 group-hover:text-gray-500 group-focus:text-gray-500 transition ease-in-out duration-150`}
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
                              {val2.icon2 ? (
                                <path
                                  strokeLinecap={`round`}
                                  strokeLinejoin={`round`}
                                  strokeWidth={`2`}
                                  d={val2.icon2}
                                />
                              ) : null}
                            </svg>
                            <span>{val2.title}</span>
                            {val2.url === "/links" && (
                              <span className={`ml-auto inline-block px-3 text-xs leading-4 rounded-full bg-purple-100 text-purple-800 transition ease-in-out duration-150`}>
                                {stats.num_links}
                              </span>
                            )}
                            {val2.url === "/pages" && (
                              <span className={`ml-auto inline-block px-3 text-xs leading-4 rounded-full bg-purple-100 text-purple-800 transition ease-in-out duration-150`}>
                                {stats.num_pages}
                              </span>
                            )}
                          </a>
                        </Link> 
                      )
                    })}
                  </div>
                )}
              </Fragment>
            )
          })}
        </SiteMenuDiv>
      )}
    </Fragment>
  )
}

SiteMenu.getInitialProps = ({ query }) => {
  return {
    page: query.page,
  }
}

export default SiteMenu