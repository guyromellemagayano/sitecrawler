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
            <div class="bg-gray-50 px-4 py-4 sm:px-6">
              <div class="text-sm leading-5">
                <a
                  href="#"
                  class="font-medium text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150"
                >
                  View all
                </a>
              </div>
            </div>
          </div>

          <div className={`bg-white overflow-hidden shadow rounded-lg`}>
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
            <div class="bg-gray-50 px-4 py-4 sm:px-6">
              <div class="text-sm leading-5">
                <a
                  href="#"
                  class="font-medium text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150"
                >
                  View all
                </a>
              </div>
            </div>
          </div>

          <div className={`bg-white overflow-hidden shadow rounded-lg`}>
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
            <div class="bg-gray-50 px-4 py-4 sm:px-6">
              <div class="text-sm leading-5">
                <a
                  href="#"
                  class="font-medium text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150"
                >
                  View all
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className={`mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2`}>
          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="border-b border-gray-200 px-4 py-5 sm:px-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                Issue Types
              </h3>
            </div>
            <div class="px-4 py-5 sm:p-6 xl:p-0 xl:pt-0">
              <ul>
                <li>
                  <a
                    href="#"
                    class="block hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition duration-150 ease-in-out"
                  >
                    <div class="flex items-center px-4 py-4 sm:px-6">
                      <div class="min-w-0 flex-1 flex items-center">
                        <div class="min-w-0 flex-1">
                          <div>
                            <div class="text-sm leading-5 font-medium text-indigo-600 truncate">
                              404 Not Found
                            </div>
                            <div class="mt-2 flex items-center text-sm leading-5 text-gray-500">
                              <span class="truncate">10 Errors found</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <svg
                          class="h-5 w-5 text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </a>
                </li>
                <li class="border-t border-gray-200">
                  <a
                    href="#"
                    class="block hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition duration-150 ease-in-out"
                  >
                    <div class="flex items-center px-4 py-4 sm:px-6">
                      <div class="min-w-0 flex-1 flex items-center">
                        <div class="min-w-0 flex-1">
                          <div>
                            <div class="text-sm leading-5 font-medium text-indigo-600 truncate">
                              Host Not Found
                            </div>
                            <div class="mt-2 flex items-center text-sm leading-5 text-gray-500">
                              <span class="truncate">10 Errors found</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <svg
                          class="h-5 w-5 text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </a>
                </li>
                <li class="border-t border-gray-200">
                  <a
                    href="#"
                    class="block hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition duration-150 ease-in-out"
                  >
                    <div class="flex items-center px-4 py-4 sm:px-6">
                      <div class="min-w-0 flex-1 flex items-center">
                        <div class="min-w-0 flex-1">
                          <div>
                            <div class="text-sm leading-5 font-medium text-indigo-600 truncate">
                              SSL Error
                            </div>
                            <div class="mt-2 flex items-center text-sm leading-5 text-gray-500">
                              <span class="truncate">10 Errors found</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <svg
                          class="h-5 w-5 text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="border-b border-gray-200 px-4 py-5 sm:px-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                Link Types
              </h3>
            </div>
            <div class="px-4 py-5 sm:p-6 xl:p-0 xl:pt-0">
              <ul>
                <li>
                  <a
                    href="#"
                    class="block hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition duration-150 ease-in-out"
                  >
                    <div class="flex items-center px-4 py-4 sm:px-6">
                      <div class="min-w-0 flex-1 flex items-center">
                        <div class="min-w-0 flex-1">
                          <div>
                            <div class="text-sm leading-5 font-medium text-indigo-600 truncate">
                              Image Files
                            </div>
                            <div class="mt-2 flex items-center text-sm leading-5 text-gray-500">
                              <span class="truncate">10 Image files found</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <svg
                          class="h-5 w-5 text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </a>
                </li>
                <li class="border-t border-gray-200">
                  <a
                    href="#"
                    class="block hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition duration-150 ease-in-out"
                  >
                    <div class="flex items-center px-4 py-4 sm:px-6">
                      <div class="min-w-0 flex-1 flex items-center">
                        <div class="min-w-0 flex-1">
                          <div>
                            <div class="text-sm leading-5 font-medium text-indigo-600 truncate">
                              Host Not Found
                            </div>
                            <div class="mt-2 flex items-center text-sm leading-5 text-gray-500">
                              <span class="truncate">10 Errors found</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <svg
                          class="h-5 w-5 text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </a>
                </li>
                <li class="border-t border-gray-200">
                  <a
                    href="#"
                    class="block hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition duration-150 ease-in-out"
                  >
                    <div class="flex items-center px-4 py-4 sm:px-6">
                      <div class="min-w-0 flex-1 flex items-center">
                        <div class="min-w-0 flex-1">
                          <div>
                            <div class="text-sm leading-5 font-medium text-indigo-600 truncate">
                              SSL Error
                            </div>
                            <div class="mt-2 flex items-center text-sm leading-5 text-gray-500">
                              <span class="truncate">10 Errors found</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <svg
                          class="h-5 w-5 text-gray-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clip-rule="evenodd"
                          />
                        </svg>
                      </div>
                    </div>
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="border-b border-gray-200 px-4 py-5 sm:px-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                Link Schemes
              </h3>
            </div>
            <div class="px-4 py-5 sm:p-6 xl:p-0 xl:pt-0"></div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="border-b border-gray-200 px-4 py-5 sm:px-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                Redirects
              </h3>
            </div>
            <div class="px-4 py-5 sm:p-6 xl:p-0 xl:pt-0"></div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="border-b border-gray-200 px-4 py-5 sm:px-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                Link Directions
              </h3>
            </div>
            <div class="px-4 py-5 sm:p-6 xl:p-0 xl:pt-0"></div>
          </div>

          <div class="bg-white overflow-hidden shadow rounded-lg">
            <div class="border-b border-gray-200 px-4 py-5 sm:px-6">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                Dofollow/Nofollow
              </h3>
            </div>
            <div class="px-4 py-5 sm:p-6 xl:p-0 xl:pt-0"></div>
          </div>
        </div>
      </div>
    </SitesStatsDiv>
  );
}

export default SitesStats