import { Suspense, Fragment, useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import ReactTooltip from 'react-tooltip';
import Router, { useRouter } from 'next/router'
import fetch from 'node-fetch'
import useSWR, { mutate } from 'swr'
import Cookies from 'js-cookie'
import styled from 'styled-components'
import LinksUrlContent from '../../../../public/data/links-url.json'
import Layout from '../../../../components/Layout'
import MobileSidebar from '../../../../components/sidebar/MobileSidebar'
import MainSidebar from '../../../../components/sidebar/MainSidebar'
import LinkOptions from '../../../../components/site/LinkOptions'
import LinkFilter from '../../../../components/site/LinkFilter'
import LinkUrlTable from '../../../../components/site/LinkUrlTable'
import Pagination from '../../../../components/sites/Pagination'

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

const LinksDiv = styled.section`
  .url-type-tooltip,
  .status-tooltip {
    max-width: 15rem;
    margin-left: 5px;
    padding: 1rem 1.5rem;
  }
  @media only screen and (max-width: 1400px) {
    td:first-child {
      max-width: 15rem;
    }
  }
  @media only screen and (min-width: 1600px) {
    td {
      min-width: 10rem;

      &:first-child {
        max-width: 20rem;
      }
    }
  }
`

const Links = props => {
  const [openMobileSidebar, setOpenMobileSidebar] = useState(false)
  const [allFilter, setAllFilter] = useState(false)
  const [issueFilter, setIssueFilter] = useState(false)
  const [internalFilter, setInternalFilter] = useState(false)
  const [externalFilter, setExternalFilter] = useState(false)
  const [pagePath, setPagePath] = useState('')

  const pageTitle = 'Links |'

  const { query } = useRouter()
  const pathname = `/dashboard/site/${query.siteId}/links`
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

  let scanApiEndpoint = props.result.page !== undefined ? `/api/site/${query.siteId}/scan/${scanObjId}/link/?page=` + props.result.page : `/api/site/${query.id}/scan/${scanObjId}/link/`
  let queryString = props.result.status !== undefined && props.result.status.length != 0 ? ( props.result.page !== undefined ? '&status=' + props.result.status.join('&status=') : '?status=' + props.result.status.join('&status=') ) : ''
  queryString += props.result.type != undefined ? ( props.result.page !== undefined || props.result.status !== undefined ? `&type=${props.result.type}` : `?type=${props.result.type}` ) : ''

  scanApiEndpoint  += queryString

  const { data: link, error: linkError, mutate: updateLinks } = useSWR(
    () => query.id && scanObjId ? scanApiEndpoint : null
    , fetcher, {
      refreshInterval: 50000,
  })

  const filterChangeHandler = async (e) => {
    const filterType = e.target.value
    const filterStatus = e.target.checked
    let pathAs = pathname
    
    if((filterType == 'issues' && filterStatus == true) || (filterType != 'issues' && issueFilter)) {
      setIssueFilter(true)
      setAllFilter(false)

      if(scanApiEndpoint.includes("?page"))
        pathAs += `?status=TIMEOUT&status=HTTP_ERROR&status=OTHER_ERROR`
      else
        pathAs += `?status=TIMEOUT&status=HTTP_ERROR&status=OTHER_ERROR`
    }
    else {
      setIssueFilter(false)
    }

    if((filterType == 'internal' && filterStatus == true) || (filterType != 'external' && filterType != 'internal' && internalFilter)) {
      setInternalFilter(true)
      setExternalFilter(false)
      setAllFilter(false)
      pathAs = pathAs.replace('&type=EXTERNAL', '')
      pathAs = pathAs.replace('?type=EXTERNAL', '')

      if(pathAs.includes("?"))
        pathAs += `&type=PAGE`
      else
        pathAs += `?type=PAGE`
    }
    else {
      setInternalFilter(false)
    }

    if((filterType == 'external' && filterStatus == true) || ( filterType != 'internal' && filterType != 'external' && externalFilter)) {
      setExternalFilter(true)
      setInternalFilter(false)
      setAllFilter(false)
      pathAs = pathAs.replace('&type=PAGE', '')
      pathAs = pathAs.replace('?type=PAGE', '')

      if(pathAs.includes("?"))
        pathAs += `&type=EXTERNAL`
      else
        pathAs += `?type=EXTERNAL`
    }
    else {
      setExternalFilter(false)
    }

    if(filterType == 'all' && filterStatus == true) {
      setAllFilter(true)
      setIssueFilter(false)
      setExternalFilter(false)
      setInternalFilter(false)

      pathAs = pathname
    }

    if(pathAs.includes("?"))
      setPagePath(`${pathAs}&`)
    else
      setPagePath(`${pathAs}?`)
    
    Router.push('/dashboard/site/[id]/links', pathAs)

    updateLinks()
  }

  useEffect(() => {
    setPagePath(`${pathname}?`)
  }, [])

  useEffect(() => {
    if(props.result.status !== undefined) {
      setIssueFilter(true)
      setAllFilter(false)
    }
    else
      setIssueFilter(false)

    if(props.result.type !== undefined && props.result.type == 'PAGE') {
      setInternalFilter(true)
      setExternalFilter(false)
      setAllFilter(false)
    }
    else
      setInternalFilter(false)

    if(props.result.type !== undefined && props.result.type == 'EXTERNAL') {
      setExternalFilter(true)
      setInternalFilter(false)
      setAllFilter(false)
    }
    else
      setExternalFilter(false)

    if(props.result.type == undefined && props.result.status == undefined) {
      setIssueFilter(false)
      setInternalFilter(false)
      setExternalFilter(false)
      setAllFilter(true)
    }
  }, [filterChangeHandler])

  if (linkError) return <div>{linkError.message}</div>
  if (scanError) return <div>{scanError.message}</div>
  if (siteError) return <div>{siteError.message}</div>
  if (!link) return <div>Loading...</div>
  if (!site) return <div>Loading...</div>

  return (
    <Layout>
      <Head>
        <title>{pageTitle} {site.name}</title>
      </Head>

      <Suspense fallback={<div>loading...</div>}>
        <LinksDiv className={`h-screen flex overflow-hidden bg-gray-100`}>
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
              <div className={`max-w-6xl mx-auto px-4 md:py-4 sm:px-6 md:px-8`}>
                <div>
                  <nav className={`sm:hidden`}>
                    <Link href={'/dashboard/site/' + query.siteId + '/overview'}>
                      <a className={`flex items-center text-sm leading-5 font-medium text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out`}>
                        <svg className={`flex-shrink-0 -ml-1 mr-1 h-5 w-5 text-gray-400`} viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                        Back to Overview
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
                  </nav>
                </div>
                <div className={`mt-2 md:flex md:items-center md:justify-between`}>
                  <div className={`flex-1 min-w-0`}>
                    <h2 className={`text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:leading-9 sm:truncate lg:overflow-visible`}>
                      All Links - {site.name}
                    </h2>
                  </div>
                </div>
              </div>
              <div className={`max-w-6xl mx-auto px-4 sm:px-6 md:px-8`}>
                <LinkOptions />
                <LinkFilter onFilterChange={filterChangeHandler} allFilter={allFilter} issueFilter={issueFilter} internalFilter={internalFilter} externalFilter={externalFilter} />
                <div className={`pb-4`}>
                  <div className={`flex flex-col`}>
                    <div
                      className={`-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8`}
                    >
                      <div
                        className={`align-middle inline-block min-w-full shadow-xs overflow-hidden rounded-lg border-gray-200`}
                      >
                        <table className={`min-w-full`}>
                          <thead>
                            <tr>
                              {LinksUrlContent.map((site, key) => {
                                return (
                                  <Fragment key={key}>
                                    <th
                                      className={`px-6 py-3 border-b border-gray-200 bg-white text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider`}
                                    >
                                      <div className={`flex items-center`}>
                                        {site.label}
                                        {site.label === "URL Type" ||
                                        site.label === "Status" ? (
                                          <Fragment>
                                            <a data-tip data-for={site.slug} data-iscapture='true' className={`flex items-center`}>
                                              <span
                                                className={`ml-2 inline-block w-4 h-4 overflow-hidden`}
                                              >
                                                <svg
                                                  fill="currentColor"
                                                  viewBox="0 0 20 20"
                                                >
                                                  <path
                                                    fillRule="evenodd"
                                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                                                    clipRule="evenodd"
                                                  ></path>
                                                </svg>
                                              </span>
                                            </a>
                                            <ReactTooltip
                                              id={site.slug}
                                              className={site.slug + "-tooltip"}
                                              type="dark"
                                              effect="solid"
                                              place="bottom"
                                              multiline={true}
                                            >
                                              <span
                                                className={`text-left text-xs leading-4 font-normal text-white normal-case tracking-wider`}
                                              >
                                                Leverage agile frameworks to
                                                provide a robust synopsis for
                                                high level overviews. Iterative
                                                approaches to corporate strategy
                                                foster collaborative thinking to
                                                further the overall value
                                                proposition.
                                              </span>
                                            </ReactTooltip>
                                          </Fragment>
                                        ) : null}
                                      </div>
                                    </th>
                                  </Fragment>
                                );
                              })}
                            </tr>
                          </thead>
                          {link.results && link.results.map((val, key) => (
                            <LinkUrlTable key={key} val={val} />
                          ))}
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                {
                  props.result.page ? (
                    <Pagination 
                      pathName={pagePath}
                      apiEndpoint={scanApiEndpoint}
                      page={props.result.page ? props.result.page : 0}
                    />
                  ) : null
                }

              </div>
            </main>
          </div>
        </LinksDiv>
      </Suspense>
    </Layout>
  )
}

export async function getServerSideProps(context) {
  return {
    props: {
      result: context.query
    }
  }
}

export default Links
