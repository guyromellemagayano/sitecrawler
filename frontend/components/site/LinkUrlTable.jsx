import { Fragment, useState } from "react"
import { useRouter } from "next/router"
import useSWR from "swr"
import Cookies from "js-cookie"
import styled from "styled-components"
import Moment from "react-moment"
import SiteDangerBadge from "../badges/SiteDangerBadge"
import SiteSuccessBadge from "../badges/SiteSuccessBadge"
import SiteWarningBadge from "../badges/SiteWarningBadge"
import Transition from "../../hooks/Transition"

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
  .truncate {
    max-width: 20rem
  }
`
const LinkUrlSlideOverDiv = styled.div``

const LinkUrlTable = (props) => {
  const [openSlideOver, setOpenSlideOver] = useState(false)

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

  if (linkDetailError) return <div>{linkDetailError.message}</div>
  if (!linkDetail) return <div>Loading...</div>

  const calendarStrings = {
    lastDay: "[Yesterday], dddd",
    sameDay: "[Today], dddd",
    lastWeek: "MMMM DD, YYYY",
    sameElse: "MMMM DD, YYYY",
  }

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
                  className={`text-sm leading-5 font-medium text-gray-900 truncate`}
                >
                  {props.val.url}
                </div>
                <div className={`text-sm leading-5 text-gray-500`}>
                  <a
                    href={`${props.val.url}`}
                    target={`_blank`}
                    title={`${props.val.url}`}
                    className={`mr-3 text-sm leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150`}
                  >
                    Visit Link
                  </a>
                  <button
                    className={`outline-none focus:outline-none text-sm leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150`}
                    onClick={(e) => setOpenSlideOver(!openSlideOver)}
                  >
                    Check Details
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
            /fat-cat/
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
            <section
              className={`absolute inset-y-0 right-0 pl-10 max-w-full flex`}
            >
              {/*
                Slide-over panel, show/hide based on slide-over state.

                Entering: "transform transition ease-in-out duration-500 sm:duration-700"
                  From: "translate-x-full"
                  To: "translate-x-0"
                Leaving: "transform transition ease-in-out duration-500 sm:duration-700"
                  From: "translate-x-0"
                  To: "translate-x-full"
              */}
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
                    className={`h-full divide-y divide-gray-200 flex flex-col bg-white shadow-xl overflow-y-auto`}
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
                            onClick={(e) => setOpenSlideOver(!openSlideOver)}
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
                          Created at:{" "}
                          <Moment
                            calendar={calendarStrings}
                            date={props.val.created_at}
                            utc
                          />
                        </p>
                      </div>
                    </header>
                    <div className={`relative flex-1 py-6 px-4 sm:px-6`}>
                      <div className={`px-4 py-5 sm:px-6`}>
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
                                className={`block mr-3 text-sm leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150`}
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
                              Link Location
                            </dt>
                            <dd
                              className={`mt-2 text-sm leading-5 text-gray-900`}
                            >
                              {/* Start Link Location URL here */}
                              {/* End Link Location URL here */}
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
                              <ul>
                                {linkDetail.pages.map((val, key) => {
                                  return (
                                    <li key={key} className={`my-2`}>
                                      <a
                                        href={`${props.val.url}`}
                                        target={`_blank`}
                                        title={`${props.val.url}`}
                                        className={`block mr-3 text-sm leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150`}
                                      >
                                        {val.url}
                                      </a>
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
                      className={`flex-shrink-0 px-4 py-4 space-x-4 flex justify-center`}
                    >
                      <span className={`inline-flex rounded-md shadow-sm`}>
                        <button
                          type="submit"
                          className={`inline-flex justify-center py-2 px-4 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition duration-150 ease-in-out`}
                          onClick={(e) => setOpenSlideOver(!openSlideOver)}
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
