import { Fragment } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import useSWR from 'swr'
import Cookies from 'js-cookie'
import styled from 'styled-components'
import Url from 'url-parse'
import Skeleton from 'react-loading-skeleton';
import SiteDangerBadge from '../badges/SiteDangerBadge'
import SiteSuccessBadge from '../badges/SiteSuccessBadge'
import SiteWarningBadge from '../badges/SiteWarningBadge'

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

const LinkTableDiv = styled.tbody`
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
      max-width: 100%;
      display: block;
    }
  }

  .truncate-link {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 7rem;
  }
`

const LinkTable = props => {
  const { query } = useRouter()
  const { data: linkDetail, error: linkDetailError } = useSWR(
    () =>
      query.siteId
        ? `/api/site/${query.siteId}/scan/${props.val.scan_id}/link/${props.val.id}/`
        : null,
    fetcher,
    {
      refreshInterval: 50000,
    }
  )

  if (linkDetailError) return <div>{linkDetailError.message}</div>

  if (!linkDetail) {
    return (
      <Fragment>
        <LinkTableDiv className={`bg-white`}>
          <tr>
            {[...Array(6)].map((val, index) => <td className={`flex-none px-6 py-4 whitespace-no-wrap border-b border-gray-200`} key={index}><Skeleton duration={2} /></td>)}
          </tr>
        </LinkTableDiv>
      </Fragment>
    )
  }

  return (
    <LinkTableDiv className={`bg-white`}>
      <tr>
        <td
          className={`flex-none px-6 py-4 whitespace-no-wrap border-b border-gray-200`}
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
                  className={`text-sm leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150 truncate`}
                >
                  {props.val.url}
                </a>
              </div>
              <div className={`flex justify-start inline-text-sm leading-5 text-gray-500`}>
                <Link href="/dashboard/site/[siteId]/links/[linkId]/details" as={`/dashboard/site/${query.siteId}/links/${linkDetail.id}/details`}>
                  <a className={`mr-3 outline-none focus:outline-none text-sm leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150`}>View Details</a>
                </Link>
              </div>
            </div>
          </div>
        </td>
        <td
          className={`px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500`}
        >
          {props.val.type === "PAGE"
            ? "Internal"
            : props.val.type === "EXTERNAL"
            ? "External"
            : "Other"}
        </td>
        <td
          className={`px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500`}
        >
          {props.val.status === "OK" ? (
            <SiteSuccessBadge text={"OK"} />
          ) : props.val.status === "TIMEOUT" ? (
            <SiteWarningBadge text={"TIMEOUT"} />
          ) : props.val.status === "HTTP_ERROR" ? (
            <SiteDangerBadge text={"HTTP ERROR"} />
          ) : (
            <SiteDangerBadge text={"OTHER ERROR"} />
          )}
        </td>
        <td
          className={`px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500`}
        >
          {props.val.http_status}
        </td>
        <td
          className={`px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500`}
        >
          {linkDetail.pages.length !== 0 ? <Link href="/dashboard/site/[siteId]/links/[linkId]/details" as={`/dashboard/site/${query.siteId}/links/${linkDetail.id}/details`}><a className={`mr-3 flex items-center outline-none focus:outline-none text-sm leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150`}><span className={`truncate-link`}>{linkDetail.pages[0] && Url(linkDetail.pages[0].url).pathname !== '' ? Url(linkDetail.pages[0].url).pathname : <em>_domain</em>}</span>&nbsp;{(linkDetail.pages.length - 1) > 0 ? "+" + parseInt(linkDetail.pages.length - 1) : null} {(linkDetail.pages.length - 1) > 1 ? "others" : (linkDetail.pages.length - 1) === 1 ? "other" : null}</a></Link> : ''}
        </td>
        <td
          className={`px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500`}
        >
          {props.val.occurences}
        </td>
      </tr>
    </LinkTableDiv>
  )
}

export default LinkTable

LinkTable.propTypes = {}
