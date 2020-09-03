import { Fragment, useState, useEffect } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Router, { useRouter } from 'next/router'
import fetch from 'node-fetch'
import useSWR, { mutate } from 'swr'
import Cookies from 'js-cookie'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import useUser from 'hooks/useUser'
import SeoTableContent from 'public/data/seo-table.json'
import Layout from 'components/Layout'
import MobileSidebar from 'components/sidebar/MobileSidebar'
import MainSidebar from 'components/sidebar/MainSidebar'
import SeoOptions from 'components/site/SeoOptions'
import SeoFilter from 'components/site/SeoFilter'
import PageSeoTable from 'components/site/SeoTable'
import SeoSorting from 'components/site/SeoSorting'
import Pagination from 'components/sites/Pagination'
import { removeURLParameter, slugToCamelcase, getSortKeyFromSlug, getSlugFromSortKey } from 'helpers/functions'

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

const initialOrder = {
  pageUrl: 'default',
  createdAt: 'default',
  totalLinks: 'default',
  totalOkLinks: 'default',
  totalNonOkLinks: 'default'
}

const SeoDiv = styled.section`
  .btn-crawler {
    top: 0;
    right: 0;
    padding: 2.25rem 1.5rem;
  }
`

const Seo = props => {
  const [openMobileSidebar, setOpenMobileSidebar] = useState(false)
  
  const [allFilter, setAllFilter] = useState(false)
  const [noTitle, setNoTitle] = useState(false)
  const [noDescription, setNoDescription] = useState(false)
  const [noH1First, setNoH1First] = useState(false)
  const [noH1Second, setNoH1Second] = useState(false)
  const [noH2First, setNoH2First] = useState(false)
  const [noH2Second, setNoH2Second] = useState(false)
  const [recrawlable, setRecrawlable] = useState(false)
  const [crawlFinished, setCrawlFinished] = useState(false)
  const [pagePath, setPagePath] = useState('')
  const [sortOrder, setSortOrder] = useState(initialOrder)
  const [searchKey, setSearchKey] = useState('')

  const pageTitle = 'SEO |'

  const { user: user, userError: userError } = useUser({
    redirectTo: '/login',
    redirectIfFound: false
  })

  const { query, asPath } = useRouter()
  const { data: site, error: siteError } = useSWR(
    () => (query.siteId ? `/api/site/${query.siteId}/` : null),
    fetcher
  )

  const { data: scan, error: scanError } = useSWR(
    () => (query.siteId ? `/api/site/${query.siteId}/scan/?ordering=-finished_at` : null),
    fetcher
  )

  let scanObjId = ""

  if (scan) {
    let scanObj = []

    scan.results.map((val) => {
      scanObj.push(val)
      return scanObj
    })

    scanObj.map((val, index) => {
      if(index == 0) scanObjId = val.id
      
      return scanObjId
    })
  }

  let scanApiEndpoint = props.result.page !== undefined ? `/api/site/${query.siteId}/scan/${scanObjId}/page/?page=` + props.result.page : `/api/site/${query.siteId}/scan/${scanObjId}/page/`
  let queryString = props.result.has_title !== undefined ? ( scanApiEndpoint.includes('?') ? `&has_title=false` : `?has_title=false` ) : ''
  queryString += props.result.has_description !== undefined ? ( (scanApiEndpoint + queryString).includes('?') ? `&has_description=false` : `?has_description=false` ) : ''
  queryString += props.result.has_h1_first !== undefined ? ( (scanApiEndpoint + queryString).includes('?') ? `&has_h1_first=false` : `?has_h1_first=false` ) : ''
  queryString += props.result.has_h1_second !== undefined ? ( (scanApiEndpoint + queryString).includes('?') ? `&has_h1_second=false` : `?has_h1_second=false` ) : ''
  queryString += props.result.has_h2_first !== undefined ? ( (scanApiEndpoint + queryString).includes('?') ? `&has_h2_first=false` : `?has_h2_first=false` ) : ''
  queryString += props.result.has_h2_second !== undefined ? ( (scanApiEndpoint + queryString).includes('?') ? `&has_h2_second=false` : `?has_h2_second=false` ) : ''
  
  queryString += props.result.search !== undefined ? ( (scanApiEndpoint + queryString).includes('?') ? `&search=${props.result.search}` : `?search=${props.result.search}` ) : ''
  queryString += props.result.ordering !== undefined ? ( (scanApiEndpoint + queryString).includes('?') ? `&ordering=${props.result.ordering}` : `?ordering=${props.result.ordering}` ) : ''

  scanApiEndpoint += queryString

  const { data: page, error: pageError, mutate: updatePages } = useSWR(
    () => query.siteId && scanObjId ? scanApiEndpoint : null
    , fetcher, {
      refreshInterval: 50000,
  })

  const searchEventHandler = async (e) => {
    if(e.keyCode != 13)
      return false

    let newPath = removeURLParameter(asPath, 'search')
    newPath = removeURLParameter(newPath, 'page')
    
    if(e.target.value == '' || e.target.value == ' ') {
      setSearchKey(e.target.value)
      if(newPath.includes("?"))
        setPagePath(`${newPath}&`)
      else
        setPagePath(`${newPath}?`)

      Router.push('/dashboard/site/[siteId]/seo', newPath)
      return
    }

    if(newPath.includes("?"))
      newPath += `&search=${e.target.value}`
    else
      newPath += `?search=${e.target.value}`

    setSearchKey(e.target.value)
    if(newPath.includes("?"))
      setPagePath(`${newPath}&`)
    else
      setPagePath(`${newPath}?`)

    Router.push('/dashboard/site/[siteId]/seo', newPath)

    updatePages()
  }

  const filterChangeHandler = async (e) => {
    const filterType = e.target.value
    const filterStatus = e.target.checked

    let newPath = asPath
    newPath = removeURLParameter(newPath, 'page')

    if(filterType == 'noTitle' && filterStatus == true) {
      setNoTitle(true)
      setAllFilter(false)

      if(newPath.includes("?"))
        newPath += `&has_title=false`
      else
        newPath += `?has_title=false`
    }
    else if(filterType == 'noTitle' && filterStatus == false) {
      newPath = removeURLParameter(newPath, 'has_title')
      setNoTitle(false)
    }

    if(filterType == 'noDescription' && filterStatus == true) {
      setNoDescription(true)
      setAllFilter(false)

      if(newPath.includes("?"))
        newPath += `&has_description=false`
      else
        newPath += `?has_description=false`
    }
    else if(filterType == 'noDescription' && filterStatus == false) {
      newPath = removeURLParameter(newPath, 'has_description')
      setNoDescription(false)
    }

    if(filterType == 'noH1First' && filterStatus == true) {
      setNoH1First(true)
      setAllFilter(false)

      if(newPath.includes("?"))
        newPath += `&has_h1_first=false`
      else
        newPath += `?has_h1_first=false`
    }
    else if(filterType == 'noH1First' && filterStatus == false) {
      newPath = removeURLParameter(newPath, 'has_h1_first')
      setNoH1First(false)
    }

    if(filterType == 'noH1Second' && filterStatus == true) {
      setNoH1Second(true)
      setAllFilter(false)

      if(newPath.includes("?"))
        newPath += `&has_h1_second=false`
      else
        newPath += `?has_h1_second=false`
    }
    else if(filterType == 'noH1Second' && filterStatus == false) {
      newPath = removeURLParameter(newPath, 'has_h1_second')
      setNoH1Second(false)
    }

    if(filterType == 'noH2First' && filterStatus == true) {
      setNoH2First(true)
      setAllFilter(false)

      if(newPath.includes("?"))
        newPath += `&has_h2_first=false`
      else
        newPath += `?has_h2_first=false`
    }
    else if(filterType == 'noH2First' && filterStatus == false) {
      newPath = removeURLParameter(newPath, 'has_h2_first')
      setNoH2First(false)
    }

    if(filterType == 'noH2Second' && filterStatus == true) {
      setNoH2Second(true)
      setAllFilter(false)

      if(newPath.includes("?"))
        newPath += `&has_h2_second=false`
      else
        newPath += `?has_h2_second=false`
    }
    else if(filterType == 'noH2Second' && filterStatus == false) {
      newPath = removeURLParameter(newPath, 'has_h2_second')
      setNoH2Second(false)
    }

    if(filterType == 'all' && filterStatus == true) {
      setNoTitle(false)
      setNoDescription(false)
      setNoH1First(false)
      setNoH1Second(false)
      setNoH2First(false)
      setNoH2Second(false)

      setAllFilter(true)

      newPath = removeURLParameter(newPath, 'has_title')
      newPath = removeURLParameter(newPath, 'has_description')
      newPath = removeURLParameter(newPath, 'has_h1_first')
      newPath = removeURLParameter(newPath, 'has_h1_second')
      newPath = removeURLParameter(newPath, 'has_h2_first')
      newPath = removeURLParameter(newPath, 'has_h2_second')

      if(!newPath.includes('search') && !newPath.includes('ordering'))
        newPath = newPath.replace('?', '')
    }

    if(newPath.includes("?"))
      setPagePath(`${newPath}&`)
    else
      setPagePath(`${newPath}?`)
    
    Router.push('/dashboard/site/[siteId]/seo', newPath)

    updatePages()

    return true
  }

  useEffect(() => {
    if(removeURLParameter(asPath, 'page').includes("?"))
      setPagePath(`${removeURLParameter(asPath, 'page')}&`)
    else
      setPagePath(`${removeURLParameter(asPath, 'page')}?`)

    if(props.result.search !== undefined)
      setSearchKey(props.result.search)

    if(props.result.ordering !== undefined) {
      const slug = getSlugFromSortKey(SeoTableContent, props.result.ordering.replace('-', ''))
      const orderItem = slugToCamelcase(slug)

      if(props.result.ordering.includes('-'))
        setSortOrder(prevState => ({ ...prevState, [orderItem]: 'desc' }));
      else
        setSortOrder(prevState => ({ ...prevState, [orderItem]: 'asc' }));
    }
    
  }, [])

  useEffect(() => {
    if(props.result.has_title !== undefined) {
      setNoTitle(true)
      setAllFilter(false)
    }
    else
      setNoTitle(false)

    if(props.result.has_description !== undefined) {
      setNoDescription(true)
      setAllFilter(false)
    }
    else
      setNoDescription(false)

    if(props.result.has_h1_first !== undefined) {
      setNoH1First(true)
      setAllFilter(false)
    }
    else
      setNoH1First(false)

    if(props.result.has_h1_second !== undefined) {
      setNoH1Second(true)
      setAllFilter(false)
    }
    else
      setNoH1Second(false)

    if(props.result.has_h2_first !== undefined) {
      setNoH2First(true)
      setAllFilter(false)
    }
    else
      setNoH2First(false)

    if(props.result.has_h2_second !== undefined) {
      setNoH2Second(true)
      setAllFilter(false)
    }
    else
      setNoH2Second(false)

    if(
        props.result.has_title == undefined && 
        props.result.has_description == undefined &&
        props.result.has_h1_first == undefined &&
        props.result.has_h1_second == undefined &&
        props.result.has_h2_first == undefined &&
        props.result.has_h2_second == undefined
      ) {
      setNoTitle(false)
      setNoDescription(false)
      setNoH1First(false)
      setNoH1Second(false)
      setNoH2First(false)
      setNoH2Second(false)

      setAllFilter(true)
    }
    
  }, [filterChangeHandler])

  const SortHandler = (slug, dir) => {
    setSortOrder({...initialOrder});

    let newPath = removeURLParameter(asPath, 'ordering')
    
    const sortItem = slugToCamelcase(slug)
    const sortKey = getSortKeyFromSlug(SeoTableContent, slug)

    if(sortOrder[sortItem] == 'default') {
      setSortOrder(prevState => ({ ...prevState, [sortItem]: dir }));
      if(dir == 'asc') {
        if(newPath.includes("?"))
          newPath += `&ordering=${sortKey}`
        else
          newPath += `?ordering=${sortKey}`
      }
      else {
        if(newPath.includes("?"))
          newPath += `&ordering=-${sortKey}`
        else
          newPath += `?ordering=-${sortKey}`
      }
    }
    else if(sortOrder[sortItem] == 'asc') {
      setSortOrder(prevState => ({ ...prevState, [sortItem]: 'desc' }));
      if(newPath.includes("?"))
        newPath += `&ordering=-${sortKey}`
      else
        newPath += `?ordering=-${sortKey}`
    }
    else {
      setSortOrder(prevState => ({ ...prevState, [sortItem]: 'asc' }));
      if(newPath.includes("?"))
        newPath += `&ordering=${sortKey}`
      else
        newPath += `?ordering=${sortKey}`
    }
    
    // console.log('[pagePath]', newPath)
    if(newPath.includes("?"))
      setPagePath(`${removeURLParameter(newPath, 'page')}&`)
    else
      setPagePath(`${removeURLParameter(newPath, 'page')}?`)
    
    Router.push('/dashboard/site/[siteId]/seo', newPath)
    updatePages()
  }

  const reCrawlEndpoint = `/api/site/${query.siteId}/start_scan/`
  
  const onCrawlHandler = async () => {
    setCrawlFinished(false)
    const res = await fetch(reCrawlEndpoint, {
      method: 'POST',
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

    // console.log('[onCrawlHandler]', data)
  
    return data
  }

  const crawlableHandler = (finished) => {
    if(finished)
      setCrawlFinished(true)

    if(user && user.permissions !== undefined && user.permissions[0] == 'can_start_scan' && site && site.verified && finished)
      setRecrawlable(true)
    else
      setRecrawlable(false)
  }

  useEffect(() => {
    if(user && user.permissions !== undefined && user.permissions[0] == 'can_start_scan' && site && site.verified)
      setRecrawlable(true)
    else
      setRecrawlable(false)
  }, [user, site])
  
  {userError && <Layout>{userError.message}</Layout>}
  {pageError && <Layout>{pageError.message}</Layout>}
  {scanError && <Layout>{scanError.message}</Layout>}
  {siteError && <Layout>{siteError.message}</Layout>}

  return (
    <Layout>
      {user && page && site && scan ? (
        <Fragment>
          <Head>
            <title>{pageTitle} {site.name}</title>
          </Head>

          <SeoDiv className={`h-screen flex overflow-hidden bg-gray-100`}>
            <MobileSidebar show={openMobileSidebar} crawlableHandler={crawlableHandler} />
            <MainSidebar crawlableHandler={crawlableHandler} />

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
                      <Link href='/dashboard/site/[siteId]/overview' as={'/dashboard/site/' + query.siteId + '/overview'}>
                        <a className={`flex items-center text-sm leading-5 font-medium text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out`}>
                          <svg className={`flex-shrink-0 -ml-1 mr-1 h-5 w-5 text-gray-400`} viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"/>
                          </svg>
                          Back to Overview
                        </a>
                      </Link>
                    </nav>
                    <nav className={`hidden sm:flex items-center text-sm leading-5`}>
                      <Link href='/dashboard/site/[siteId]/overview' as={'/dashboard/site/' + query.siteId + '/overview'}>
                        <a className={`font-normal text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out`}>{site.name}</a>
                      </Link>
                      <svg className={`flex-shrink-0 mx-2 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor`}>
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                      </svg>
                      <Link href='/dashboard/site/[siteId]/seo' as={'/dashboard/site/' + query.siteId + '/seo'}>
                        <a className={`font-medium text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out`}>SEO</a>
                      </Link>
                    </nav>
                  </div>
                  <div className={`mt-2 md:flex md:items-center md:justify-between`}>
                    <div className={`flex-1 min-w-0`}>
                      <h2 className={`text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:leading-9 sm:truncate lg:overflow-visible`}>
                        SEO - {site.name}
                      </h2>
                    </div>
                  </div>
                </div>
                <div className={`btn-crawler absolute mt-4`}>
                  {
                    user.permissions.includes('can_start_scan') ? (
                      recrawlable ? (
                        <button
                          type={`button`}
                          onClick={onCrawlHandler}
                          className={`w-32 mt-3 mr-3 rounded-md shadow sm:mt-0 relative items-center px-4 py-2 border border-transparent text-sm uppercase leading-5 font-medium rounded-md block text-white text-center bg-gray-1000 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:border-gray-900 focus:shadow-outline-gray active:bg-gray-900 transition ease-in-out duration-150`}
                        >
                          Recrawl
                        </button>
                      ) : (
                        <button
                          disabled={`disabled`}
                          type={`button`}
                          className={`w-32 mt-3 mr-3 rounded-md shadow sm:mt-0 relative items-center px-4 py-2 border border-transparent text-sm uppercase leading-5 font-medium rounded-md block text-white text-center bg-gray-1000 opacity-50 cursor-not-allowed`}
                        >
                          Recrawl
                        </button>
                      )
                    ) : null
                  }
                </div>
                <div className={`max-w-full mx-auto px-4 sm:px-6 md:px-8`}>
                  <SeoOptions searchKey={searchKey} onSearchEvent={searchEventHandler} />
                  <SeoFilter 
                    onFilterChange={filterChangeHandler} 
                    allFilter={allFilter} 
                    noTitle={noTitle} 
                    noDescription={noDescription} 
                    noH1First={noH1First} 
                    noH1Second={noH1Second} 
                    noH2First={noH2First} 
                    noH2Second={noH2Second} 
                  />
                  <Pagination 
                    href='/dashboard/site/[siteId]/seo'
                    pathName={pagePath}
                    apiEndpoint={scanApiEndpoint}
                    page={props.result.page ? props.result.page : 0}
                  />
                  <div className={`py-4`}>
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
                                {SeoTableContent.map((site, key) => {
                                  return (
                                    <Fragment key={key}>
                                      <th
                                        className={`px-6 py-3 border-b border-gray-200 bg-white text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider`}
                                      >
                                        <div className={`flex items-center`}>
                                          {site.slug != undefined ? (
                                            <SeoSorting sortOrder={sortOrder} onSortHandler={SortHandler} key={key} slug={site.slug} />
                                          ) : null}
                                          <span className="label">
                                            {site.label}
                                          </span>
                                        </div>
                                      </th>
                                    </Fragment>
                                  );
                                })}
                              </tr>
                            </thead>
                            {page.results && page.results.map((val, key) => (
                              <PageSeoTable key={key} val={val} />
                            ))}
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Pagination 
                    href='/dashboard/site/[siteId]/seo'
                    pathName={pagePath}
                    apiEndpoint={scanApiEndpoint}
                    page={props.result.page ? props.result.page : 0}
                  />
                </div>
              </main>
            </div>
          </SeoDiv>
        </Fragment>
      ) : null}
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

export default Seo