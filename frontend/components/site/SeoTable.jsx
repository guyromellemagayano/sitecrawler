import { Fragment } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import useSWR from 'swr'
import Cookies from 'js-cookie'
import styled from 'styled-components'
import Moment from 'react-moment'
import Skeleton from 'react-loading-skeleton';
import Layout from 'components/Layout'

const fetcher = async (url) => {
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "X-CSRFToken": Cookies.get("csrftoken"),
    },
  })

  const data = await res.json()

  if (res.status !== 200) {
    throw new Error(data.message)
  }

  return data
}

const PageSeoTableDiv = styled.tbody`
  td {
    & > div {
      max-width: 100%;
      display: block;

      & > div {
        max-width: 100%;
        display: block;
      }
    }
  }
  .link-item {
    max-width: 100%;
    display: block;
    
    a {
      display: block;
    }
  }

  .truncate-link {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 30rem;
	}
	
	.icon-status {
		text-align: left;
		span {
			margin-left: auto;
			margin-right: auto;
			display: inline-block;
		}
  }
  
  .btn-detail {
    display: inline-block;
    padding: 8px 10px;
    line-height: 1;
    font-size: 0.7rem;
    margin-top: 5px;
  }
`

const PageSeoTable = props => {
	const userApiEndpoint = "/api/auth/user/"
	const calendarStrings = {
    lastDay : '[Yesterday], dddd',
    sameDay : '[Today], dddd',
    lastWeek : 'MMMM DD, YYYY',
    sameElse : 'MMMM DD, YYYY'
  }

  const { query } = useRouter()
  const { data: pageDetail, error: pageDetailError } = useSWR(
    () =>
      query.siteId
        ? `/api/site/${query.siteId}/scan/${props.val.scan_id}/page/${props.val.id}/`
        : null,
    fetcher,
    {
      refreshInterval: 50000,
    }
  )

  const { data: user, error: userError } = useSWR(userApiEndpoint, fetcher)
	
	{pageDetailError && <Layout>{pageDetailError.message}</Layout>}
	{userError && <Layout>{userError.message}</Layout>}

  if (!pageDetail || !user) {
    return (
      <Fragment>
        <PageSeoTableDiv className={`bg-white`}>
          <tr>
            {[...Array(7)].map((val, index) => <td className={`flex-none px-6 py-4 whitespace-no-wrap border-b border-gray-200`} key={index}><Skeleton duration={2} /></td>)}
          </tr>
        </PageSeoTableDiv>
      </Fragment>
    )
	}

  return (
    <PageSeoTableDiv className={`bg-white`}>
      <tr>
        <td
          className={`flex-none pl-16 pr-6 py-4 whitespace-no-wrap border-b border-gray-200`}
        >
          <div className={`flex items-center`}>
            <div>
              <div
                className={`link-item text-sm leading-5 font-medium text-gray-900`}
              >
                <a
                  href={props.val.url}
                  target={`_blank`}
                  title={props.val.url}
                  className={`text-sm leading-6 font-semibold text-blue-1000 hover:text-blue-900 transition ease-in-out duration-150 truncate`}
                >
                  {props.val.url}
                </a>
              </div>
              <div className={`flex justify-start inline-text-sm leading-5 text-gray-500`}>
                <Link href="/dashboard/site/[siteId]/seo/[seoId]/details" as={`/dashboard/site/${query.siteId}/seo/${pageDetail.id}/details`}>
                  <a className={`btn-detail mr-3 outline-none focus:outline-none text-sm leading-6 font-semibold text-white bg-indigo-600 rounded hover:bg-indigo-500 hover:border-0 transition ease-in-out duration-150`}>View Details</a>
                </Link>
              </div>
            </div>
          </div>
        </td>
        <td
          className={`icon-status pl-16 pr-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500`}
        >
					<div className={`text-sm leading-5 text-gray-900`}>
						{!user.settings.disableLocalTime ? (
							<Moment calendar={calendarStrings} date={pageDetail.created_at} local />
						): (
							<Moment calendar={calendarStrings} date={pageDetail.created_at} utc />
						)}
					</div>
					<div className={`text-sm leading-5 text-gray-500`}>
						{!user.settings.disableLocalTime ? (
							<Moment date={pageDetail.created_at} format="hh:mm:ss A" local />
						) : (
							<Moment date={pageDetail.created_at} format="hh:mm:ss A" utc />
						)}
					</div>
        </td>
        <td
          className={`icon-status pl-16 pr-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500`}
        >
          {pageDetail.num_links}
        </td>
        <td
          className={`icon-status pl-16 pr-6 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-green-500`}
        >
          {pageDetail.num_ok_links}
        </td>
        <td
          className={`icon-status pl-16 pr-6 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-red-500`}
        >
					{pageDetail.num_non_ok_links}
        </td>
      </tr>
    </PageSeoTableDiv>
  )
}

export default PageSeoTable

PageSeoTable.propTypes = {}
