import { Fragment } from 'react'
import Cookies from 'js-cookie'
import useSWR from 'swr'
import styled from 'styled-components'
import Moment from 'react-moment'
import Skeleton from 'react-loading-skeleton'
import SiteSuccessStatus from 'components/status/SiteSuccessStatus'
import SiteWarningStatus from 'components/status/SiteWarningStatus'
import SiteDangerStatus from 'components/status/SiteDangerStatus'

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

const SitesOverviewDiv = styled.div`
  height: 100%;
  min-height: 25rem;
`

const SitesOverview = props => {
  const userApiEndpoint = '/api/auth/user/'
  const calendarStrings = {
    lastDay : '[Yesterday], dddd',
    sameDay : '[Today], dddd',
    lastWeek : 'MMMM DD, YYYY',
    sameElse : 'MMMM DD, YYYY'
  }

  const { data: user, error: userError } = useSWR(userApiEndpoint, fetcher)

  if (userError) return <div>{userError.message}</div>
  if (!user) {
    return (
      <Skeleton width={280} height={198} duration={2} />
    )
  }

  return (
    <Fragment>
      <style jsx>{`
        .btn-crawler {
          top: 0;
          right: 0;
          padding: 2.25rem 1.5rem;
        }
      `}</style>
      <div className={`btn-crawler absolute mt-4`}>
        {
          user.group.id !== 1 ? (
            props.crawlable ? (
              <button
                type={`button`}
                onClick={props.onCrawl}
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
      <SitesOverviewDiv>
        <div className={`bg-white overflow-hidden shadow-xs rounded-lg h-full`}>
          <div className={`px-4 py-5 sm:p-6`}>
            <h2 className={`text-lg font-bold leading-7 text-gray-900 mb-5`}>Site Status</h2>
            <dl className={`mb-8 max-w-xl text-sm leading-5`}>
              {!user.settings.disableLocalTime ? (
                <Fragment>
                  <dt className={`text-sm leading-5 font-medium text-gray-500`}>
                    Last Crawled
                  </dt>
                  <dd className={`mt-1 text-sm leading-5 text-gray-900`}>
                    <Moment calendar={calendarStrings} date={props.finishedAt} local />&nbsp;
                    <Moment date={props.finishedAt} format="hh:mm:ss A" local />
                  </dd>
                </Fragment>
              ) : (
                <Fragment>
                  <dt className={`text-sm leading-5 font-medium text-gray-500`}>
                    Last Crawled
                  </dt>
                  <dd className={`mt-1 text-sm leading-5 text-gray-900`}>
                    <Moment calendar={calendarStrings} date={props.finishedAt} utc />&nbsp;
                    <Moment date={props.finishedAt} format="hh:mm:ss A" utc />
                  </dd>
                </Fragment>
              )}
            </dl>
            <dl className={`grid grid-cols-1 col-gap-4 row-gap-8 sm:grid-cols-2`}>
              <div className={`sm:col-span-1`}>
                <dt className={`text-sm leading-5 font-medium text-gray-500`}>
                  Site Status
                </dt>
                <dd className={`mt-1 text-sm leading-5 text-gray-900`}>
                  {
                    props.verified ? <SiteSuccessStatus text={`Verified`} /> : <SiteDangerStatus text={`Unverified`} />
                  }
                </dd>
              </div>
              <div className={`sm:col-span-1`}>
                <dt className={`text-sm leading-5 font-medium text-gray-500`}>
                  SSL Valid
                </dt>
                <dd className={`mt-1 text-sm leading-5 text-gray-900`}>
                  <SiteDangerStatus 
                    text={`Not Valid`}
                  />
                </dd>
              </div>
              <div className={`sm:col-span-1`}>
                <dt className={`text-sm leading-5 font-medium text-gray-500`}>
                  Forced HTTPS
                </dt>
                <dd className={`mt-1 text-sm leading-5 text-gray-900`}>
                  <SiteDangerStatus 
                    text={`Not Forced HTTPS`}
                  />
                </dd>
              </div>
              <div className={`sm:col-span-1`}>
                <dt className={`text-sm leading-5 font-medium text-gray-500`}>
                  Crawl Status
                </dt>
                <dd className={`mt-1 text-sm leading-5 text-gray-900`}>
                  {
                    props.crawlFinished ? <SiteSuccessStatus text={`Finished`} /> : <SiteWarningStatus text={`In Progress`} />
                  }
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </SitesOverviewDiv>
    </Fragment>
  );
}

export default SitesOverview

SitesOverview.propTypes = {}