import { Fragment } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import useSWR from 'swr'
import Cookies from 'js-cookie'
import styled from 'styled-components'
import bytes from 'bytes'
import Skeleton from 'react-loading-skeleton';
import SiteSuccessIcon from '../icons/SiteSuccessIcon'
import SiteWarningIcon from '../icons/SiteWarningIcon'
import SiteDangerIcon from '../icons/SiteDangerIcon'
import SiteNotApplicableIcon from '../icons/SiteNotApplicableIcon'
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

const PagesTableDiv = styled.tbody`
  a,
  div {
    max-width: 100%;
    display: block;
  }
`

const PagesTable = props => {
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

  if (pageDetailError) return <div>{pageDetailError.message}</div>

  if (!pageDetail) {
    return (
      <Fragment>
        <PagesTableDiv className={`bg-white`}>
          <tr>
            {[...Array(4)].map((val, index) => <td className={`flex-none px-6 py-4 whitespace-no-wrap border-b border-gray-200`} key={index}><Skeleton duration={2} /></td>)}
          </tr>
        </PagesTableDiv>
      </Fragment>
    )
  }

  return (
    <PagesTableDiv className={`bg-white`}>
      <tr>
        <td
          className={`flex-none px-6 py-4 whitespace-no-wrap border-b border-gray-200`}
        >
          <div className={`flex items-center`}>
            <div>
              <div className={`text-sm leading-5 font-medium text-gray-900`}>
                <a
                  href={props.val.url}
                  target={`_blank`}
                  title={props.val.url}
                  className={`text-sm leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150`}
                >
                  {props.val.url}
                </a>
              </div>
              <div className={`flex justify-start inline-text-sm leading-5 text-gray-500`}>
                <Link href="/dashboard/site/[siteId]/pages/[pageId]/details" as={`/dashboard/site/${query.siteId}/pages/${pageDetail.id}/details`}>
                  <a className={`mr-3 outline-none focus:outline-none text-sm leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150`}>View Details</a>
                </Link>
              </div>
            </div>
          </div>
        </td>
        <td
          className={`px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500`}
        >
          {bytes(props.val.size_total, {thousandsSeparator: ' ', unitSeparator: ' '})}
        </td>
        <td
          className={`px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500`}
        >
          <SiteSuccessBadge text={'Good'} />
        </td>
        <td
          className={`px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500`}
        >
          <SiteSuccessIcon />
        </td>
        <td
          className={`px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500`}
        >
          {props.val.tls_status === 'OK' ? <SiteSuccessIcon /> : <SiteDangerIcon />}
        </td>
      </tr>
    </PagesTableDiv>
  )
}

export default PagesTable

PagesTable.propTypes = {}