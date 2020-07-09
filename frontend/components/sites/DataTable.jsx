import fetch from 'node-fetch'
import useSWR from 'swr'
import Cookies from 'js-cookie'
import Link from 'next/link'
import styled from 'styled-components'
import Moment from 'react-moment'

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

const DataTableDiv = styled.tr``

const DataTable = props => {
  const { data: scan, error: scanError } = useSWR(
    () => (props ? `/api/site/${props.site.id}/scan/` : null),
    fetcher,
    { refreshInterval: 1000 }
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

  const { data: scanId, error: scanIdError } = useSWR(
    () =>
      props && scanObjId
        ? `/api/site/${props.site.id}/scan/${scanObjId}/`
        : null,
    fetcher,
    { refreshInterval: 1000 }
  )

  if (scanIdError) return <div>{scanIdError.message}</div>
  if (scanError) return <div>{scanError.message}</div>
  if (!scan || !scanId) return <div>Loading...</div>

  const calendarStrings = {
    lastDay : '[Yesterday], dddd',
    sameDay : '[Today], dddd',
    lastWeek : 'MMMM DD, YYYY',
    sameElse : 'MMMM DD, YYYY'
  }

  return (
    <DataTableDiv>
      <td
        className={`flex-none px-6 py-4 whitespace-no-wrap border-b border-gray-200`}
      >
        <div className={`flex items-center`}>
          <div className={`mr-4`}>
            <div className={`text-overflow text-sm leading-5 font-medium text-gray-900`}>
              {props.site.name}
            </div>
            <div className={`text-sm leading-5 text-gray-500`}>
              <a
                href={`${props.site.url}`}
                target={`_blank`}
                title={`${props.site.url}`}
                className={`text-sm leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150`}
              >
                Visit Link
              </a>
            </div>
          </div>
        </div>
      </td>
      <td className={`px-6 py-4 whitespace-no-wrap border-b border-gray-200`}>
        <div className={`text-sm leading-5 text-gray-900`}>
          {props.user.settings.enableLocalTime ? (
            <Moment calendar={calendarStrings} date={props.site.updated_at} local />
          ): (
            <Moment calendar={calendarStrings} date={props.site.updated_at} utc />
          )}
        </div>
        <div className={`text-sm leading-5 text-gray-500`}>
          {props.user.settings.enableLocalTime ? (
            <Moment date={props.site.updated_at} format="hh:mm:ss A" local />
          ) : (
            <Moment date={props.site.updated_at} format="hh:mm:ss A" utc />
          )}
        </div>
      </td>
      <td className={`px-6 py-4 whitespace-no-wrap border-b border-gray-200`}>
        {props.site.verified ? (
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800`}
          >
            Verified
          </span>
        ) : (
          <span
            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800`}
          >
            Unverified
          </span>
        )}
      </td>
      <td
        className={`px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 font-semibold text-gray-500`}
      >
        {scanId.num_links}
      </td>
      <td
        className={`px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 font-semibold text-red-500`}
      >
        {scanId.num_non_ok_links}
      </td>
      <td
        className={`flex-grow px-6 py-4 whitespace-no-wrap text-right border-b border-gray-200 text-sm leading-5 font-medium`}
      >
        <Link href="/dashboard/site/[id]/overview" as={`/dashboard/site/${props.site.id}/overview`}>
          <a
            className={`text-sm leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150`}
          >
            View Stats
          </a>
        </Link>
      </td>
    </DataTableDiv>
  )
}

export default DataTable
