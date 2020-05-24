import { useState } from 'react'
import Head from 'next/head'
import styled from 'styled-components'
import DashboardMobilePrimaryMenu from '../src/components/dashboard/mobile-primary-menu'
import DashboardPrimaryMenu from '../src/components/dashboard/primary-menu'

const DashboardDiv = styled.section``

const Dashboard = () => {
  const [openMenu, setOpenMenu] = useState(false)

  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>

      <DashboardDiv>
        <div className={`h-screen flex overflow-hidden bg-white`}>
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
                  Dashboard
                </h1>
              </div>
              <div className={`max-w-7xl mx-auto px-4 sm:px-6 md:px-8`}>
                {/* Replace with your content */}
                <div className={`py-4`}>
                  <div
                    className={`border-4 border-dashed border-gray-200 rounded-lg h-64`}
                  ></div>
                </div>
                {/* /End replace */}
              </div>
            </main>
          </div>
        </div>
      </DashboardDiv>
    </>
  )
}

export default Dashboard
