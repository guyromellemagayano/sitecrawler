import { Fragment,  useEffect } from 'react'
import Cookies from 'js-cookie'
import useSWR from 'swr'
import styled from 'styled-components'
import Moment from 'react-moment'
import Skeleton from 'react-loading-skeleton'

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

const SitesOverviewDiv = styled.div``

const SitesOverview = props => {
  const userApiEndpoint = '/api/auth/user/'
  const calendarStrings = {
    lastDay : '[Yesterday], dddd',
    sameDay : '[Today], dddd',
    lastWeek : 'MMMM DD, YYYY',
    sameElse : 'MMMM DD, YYYY'
  }

  const { data: user, error: userError } = useSWR(userApiEndpoint, fetcher)

  useEffect(() => {
    if(user && user.permissions !== undefined && user.permissions[0] !== undefined)
      console.log('[user]', user.permissions[0])
  }, [user])

  if (userError) return <div>{userError.message}</div>
  if (!user) {
    return (
      <Skeleton width={280} height={198} duration={2} />
    )
  }

  return (
    <SitesOverviewDiv className={`bg-white overflow-hidden shadow-xs rounded-lg`}>
      <div className={`px-4 py-5 sm:p-6`}>
        <h2 className={`text-lg leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150 break-all`}>
          <a href={`${props.url}`} target={`_blank`} title={`${props.url}`}>
            {props.url}
          </a>
        </h2>
        <div className={`mt-5 mb-3 max-w-lg text-sm leading-5 text-gray-500`}>
          <div className={`mb-2 flex`}>
            <strong>Site Status:</strong>
            {props.verified ? (
              <div className={`ml-2 max-w-xl`}>
                <span className={`px-2 py-0.5 mr-3 inline-flex text-xs leading-4 font-medium rounded bg-green-100 text-green-800`}>Verified</span>
              </div>
            ): (
              <div className={`ml-2 max-w-xl`}>
                <span className={`px-2 py-0.5 mr-3 inline-flex text-xs leading-4 font-medium rounded bg-red-100 text-red-800`}>Unverified</span>
              </div>
            )}
          </div>
        </div>
        <div className={`my-2 max-w-xl text-sm leading-5 text-gray-500`}>
          <p>
            {!user.settings.disableLocalTime ? (
              <Fragment>
                <strong>Updated last:</strong> <Moment calendar={calendarStrings} date={props.finishedAt} local />&nbsp;
                <Moment date={props.finishedAt} format="hh:mm:ss A" local />
              </Fragment>
            ) : (
              <Fragment>
                <strong>Updated last:</strong> <Moment calendar={calendarStrings} date={props.finishedAt} utc />&nbsp;
                <Moment date={props.finishedAt} format="hh:mm:ss A" utc />
              </Fragment>
            )}
          </p>
        </div>
        <div className={`mt-4`}>
        {
          user && user.permissions !== undefined && user.permissions[0] == 'can_start_scan' ? (
            <button
              type={`button`}
              onClick={props.onCrawl}
              className={`mt-3 mr-3 rounded-md shadow-xs sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600`}
            >
              Run Crawler
            </button>
          ) : (
            <button
              disabled={`disabled`}
              type={`button`}
              className={`mt-3 mr-3 rounded-md shadow-xs sm:mt-0 relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600 opacity-50 cursor-not-allowed`}
            >
              Run Crawler
            </button>
          )
        }

        </div>
      </div>
    </SitesOverviewDiv>
  );
}

export default SitesOverview

SitesOverview.propTypes = {}