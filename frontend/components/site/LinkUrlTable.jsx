import { Fragment, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import useSWR from 'swr'
import Cookies from 'js-cookie'
import styled from 'styled-components'
import Moment from 'react-moment'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import Url from 'url-parse'
import Transition from '../../hooks/Transition'
import SiteDangerBadge from '../badges/SiteDangerBadge'
import SiteSuccessBadge from '../badges/SiteSuccessBadge'
import SiteWarningBadge from '../badges/SiteWarningBadge'

const fetcher = async (url) => {
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
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

const LinkUrlTableDiv = styled.tbody`
  a,
  div {
    max-width: 100%;
    display: block;
  }

  .truncate-link {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 7rem;
  }
`
const LinkUrlSlideOverDiv = styled.div`
  .url-links {
    word-break: break-word
  }
`

const LinkUrlTable = (props) => {
  const [openSlideOver, setOpenSlideOver] = useState(false)
  const [copyValue, setCopyValue] = useState(null)
  const [copied, setCopied] = useState(false)

  const userApiEndpoint = "/api/auth/user/"
  const calendarStrings = {
    lastDay: "[Yesterday], dddd",
    sameDay: "[Today], dddd",
    lastWeek: "MMMM DD, YYYY",
    sameElse: "MMMM DD, YYYY",
  }

  const handleUrlCopy = e => {
    setCopyValue(e)
    setCopied(true)
  }

  const { query } = useRouter()
  const { data: linkDetail, error: linkDetailError } = useSWR(
    () =>
      query.id
        ? `/api/site/${query.id}/scan/${props.val.scan_id}/link/${props.val.id}/`
        : null,
    fetcher,
    {
      refreshInterval: 1000,
    }
  )

  const { data: user, error: userError } = useSWR(userApiEndpoint, fetcher)

  if (linkDetailError) return <div>{linkDetailError.message}</div>
  if (userError) return <div>{userError.message}</div>
  if (!linkDetail || !user) return <div>Loading...</div>

  return (
    <Fragment>
      <LinkUrlTableDiv className={`bg-white`}>
        <tr>
          <td
            className={`flex-none px-6 py-4 whitespace-no-wrap border-b border-gray-200`}
          >
            <div className={`flex items-center`}>
              <div>
                <div
                  className={`text-sm leading-5 font-medium text-gray-900`}
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
                <div className={`text-sm leading-5 text-gray-500`}>
                  <button
                    className={`mr-3 outline-none focus:outline-none text-sm leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150`}
                    onClick={(e) => setOpenSlideOver(!openSlideOver)}
                  >
                    Link Details
                  </button>
                </div>
              </div>
            </div>
          </td>
          <td
            className={`px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500`}
          >
            {props.val.type === "PAGE"
              ? "Page"
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
            {linkDetail.pages.length !== 0 ? <button className={`mr-3 flex items-center outline-none focus:outline-none text-sm leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150`} onClick={(e) => setOpenSlideOver(!openSlideOver)}><span className={`truncate-link`}>{linkDetail.pages[0] && Url(linkDetail.pages[0].url).pathname !== '' ? Url(linkDetail.pages[0].url).pathname : <em>_domain</em>}</span>&nbsp;{(linkDetail.pages.length - 1) > 0 ? "+" + parseInt(linkDetail.pages.length - 1) : null} {(linkDetail.pages.length - 1) > 1 ? "others" : (linkDetail.pages.length - 1) === 1 ? "other" : null}</button> : ''}
          </td>
          <td
            className={`px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500`}
          >
            {props.val.occurences}
          </td>
        </tr>
      </LinkUrlTableDiv>
      <Transition show={openSlideOver}>
        <LinkUrlSlideOverDiv className={`fixed inset-0 overflow-hidden`}>
          <div className={`absolute inset-0 overflow-hidden`}>
            <Transition
              enter="ease-in-out duration-500"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in-out duration-500"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
            </Transition>
            <section
              className={`absolute inset-y-0 right-0 pl-10 max-w-full flex`}
            >
              <Transition
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <div className={`w-screen max-w-md`}>
                  <div
                    className={`h-full divide-y divide-gray-200 flex flex-col bg-white shadow-xs-xl overflow-y-auto`}
                  >
                    <header
                      className={`space-y-1 py-6 px-4 bg-indigo-700 sm:px-6`}
                    >
                      <div
                        className={`flex items-center justify-between space-x-3`}
                      >
                        <h2
                          className={`text-lg leading-7 font-medium text-white`}
                        >
                          Link Details
                        </h2>
                        <div className={`h-7 flex items-center`}>
                          <button
                            aria-label="Close panel"
                            className={`text-indigo-200 hover:text-white transition ease-in-out duration-150`}
                            onClick={(e) =>
                              setTimeout(
                                () => setOpenSlideOver(!openSlideOver),
                                150
                              )
                            }
                          >
                            <svg
                              className={`h-6 w-6`}
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div>
                        <p className={`text-sm leading-5 text-indigo-300`}>
                          Created at: <br />
                          {!user.settings.disableLocalTime ? (
                            <Fragment>
                              <Moment
                                calendar={calendarStrings}
                                date={props.val.created_at}
                                local
                              />
                              &nbsp;
                              <Moment
                                date={props.val.created_at}
                                format="hh:mm:ss A"
                                local
                              />
                            </Fragment>
                          ) : (
                            <Fragment>
                              <Moment
                                calendar={calendarStrings}
                                date={props.val.created_at}
                                utc
                              />
                              &nbsp;
                              <Moment
                                date={props.val.created_at}
                                format="hh:mm:ss A"
                                utc
                              />
                            </Fragment>
                          )}
                        </p>
                      </div>
                    </header>
                    <div className={`relative flex-1 py-6 px-4 sm:px-6`}>
                      <div>
                        <dl className={`grid col-gap-4 row-gap-8`}>
                          <div>
                            <dt
                              className={`text-sm leading-5 font-medium text-gray-500`}
                            >
                              Link URL
                            </dt>
                            <dd
                              className={`mt-1 text-sm leading-5 text-gray-900`}
                            >
                              <a
                                href={`${props.val.url}`}
                                target={`_blank`}
                                title={`${props.val.url}`}
                                className={`block mr-3 text-sm leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150 url-links`}
                              >
                                {props.val.url}
                              </a>
                            </dd>
                          </div>
                          <div>
                            <dt
                              className={`text-sm leading-5 font-medium text-gray-500`}
                            >
                              URL Type
                            </dt>
                            <dd
                              className={`mt-1 text-sm leading-5 text-gray-900`}
                            >
                              <p className={`text-sm leading-5 text-gray-500`}>
                                {props.val.type === "PAGE"
                                  ? "Page"
                                  : props.val.type === "EXTERNAL"
                                  ? "External"
                                  : "Other"}
                              </p>
                            </dd>
                          </div>
                          <div>
                            <dt
                              className={`text-sm leading-5 font-medium text-gray-500`}
                            >
                              Status
                            </dt>
                            <dd
                              className={`mt-2 text-sm leading-5 text-gray-900`}
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
                            </dd>
                          </div>
                          <div>
                            <dt
                              className={`text-sm leading-5 font-medium text-gray-500`}
                            >
                              Occurences
                            </dt>
                            <dd
                              className={`mt-2 text-sm leading-5 text-gray-900`}
                            >
                              <p className={`text-sm leading-5 text-gray-500`}>
                                {props.val.occurences}
                              </p>
                            </dd>
                          </div>
                          <div>
                            <dt
                              className={`text-sm leading-5 font-medium text-gray-500`}
                            >
                              Link Locations ({linkDetail.pages.length})
                            </dt>
                            <dd
                              className={`mt-1 text-sm leading-5 text-gray-900`}
                            >
                              <ul className={`url-links mt-3`}>
                                {linkDetail.pages.map((val, key) => {
                                  return (
                                    <li
                                      key={key}
                                      className={`border border-gray-200 mb-3 pt-1 block text-sm leading-5`}
                                    >
                                      <div
                                        className={`w-full px-3 pt-1 flex-1 flex items-center`}
                                      >
                                        <svg
                                          className={`flex-shrink-0 h-5 w-5 text-gray-400`}
                                          fill="none"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          strokeWidth="2"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                        >
                                          <path
                                            fillRule="evenodd"
                                            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                                            clipRule="evenodd"
                                          />
                                        </svg>
                                        <span
                                          className={`ml-2 flex-1 w-0 break-words`}
                                        >
                                          <a
                                            href={val.url}
                                            target={`_blank`}
                                            title={val.url}
                                            className={`block p-2 font-medium text-indigo-600 hover:text-indigo-500 transition duration-150 ease-in-out`}
                                          >
                                            {val.url}
                                          </a>
                                        </span>
                                      </div>
                                      <div
                                        className={`w-full mt-2 border-t border-gray-200 flex-shrink-0`}
                                      >
                                        <div
                                          className={`flex justify-center items-center`}
                                        >
                                          <CopyToClipboard
                                            onCopy={handleUrlCopy}
                                            text={val.url}
                                          >
                                            <button
                                              className={`w-full block text-center p-1 text-xs leading-5 font-medium text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150`}
                                            >
                                              {copied && copyValue === val.url
                                                ? "Copied!"
                                                : "Copy URL"}
                                            </button>
                                          </CopyToClipboard>
                                        </div>
                                      </div>
                                    </li>
                                  )
                                })}
                              </ul>
                            </dd>
                          </div>
                        </dl>
                      </div>
                    </div>
                    <div
                      className={`flex-shrink-0 px-4 py-4 space-x-4 flex justify-end`}
                    >
                      <span className={`inline-flex rounded-md shadow-xs-sm`}>
                        <button
                          className={`inline-flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-xs-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out`}
                          onClick={(e) =>
                            setTimeout(
                              () => setOpenSlideOver(!openSlideOver),
                              150
                            )
                          }
                        >
                          Close Window
                        </button>
                      </span>
                    </div>
                  </div>
                </div>
              </Transition>
            </section>
          </div>
        </LinkUrlSlideOverDiv>
      </Transition>
    </Fragment>
  )
}

export default LinkUrlTable

LinkUrlTable.propTypes = {}
