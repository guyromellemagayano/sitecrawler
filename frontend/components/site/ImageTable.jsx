import { Fragment } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import useSWR from 'swr'
import Cookies from 'js-cookie'
import styled from 'styled-components'
import Url from 'url-parse'
import bytes from 'bytes'
import PropTypes from 'prop-types'
import Moment from 'react-moment'
import Skeleton from 'react-loading-skeleton';
import Layout from 'components/Layout'
import SiteDangerBadge from 'components/badges/SiteDangerBadge'
import SiteSuccessBadge from 'components/badges/SiteSuccessBadge'
import SiteWarningBadge from 'components/badges/SiteWarningBadge'

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

const ImagesTableDiv = styled.tbody`
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

const ImagesTable = props => {
	const userApiEndpoint = "/api/auth/user/"
	const calendarStrings = {
    lastDay : '[Yesterday], dddd',
    sameDay : '[Today], dddd',
    lastWeek : 'MMMM DD, YYYY',
    sameElse : 'MMMM DD, YYYY'
  }

  const { query } = useRouter()

  const { data: user, error: userError } = useSWR(userApiEndpoint, fetcher)
	
	{userError && <Layout>{userError.message}</Layout>}

  return (
		<Fragment>
			{user && props ? (
				<ImagesTableDiv className={`bg-white`}>
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
											className={`text-sm leading-6 font-semibold text-blue-1000 hover:text-blue-900 transition ease-in-out duration-150 truncate-link`}
										>
											{props.val.url}
										</a>
									</div>
									<div className={`flex justify-start inline-text-sm leading-5 text-gray-500`}>
										<Link href="/dashboard/site/[id]/images/[id]/details" as={`/dashboard/site/${query.siteId}/images/${props.val.id}/details`}>
											<a className={`btn-detail mr-3 outline-none focus:outline-none text-sm leading-6 font-semibold text-white bg-indigo-600 rounded hover:bg-indigo-500 hover:border-0 transition ease-in-out duration-150`}>View Details</a>
										</Link>
									</div>
								</div>
							</div>
						</td>
						<td
							className={`icon-status pl-16 pr-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500`}
						>
							{bytes(props.val.size, {thousandsSeparator: ' ', unitSeparator: ' '})}
						</td>
						<td
							className={`icon-status pl-16 pr-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500`}
						>
							{props.val.status === "OK" ? (
								<SiteSuccessBadge text={"OK"} />
							) : props.val.status === "TIMEOUT" ? (
								<SiteWarningBadge text={"TIMEOUT"} />
							) : props.val.status === "HTTP_ERROR" ? (
								<SiteDangerBadge text={`HTTP ERROR (${props.val.http_status})`} />
							) : (
								<SiteDangerBadge text={"OTHER ERROR"} />
							)}
						</td>
						<td
							className={`icon-status px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-red-500`}
						>
							{props.val.length !== 0 ? <Link href="/dashboard/site/[id]/links/[id]/details" as={`/dashboard/site/${query.siteId}/links/${props.val.id}/details`}><a className={`mr-3 flex items-center outline-none focus:outline-none text-sm leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150`}><span className={`truncate-link`}>{props.val[0] && Url(props.val[0].url).pathname !== '' ? Url(props.val[0].url).pathname : <em>_domain</em>}</span>&nbsp;{(props.val.length - 1) > 0 ? "+" + parseInt(props.val.length - 1) : null} {(props.val.length - 1) > 1 ? "others" : (props.val.length - 1) === 1 ? "other" : null}</a></Link> : ''}
						</td>
						<td
							className={`icon-status pl-16 pr-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500`}
						>
							{props.val.occurences}
						</td>
					</tr>
				</ImagesTableDiv>
			) : (
				<ImagesTableDiv className={`bg-white`}>
          <tr>
            {[...Array(6)].map((val, index) => <td className={`flex-none px-6 py-4 whitespace-no-wrap border-b border-gray-200`} key={index}><Skeleton duration={2} /></td>)}
          </tr>
        </ImagesTableDiv>
			)}
		</Fragment>
  )
}

export default ImagesTable

ImagesTable.propTypes = {}
