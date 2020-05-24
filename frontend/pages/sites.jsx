import Head from 'next/head'
import styled from 'styled-components'
import DashboardMobilePrimaryMenu from '../src/components/dashboard/mobile-primary-menu'
import DashboardPrimaryMenu from '../src/components/dashboard/primary-menu'

const SitesDiv = styled.section``

const Sites = () => {
  return (
    <>
      <Head>
        <title>Sites</title>
      </Head>

      <SitesDiv>
        <div className={`h-screen flex overflow-hidden bg-gray-100`}>
          <div className={`md:hidden`}>
            <div className={`fixed inset-0 flex z-40`}>
              <div className={`fixed inset-0`}>
                <div
                  className={`absolute inset-0 bg-gray-600 opacity-75`}
                ></div>
              </div>
              <div
                className={`relative flex-1 flex flex-col max-w-xs w-full bg-white`}
              >
                <div className={`absolute top-0 right-0 -mr-14 p-1`}>
                  <button
                    className={`flex items-center justify-center h-12 w-12 rounded-full focus:outline-none focus:bg-gray-600`}
                    aria-label={`Close sidebar`}
                  >
                    <svg
                      className={`h-6 w-5 text-white`}
                      stroke={`currentColor`}
                      fill={`none`}
                      viewBox={`0 0 24 24`}
                    >
                      <path
                        strokeLinecap={`round`}
                        strokeLinejoin={`round`}
                        strokeWidth={`2`}
                        d={`M6 18L18 6M6 6l12 12`}
                      />
                    </svg>
                  </button>
                </div>
                <div className={`flex-1 h-0 pt-5 pb-4 overflow-y-auto`}>
                  <div className={`flex-shrink-0 flex items-center px-4`}>
                    <img
                      className={`h-8 w-auto`}
                      src={`/img/logos/workflow-logo-on-white.svg`}
                      alt={`Workflow`}
                    />
                  </div>
                  <DashboardMobilePrimaryMenu />
                </div>
                <div
                  className={`flex-shrink-0 flex border-t border-gray-200 p-4`}
                >
                  <a
                    href={`#`}
                    className={`flex-shrink-0 group block focus:outline-none`}
                  >
                    <div className={`flex items-center`}>
                      <div>
                        <img
                          className={`inline-block h-10 w-10 rounded-full`}
                          src={`https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80`}
                          alt={``}
                        />
                      </div>
                      <div className={`ml-3`}>
                        <p
                          className={`text-base leading-6 font-medium text-gray-700 group-hover:text-gray-900`}
                        >
                          Tom Cook
                        </p>
                        <p
                          className={`text-sm leading-5 font-medium text-gray-500 group-hover:text-gray-700 group-focus:underline transition ease-in-out duration-150`}
                        >
                          View profile
                        </p>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
              <div className={`flex-shrink-0 w-14`}>
                {/* Force sidebar to shrink to fit close icon */}
              </div>
            </div>
          </div>

          <div className={`hidden md:flex md:flex-shrink-0`}>
            <div
              className={`flex flex-col w-64 border-r border-gray-200 bg-white`}
            >
              <div
                className={`h-0 flex-1 flex flex-col pt-5 pb-4 overflow-y-auto`}
              >
                <div className={`flex items-center flex-shrink-0 px-4`}>
                  <img
                    className={`h-8 w-auto`}
                    src={`/img/logos/workflow-logo-on-white.svg`}
                    alt={`Workflow`}
                  />
                </div>
                <DashboardPrimaryMenu />
              </div>
              <div
                className={`flex-shrink-0 flex border-t border-gray-200 p-4`}
              >
                <a href={`#`} className={`flex-shrink-0 w-full group block`}>
                  <div className={`flex items-center`}>
                    <div>
                      <img
                        className={`inline-block h-10 w-10 rounded-full`}
                        src={`https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80`}
                        alt={``}
                      />
                    </div>
                    <div className={`ml-3`}>
                      <p
                        className={`text-sm leading-5 font-medium text-gray-700 group-hover:text-gray-900`}
                      >
                        Tom Cook
                      </p>
                      <p
                        className={`text-xs leading-4 font-medium text-gray-500 group-hover:text-gray-700 transition ease-in-out duration-150`}
                      >
                        View profile
                      </p>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
          <div className={`flex flex-col w-0 flex-1 overflow-hidden`}>
            <div className={`md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3`}>
              <button
                className={`-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:bg-gray-200 transition ease-in-out duration-150`}
                aria-label={`Open sidebar`}
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
              <div className={`max-w-7xl mx-auto px-4 sm:px-6 md:px-8`}>
                <h1 className={`text-2xl font-semibold text-gray-900`}>
                  Sites
                </h1>
              </div>
              <div className={`max-w-7xl mx-auto px-4 sm:px-6 md:px-8`}>
                {/* Replace with your content */}
                <div className={`py-4`}>
                  <div
                    className={`bg-white px-4 py-5 border-b border-gray-200 sm:px-6 bg-white overflow-hidden sm:rounded-lg sm:shadow`}
                  >
                    <div
                      className={`-ml-4 -mt-2 flex items-center justify-between flex-wrap sm:flex-no-wrap`}
                    >
                      <div className={`ml-4 mt-2 w-64`}>
                        <div>
                          <div className={`mt-1 relative rounded-md shadow-sm`}>
                            <div
                              className={`absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none`}
                            >
                              <svg
                                className={`h-5 w-5 text-gray-400`}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <input
                              id="email"
                              className={`form-input block w-full pl-10 sm:text-sm sm:leading-5`}
                              placeholder="Search sites..."
                            />
                          </div>
                        </div>
                      </div>
                      <div className={`ml-4 mt-2 flex-shrink-0`}>
                        <span className={`inline-flex rounded-md shadow-sm`}>
                          <button
                            type="button"
                            className={`relative inline-flex items-center px-4 py-2 border border-transparent text-sm leading-5 font-medium rounded-md text-white bg-green-600 hover:bg-indigo-500 focus:outline-none focus:shadow-outline-indigo focus:border-indigo-700 active:bg-indigo-700`}
                          >
                            Add new site
                          </button>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`py-4`}>
                  <div className={`flex flex-col`}>
                    <div
                      className={`-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8`}
                    >
                      <div
                        className={`align-middle inline-block min-w-full shadow overflow-hidden sm:rounded-lg border-gray-200`}
                      >
                        <table className={`min-w-full`}>
                          <thead>
                            <tr>
                              <th
                                className={`px-6 py-3 border-b border-gray-200 bg-white text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider`}
                              >
                                Site Details
                              </th>
                              <th
                                className={`px-6 py-3 border-b border-gray-200 bg-white text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider`}
                              >
                                Last Crawled
                              </th>
                              <th
                                className={`px-6 py-3 border-b border-gray-200 bg-white text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider`}
                              >
                                Site Status
                              </th>
                              <th
                                className={`px-6 py-3 border-b border-gray-200 bg-white text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider`}
                              >
                                Issues Found
                              </th>
                              <th
                                className={`px-6 py-3 border-b border-gray-200 bg-white`}
                              ></th>
                            </tr>
                          </thead>
                          <tbody className={`bg-white`}>
                            <tr>
                              <td
                                className={`px-6 py-4 whitespace-no-wrap border-b border-gray-200`}
                              >
                                <div className={`flex items-center`}>
                                  <div className={`flex-shrink-0 h-10 w-10`}>
                                    <img
                                      className={`h-10 w-10 rounded-full`}
                                      src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                      alt=""
                                    />
                                  </div>
                                  <div className={`ml-4`}>
                                    <div
                                      className={`text-sm leading-5 font-medium text-gray-900`}
                                    >
                                      Website Name
                                    </div>
                                    <div
                                      className={`text-sm leading-5 text-gray-500`}
                                    >
                                      Website Owner
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td
                                className={`px-6 py-4 whitespace-no-wrap border-b border-gray-200`}
                              >
                                <div
                                  className={`text-sm leading-5 text-gray-900`}
                                >
                                  July 22, 2020
                                </div>
                                <div
                                  className={`text-sm leading-5 text-gray-500`}
                                >
                                  08:50 AM{" "}
                                  <span className={`font-medium`}>(GMT)</span>
                                </div>
                              </td>
                              <td
                                className={`px-6 py-4 whitespace-no-wrap border-b border-gray-200`}
                              >
                                <span
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800`}
                                >
                                  Active
                                </span>
                              </td>
                              <td
                                className={`px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500`}
                              >
                                50
                                <svg
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  className={`inline-block ml-1 h-5 w-5 text-green-400`}
                                >
                                  <path
                                    d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                    fillRule="evenodd"
                                  ></path>
                                </svg>
                              </td>
                              <td
                                className={`px-6 py-4 whitespace-no-wrap text-right border-b border-gray-200 text-sm leading-5 font-medium`}
                              >
                                <a
                                  href="#"
                                  className={`text-indigo-600 hover:text-indigo-900`}
                                >
                                  View Site
                                </a>
                              </td>
                            </tr>
                            <tr>
                              <td
                                className={`px-6 py-4 whitespace-no-wrap border-b border-gray-200`}
                              >
                                <div className={`flex items-center`}>
                                  <div className={`flex-shrink-0 h-10 w-10`}>
                                    <img
                                      className={`h-10 w-10 rounded-full`}
                                      src="https://images.unsplash.com/photo-1505503693641-1926193e8d57?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                      alt=""
                                    />
                                  </div>
                                  <div className={`ml-4`}>
                                    <div
                                      className={`text-sm leading-5 font-medium text-gray-900`}
                                    >
                                      Website Name
                                    </div>
                                    <div
                                      className={`text-sm leading-5 text-gray-500`}
                                    >
                                      Website Owner
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td
                                className={`px-6 py-4 whitespace-no-wrap border-b border-gray-200`}
                              >
                                <div
                                  className={`text-sm leading-5 text-gray-900`}
                                >
                                  July 20, 2020
                                </div>
                                <div
                                  className={`text-sm leading-5 text-gray-500`}
                                >
                                  08:50 AM{" "}
                                  <span className={`font-medium`}>(GMT)</span>
                                </div>
                              </td>
                              <td
                                className={`px-6 py-4 whitespace-no-wrap border-b border-gray-200`}
                              >
                                <span
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800`}
                                >
                                  Inactive
                                </span>
                              </td>
                              <td
                                className={`px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5 text-gray-500`}
                              >
                                100
                                <svg
                                  fill="currentColor"
                                  viewBox="0 0 24 24"
                                  className={`inline-block ml-1 h-5 w-5 text-red-400`}
                                >
                                  <path
                                    d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
                                    clipRule="evenodd"
                                    fillRule="evenodd"
                                  ></path>
                                </svg>
                              </td>
                              <td
                                className={`px-6 py-4 whitespace-no-wrap text-right border-b border-gray-200 text-sm leading-5 font-medium`}
                              >
                                <a
                                  href="#"
                                  className={`text-indigo-600 hover:text-indigo-900`}
                                >
                                  View Site
                                </a>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`py-4`}>
                  <nav className={`bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 sm:rounded-lg`}>
                    <div className={`hidden sm:block`}>
                      <p className={`text-sm leading-5 text-gray-700`}>
                        Showing
                        <span className={`font-medium`}>&nbsp;1&nbsp;</span>
                        to
                        <span className={`font-medium`}>&nbsp;10&nbsp;</span>
                        of
                        <span className={`font-medium`}>&nbsp;20&nbsp;</span>
                        results
                      </p>
                    </div>
                    <div className={`flex-1 flex justify-between sm:justify-end`}>
                    <a href="#" className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150`}>
                        Previous
                    </a>
                    <a href="#" className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-md text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150`}>
                        Next
                    </a>
                    </div>
                  </nav>
                </div>

                {/* /End replace */}
              </div>
            </main>
          </div>
        </div>
      </SitesDiv>
    </>
  )
}

export default Sites