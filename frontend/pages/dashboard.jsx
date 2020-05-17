import React from 'react'
import Head from 'next/head'
import styled from 'styled-components'
import Avatar from '../src/components/avatar'
import DashboardMenu from '../src/components/dashboard-menu'
import MobileMenuDropdown from '../src/components/mobile-menu-dropdown'
import Notifications from '../src/components/notifications'

const DashboardDiv = styled.section``

const Dashboard = () => {
  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>

      <DashboardDiv>
        <div className={`bg-gray-800 pb-32`}>
          <div className={`container mx-auto`}>
            <nav className={`bg-gray-800`}>
              <div className={`max-w-7xl mx-auto sm:px-6 lg:px-8`}>
                <div className={`border-b border-gray-700`}>
                  <div className={`flex items-center justify-between h-16 px-4 sm:px-0`}>
                    <div className={`flex items-center`}>
                      <div className={`flex-shrink-0`}>
                        <img className={`h-8 w-8`} src="/img/logos/workflow-mark-on-dark.svg" alt="Workflow logo" />
                      </div>

                      <DashboardMenu />
                    </div>
                    <div className={`hidden md:block`}>
                      <div className={`ml-4 flex items-center md:ml-6`}>
                        <button 
                          className={`p-1 border-2 border-transparent text-gray-400 rounded-full hover:text-white focus:outline-none focus:text-white focus:bg-gray-700`}
                          aria-label={`Notifications`}
                        >
                          <svg className={`h-6 w-6`} stroke={`currentColor`} fill={`none`} viewBox={`0 0 24 24`}>
                            <path strokeLinecap={`round`} strokeLinejoin={`round`} strokeWidth={`2`} d={`M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9`} />
                          </svg>
                        </button>

                        <Avatar />
                      </div>
                    </div>
                    <div className={`-mr-2 flex md:hidden`}>
                      {/* Mobile menu button  */}
                      <button className={`inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:bg-gray-700 focus:text-white`}>
                        {/* Menu open: "hidden", Menu closed: "block" */}
                        <svg className={`block h-6 w-6`} stroke={`currentColor`} fill={`none`} viewBox={`0 0 24 24`}>
                          <path strokeLinecap={`round`} strokeLinejoin={`round`} strokeWidth={`2`} d={`M4 6h16M4 12h16M4 18h16`} />
                        </svg>
                        {/* Menu open: "block", Menu closed: "hidden" */}
                        <svg className={`hidden h-6 w-6`} stroke={`currentColor`} fill={`none`} viewBox={`0 0 24 24`}>
                          <path strokeLinecap={`round`} strokeLinejoin={`round`} strokeWidth={`2`} d={`M6 18L18 6M6 6l12 12`} />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <Notifications />
              <MobileMenuDropdown />
            </nav>
          </div>
        </div>

        <div className={`container mx-auto`}>
          <main className={`-mt-20`}>
            <div className={`max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8`}>
              {/* Replace with your content */}
              <div className={`bg-white rounded-lg shadow px-5 py-6 sm:px-6`}>
                <div className={`border-4 border-dashed border-gray-200 rounded-lg h-64`}></div>
              </div>
              {/* /End replace */}
            </div>
          </main>
        </div>
      </DashboardDiv>
    </>
  )
}

export default Dashboard
