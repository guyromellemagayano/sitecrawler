import React from 'react'
import Link from 'next/link'
import styled from 'styled-components'

const SitesStatsDiv = styled.footer``

const SitesStats = () => {
  return (
    <SitesStatsDiv>
      <div>
        <div className={`mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3`}>
          <div className={`bg-white overflow-hidden shadow rounded-lg`}>
            <div className={`px-4 py-5 sm:p-6`}>
              <dl>
                <dt
                  className={`text-sm leading-5 font-medium text-gray-500 truncate`}
                >
                  Total Links
                </dt>
                <dd
                  className={`mt-1 text-3xl leading-9 font-semibold text-gray-900`}
                >
                  1500
                </dd>
              </dl>
            </div>
            <div className={`bg-gray-100 px-4 py-4 sm:px-6`}>
              <div className={`text-sm leading-5`}>
                <a
                  href="#"
                  className={`font-medium text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150`}
                >
                  View all
                </a>
              </div>
            </div>
          </div>

          <div className={`bg-white overflow-hidden shadow rounded-lg opacity-50`}>
            <div className={`px-4 py-5 sm:p-6`}>
              <dl>
                <dt
                  className={`text-sm leading-5 font-medium text-gray-500 truncate`}
                >
                  Links with Issues
                </dt>
                <dd
                  className={`mt-1 text-3xl leading-9 font-semibold text-gray-900`}
                >
                  7
                </dd>
              </dl>
            </div>
            <div className={`bg-gray-100 px-4 py-4 sm:px-6`}>
              <div className={`text-sm leading-5`}>
                <a
                  href="#"
                  disabled={`disabled`}
                  className={`font-medium text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150 cursor-not-allowed`}
                >
                  View all
                </a>
              </div>
            </div>
          </div>

          <div className={`bg-white overflow-hidden shadow rounded-lg opacity-50`}>
            <div className={`px-4 py-5 sm:p-6`}>
              <dl>
                <dt
                  className={`text-sm leading-5 font-medium text-gray-500 truncate`}
                >
                  New Links
                </dt>
                <dd
                  className={`mt-1 text-3xl leading-9 font-semibold text-gray-900`}
                >
                  1481
                </dd>
              </dl>
            </div>
            <div className={`bg-gray-100 px-4 py-4 sm:px-6`}>
              <div className={`text-sm leading-5`}>
                <a
                  href="#"
                  disabled={`disabled`}
                  className={`font-medium text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150 cursor-not-allowed`}
                >
                  View all
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className={`mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3`}>
          <div className={`bg-white overflow-hidden shadow rounded-lg opacity-50`}>
            <div className={`border-b border-gray-200 px-4 py-5 sm:px-6`}>
              <h3 className={`text-lg leading-6 font-medium text-gray-900`}>
                Issue Types
              </h3>
            </div>
            <div className={`px-4 py-5 sm:p-6 xl:p-0 xl:pt-0`}>
              <ul>
                <li>
                  <a
                    href="#"
                    disabled={`disabled`}
                    className={`block transition duration-150 ease-in-out cursor-not-allowed`}
                  >
                    <div className={`flex items-center px-4 py-4 sm:px-6`}>
                      <div className={`min-w-0 flex-1 flex items-center`}>
                        <div className={`min-w-0 flex-1`}>
                          <div>
                            <div className={`text-sm leading-5 font-medium text-indigo-600 truncate`}>
                              404 Not Found
                            </div>
                            <div className={`mt-2 flex items-center text-sm leading-5 text-gray-500`}>
                              <span className={`truncate`}>10 Errors found</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <svg
                          className={`h-5 w-5 text-gray-400`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className={`bg-white overflow-hidden shadow rounded-lg opacity-50`}>
            <div className={`border-b border-gray-200 px-4 py-5 sm:px-6`}>
              <h3 className={`text-lg leading-6 font-medium text-gray-900`}>
                Link Types
              </h3>
            </div>
            <div className={`px-4 py-5 sm:p-6 xl:p-0 xl:pt-0`}>
              <ul>
                <li>
                  <a
                    href="#"
                    disabled={`disabled`}
                    className={`block transition duration-150 ease-in-out cursor-not-allowed`}
                  >
                    <div className={`flex items-center px-4 py-4 sm:px-6`}>
                      <div className={`min-w-0 flex-1 flex items-center`}>
                        <div className={`min-w-0 flex-1`}>
                          <div>
                            <div className={`text-sm leading-5 font-medium text-indigo-600 truncate`}>
                              Image Types
                            </div>
                            <div className={`mt-2 flex items-center text-sm leading-5 text-gray-500`}>
                              <span className={`truncate`}>10 Items found</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <svg
                          className={`h-5 w-5 text-gray-400`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className={`bg-white overflow-hidden shadow rounded-lg opacity-50`}>
            <div className={`border-b border-gray-200 px-4 py-5 sm:px-6`}>
              <h3 className={`text-lg leading-6 font-medium text-gray-900`}>
                Link Schemes
              </h3>
            </div>
            <div className={`px-4 py-5 sm:p-6 xl:p-0 xl:pt-0`}>
              <ul>
                <li>
                  <a
                    href="#"
                    disabled={`disabled`}
                    className={`block transition duration-150 ease-in-out cursor-not-allowed`}
                  >
                    <div className={`flex items-center px-4 py-4 sm:px-6`}>
                      <div className={`min-w-0 flex-1 flex items-center`}>
                        <div className={`min-w-0 flex-1`}>
                          <div>
                            <div className={`text-sm leading-5 font-medium text-indigo-600 truncate`}>
                              https://
                            </div>
                            <div className={`mt-2 flex items-center text-sm leading-5 text-gray-500`}>
                              <span className={`truncate`}>10 Items found</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <svg
                          className={`h-5 w-5 text-gray-400`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className={`bg-white overflow-hidden shadow rounded-lg opacity-50`}>
            <div className={`border-b border-gray-200 px-4 py-5 sm:px-6`}>
              <h3 className={`text-lg leading-6 font-medium text-gray-900`}>
                Redirects
              </h3>
            </div>
            <div className={`px-4 py-5 sm:p-6 xl:p-0 xl:pt-0`}>
              <ul>
                <li>
                  <a
                    href="#"
                    disabled={`disabled`}
                    className={`block transition duration-150 ease-in-out cursor-not-allowed`}
                  >
                    <div className={`flex items-center px-4 py-4 sm:px-6`}>
                      <div className={`min-w-0 flex-1 flex items-center`}>
                        <div className={`min-w-0 flex-1`}>
                          <div>
                            <div className={`text-sm leading-5 font-medium text-indigo-600 truncate`}>
                              Permanent redirect
                            </div>
                            <div className={`mt-2 flex items-center text-sm leading-5 text-gray-500`}>
                              <span className={`truncate`}>10 Items found</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <svg
                          className={`h-5 w-5 text-gray-400`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className={`bg-white overflow-hidden shadow rounded-lg opacity-50`}>
            <div className={`border-b border-gray-200 px-4 py-5 sm:px-6`}>
              <h3 className={`text-lg leading-6 font-medium text-gray-900`}>
                Link Directions
              </h3>
            </div>
            <div className={`px-4 py-5 sm:p-6 xl:p-0 xl:pt-0`}>
              <ul>
                <li>
                  <a
                    href="#"
                    disabled={`disabled`}
                    className={`block transition duration-150 ease-in-out cursor-not-allowed`}
                  >
                    <div className={`flex items-center px-4 py-4 sm:px-6`}>
                      <div className={`min-w-0 flex-1 flex items-center`}>
                        <div className={`min-w-0 flex-1`}>
                          <div>
                            <div className={`text-sm leading-5 font-medium text-indigo-600 truncate`}>
                              Outbound
                            </div>
                            <div className={`mt-2 flex items-center text-sm leading-5 text-gray-500`}>
                              <span className={`truncate`}>10 Items found</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <svg
                          className={`h-5 w-5 text-gray-400`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className={`bg-white overflow-hidden shadow rounded-lg opacity-50`}>
            <div className={`border-b border-gray-200 px-4 py-5 sm:px-6`}>
              <h3 className={`text-lg leading-6 font-medium text-gray-900`}>
                Dofollow/Nofollow
              </h3>
            </div>
            <div className={`px-4 py-5 sm:p-6 xl:p-0 xl:pt-0`}>
              <ul>
                <li>
                  <a
                    href="#"
                    disabled={`disabled`}
                    className={`block transition duration-150 ease-in-out cursor-not-allowed`}
                  >
                    <div className={`flex items-center px-4 py-4 sm:px-6`}>
                      <div className={`min-w-0 flex-1 flex items-center`}>
                        <div className={`min-w-0 flex-1`}>
                          <div>
                            <div className={`text-sm leading-5 font-medium text-indigo-600 truncate`}>
                              Dofollow
                            </div>
                            <div className={`mt-2 flex items-center text-sm leading-5 text-gray-500`}>
                              <span className={`truncate`}>10 Items found</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <svg
                          className={`h-5 w-5 text-gray-400`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </SitesStatsDiv>
  );
}

export default SitesStats