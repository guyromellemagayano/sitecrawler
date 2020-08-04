import { Fragment, useState } from 'react'
import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'
import fetch from 'node-fetch'
import useSWR from 'swr'
import Cookies from 'js-cookie'
import styled from 'styled-components'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import Moment from 'react-moment'
import Layout from 'components/Layout'
import MobileSidebar from 'components/sidebar/MobileSidebar'
import MainSidebar from 'components/sidebar/MainSidebar'
import SiteDangerBadge from 'components/badges/SiteDangerBadge'
import SiteSuccessBadge from 'components/badges/SiteSuccessBadge'
import SiteWarningBadge from 'components/badges/SiteWarningBadge'

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

const LinkDetailDiv = styled.div``

const LinkDetail = () => {
  const [openMobileSidebar, setOpenMobileSidebar] = useState(false)
  const [copyValue, setCopyValue] = useState(null)
  const [copied, setCopied] = useState(false)

  const calendarStrings = {
    lastDay: "[Yesterday], dddd",
    sameDay: "[Today], dddd",
    lastWeek: "MMMM DD, YYYY",
    sameElse: "MMMM DD, YYYY",
  }

  const handleUrlCopy = e => {
    setCopyValue(e)
    setCopied(true)
  }

  const { query } = useRouter()
  const userApiEndpoint = `/api/auth/user/`

  const { data: user, error: userError } = useSWR(userApiEndpoint, fetcher)

  const { data: site, error: siteError } = useSWR(
    () => (query.siteId ? `/api/site/${query.siteId}/` : null),
    fetcher
  )

  const { data: scan, error: scanError } = useSWR(
    () => (query.siteId ? `/api/site/${query.siteId}/scan/` : null),
    fetcher
  )

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

  const scanApiEndpoint = `/api/site/${query.siteId}/scan/${scanObjId}/link/`

  const { data: link, error: linkError } = useSWR(
    () => query.siteId && scanObjId ? scanApiEndpoint : null, fetcher
  )

  const linkLocationApiEndpoint = `/api/site/${query.siteId}/scan/${scanObjId}/link/${query.linkId}/`

  const { data: linkLocation, error: linkLocationError } = useSWR(
    () => query.siteId && scanObjId && query.linkId ? linkLocationApiEndpoint : null, fetcher
  )

  if (linkLocationError) return <div>{linkLocationError.message}</div>
  if (linkError) return <div>{linkError.message}</div>
  if (scanError) return <div>{scanError.message}</div>
  if (siteError) return <div>{siteError.message}</div>
  if (userError) return <div>{userError.message}</div>
  if (!linkLocation) return <div>Loading...</div>
  if (!link) return <div>Loading...</div>
  if (!site) return <div>Loading...</div>
  if (!user) return <div>Loading...</div>

  const pageTitle = `Links Detail | ${linkLocation.url}`

	return (
    <Layout>
      <Head>
        <title>{pageTitle}</title>
      </Head>

      <LinkDetailDiv className={`h-screen flex overflow-hidden bg-gray-100`}>
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
              <div>
                <nav className={`sm:hidden`}>
                  <Link href={'/dashboard/site/' + query.siteId + '/links'}>
                    <a className={`flex items-center text-sm leading-5 font-medium text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out`}>
                      <svg className={`flex-shrink-0 -ml-1 mr-1 h-5 w-5 text-gray-400`} viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                      Back to Links
                    </a>
                  </Link>
                </nav>
                <nav className={`hidden sm:flex items-center text-sm leading-5`}>
                  <Link href={'/dashboard/site/' + query.siteId + '/overview'}>
                    <a className={`font-normal text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out`}>{site.name}</a>
                  </Link>
                  <svg className={`flex-shrink-0 mx-2 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor`}>
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                  </svg>
                  <Link href={'/dashboard/site/' + query.siteId + '/links'}>
                    <a className={`font-medium text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out`}>All Links</a>
                  </Link>
                  <svg className={`flex-shrink-0 mx-2 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor`}>
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                  </svg>
                  <Link href={'/dashboard/site/' + query.siteId + '/link/' + query.linkId + '/detail'}>
                    <a className={`font-medium text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out`}>{linkLocation.url}</a>
                  </Link>
                </nav>
              </div>
              <div className={`mt-2 md:flex md:items-center md:justify-between`}>
                <div className={`flex-1 min-w-0`}>
                  <h2 className={`text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:leading-9 sm:truncate lg:overflow-visible`}>
                    Link Details for: <br/>
                    <a
                      href={linkLocation.url}
                      target={`_blank`}
                      title={linkLocation.url}
                      className={`text-2xl font-bold leading-7 sm:text-3xl sm:leading-9 block mr-3 text-sm font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150 break-words block w-full`}
                    >
                      {linkLocation.url}
                    </a>
                  </h2>
                </div>
              </div>
            </div>
            <div className={`max-w-4xl py-6 px-4 sm:px-6 md:px-8`}>
              <div className={`bg-white shadow overflow-hidden sm:rounded-lg`}>
                <div className={`px-4 py-5 sm:p-0`}>
                  <dl>
                    <div className={`sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5`}>
                      <dt className={`text-sm leading-5 font-medium text-gray-500`}>
                        Created at 
                      </dt>
                      <dd className={`mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2`}>
                        {!user.settings.disableLocalTime ? (
                          <Fragment>
                            <Moment
                              calendar={calendarStrings}
                              date={linkLocation.created_at}
                              local
                            />
                            &nbsp;
                            <Moment
                              date={linkLocation.created_at}
                              format="hh:mm:ss A"
                              local
                            />
                          </Fragment>
                        ) : (
                          <Fragment>
                            <Moment
                              calendar={calendarStrings}
                              date={linkLocation.created_at}
                              utc
                            />
                            &nbsp;
                            <Moment
                              date={linkLocation.created_at}
                              format="hh:mm:ss A"
                              utc
                            />
                          </Fragment>
                        )}
                      </dd>
                    </div>
                    <div className={`mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:px-6 sm:py-5`}>
                      <dt className={`text-sm leading-5 font-medium text-gray-500`}>
                        Type
                      </dt>
                      <dd className={`mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2`}>
                        {linkLocation.type === "PAGE"
                          ? "Page"
                          : linkLocation.type === "EXTERNAL"
                          ? "External"
                          : "Other"}
                      </dd>
                    </div>
                    <div className={`mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:px-6 sm:py-5`}>
                      <dt className={`text-sm leading-5 font-medium text-gray-500`}>
                        Status
                      </dt>
                      <dd className={`mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2`}>
                        {linkLocation.status === "OK" ? (
                          <SiteSuccessBadge text={"OK"} />
                        ) : linkLocation.status === "TIMEOUT" ? (
                          <SiteWarningBadge text={"TIMEOUT"} />
                        ) : linkLocation.status === "HTTP_ERROR" ? (
                          <SiteDangerBadge text={"HTTP ERROR"} />
                        ) : (
                          <SiteDangerBadge text={"OTHER ERROR"} />
                        )}
                      </dd>
                    </div>
                    <div className={`mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:px-6 sm:py-5`}>
                      <dt className={`text-sm leading-5 font-medium text-gray-500`}>
                        Response Time
                      </dt>
                      <dd className={`mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2`}>
                        {linkLocation.response_time} ms
                      </dd>
                    </div>
                    {linkLocation.error !== null && linkLocation.error !== undefined ? (
                      <div className={`mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:px-6 sm:py-5`}>
                        <dt className={`text-sm leading-5 font-medium text-gray-500`}>
                          Error
                        </dt>
                        <dd className={`mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2`}>
                          <SiteDangerBadge text={linkLocation.error} />
                        </dd>
                      </div>
                    ) : null}
                    <div className={`mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:px-6 sm:py-5`}>
                      <dt className={`text-sm leading-5 font-medium text-gray-500`}>
                        Page Links
                      </dt>
                      <dd className={`mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2`}>
                        <ul className={`border border-gray-200 rounded-md`}>
                          {linkLocation.pages.map((val, key) => {
                            return (
                              <li
                                key={key}
                                className={`border-b border-gray-200 pl-3 pr-4 py-3 flex items-center justify-between text-sm leading-5`}
                              >
                                <div className={`w-0 flex-1 flex items-center`}>
                                  <svg
                                    className={`flex-shrink-0 h-5 w-5 text-gray-400`}
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  <span className={`ml-2 flex-1 w-0`}>
                                    <a
                                      href={val.url}
                                      target={`_blank`}
                                      title={val.url}
                                      className={`break-words block p-2 font-medium text-indigo-600 hover:text-indigo-500 transition duration-150 ease-in-out`}
                                    >
                                      {val.url}
                                    </a>
                                  </span>
                                </div>
                                <div className={`ml-4 flex-shrink-0`}>
                                  <CopyToClipboard
                                    onCopy={handleUrlCopy}
                                    text={val.url}
                                  >
                                    <button
                                      className={`font-medium text-indigo-600 hover:text-indigo-500 transition duration-150 ease-in-out`}
                                    >
                                      {copied && copyValue === val.url
                                        ? "Copied!"
                                        : "Copy URL"}
                                    </button>
                                  </CopyToClipboard>
                                </div>
                              </li>
                            )
                          })}
                        </ul>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          </main>
        </div>
      </LinkDetailDiv>
    </Layout>
	)
}

export default LinkDetail