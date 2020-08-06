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
import ImagesTableContent from 'public/data/images-table.json'
import Layout from 'components/Layout'
import MobileSidebar from 'components/sidebar/MobileSidebar'
import MainSidebar from 'components/sidebar/MainSidebar'
import ImagesOptions from 'components/site/ImagesOptions'
import ImagesFilter from 'components/site/ImagesFilter'
import ImagesTable from 'components/site/ImagesTable'
import ImagesSorting from 'components/site/ImagesSorting'
import Pagination from 'components/sites/Pagination'

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
  imageUrl: 'default',
  createdAt: 'default',
  status: 'default',
  httpCode: 'default',
  occurrences: 'default'
}

const ImagesDiv = styled.section``

const Images = props => {
	const [openMobileSidebar, setOpenMobileSidebar] = useState(false)

	const [allFilter, setAllFilter] = useState(false)
	const [imageWorking, setImageWorking] = useState(false)
	const [imageNotWorking, setImageNotWorking] = useState(false)

	const [pagePath, setPagePath] = useState('')
	const [sortOrder, setSortOrder] = useState(initialOrder)

	const [searchKey, setSearchKey] = useState('')

	const pageTitle = 'Images |'

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
  
  let scanApiEndpoint = props.result.page !== undefined ? `/api/site/${query.siteId}/scan/${scanObjId}/link/?page=` + props.result.page : `/api/site/${query.siteId}/scan/${scanObjId}/image/`
  
  const { data: image, error: imageError, mutate: updateImages } = useSWR(
    () => query.siteId && scanObjId ? scanApiEndpoint : null
    , fetcher, {
      refreshInterval: 50000,
  })

  {userError && <Layout>{userError.message}</Layout>}
  {imageError && <Layout>{imageError.message}</Layout>}
  {scanError && <Layout>{scanError.message}</Layout>}
  {siteError && <Layout>{siteError.message}</Layout>}

	return (
		<Layout>
      {user && image && scan ? (
        <Fragment>
          <Head>
            <title>{pageTitle} {site.name}</title>
          </Head>

          <ImagesDiv className={`h-screen flex overflow-hidden bg-gray-100`}>
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
                      <Link href={'/dashboard/site/' + query.siteId + '/images'}>
                        <a className={`font-medium text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out`}>Images</a>
                      </Link>
                    </nav>
                  </div>
                  <div className={`mt-2 md:flex md:items-center md:justify-between`}>
                    <div className={`flex-1 min-w-0`}>
                      <h2 className={`text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:leading-9 sm:truncate lg:overflow-visible`}>
                        Images - {site.name}
                      </h2>
                    </div>
                  </div>
                </div>
                <div className={`max-w-full mx-auto px-4 sm:px-6 md:px-8`}>
                  {/* <ImagesOptions searchKey={searchKey} onSearchEvent={searchEventHandler} /> */}
                  {/* <ImagesFilter 
                    onFilterChange={filterChangeHandler} 
                    allFilter={allFilter} 
                  /> */}
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
                                {ImagesTableContent.map((site, key) => {
                                  return (
                                    <Fragment key={key}>
                                      <th
                                        className={`px-6 py-3 border-b border-gray-200 bg-white text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider`}
                                      >
                                        <div className={`flex items-center`}>
                                          {/* <ImagesSorting sortOrder={sortOrder} onSortHandler={SortHandler} key={key} slug={site.slug} /> */}
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
                            {image.results && image.results.map((val, key) => (
                              <ImagesTable key={key} val={val} />
                            ))}
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* <Pagination 
                    href='/dashboard/site/[siteId]/images'
                    pathName={pagePath}
                    apiEndpoint={scanApiEndpoint}
                    page={props.result.page ? props.result.page : 0}
                  /> */}
                </div>
              </main>
            </div>
          </ImagesDiv>
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

export default Images
