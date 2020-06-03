import { Fragment } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import styled from 'styled-components'
import PrimaryMenu from './primary-menu'
import SiteMenu from './site-menu'

const DynamicComponentWithNoSSR = dynamic(
  () => import('window'),
  { ssr: false }
)

const MainSidebarDiv = styled.aside``

const MainSidebar = () => {  
  return (
    <Fragment>
      {/* <DynamicComponentWithNoSSR /> */}
      <MainSidebarDiv className={`hidden md:flex md:flex-shrink-0`}>
        <div className={`flex flex-col w-64 border-r border-gray-200 bg-white`}>
          <div className={`h-0 flex-1 flex flex-col pt-5 pb-4 overflow-y-auto`}>
            <div className={`flex items-center flex-shrink-0 px-4`}>
              <img
                className={`h-8 w-auto`}
                src={`/img/logos/workflow-logo-on-white.svg`}
                alt={`Workflow`}
              />
            </div>
            {window.location.href.indexOf("/site/") > -1 ? <SiteMenu /> : <PrimaryMenu />}
          </div>
          <div className={`flex-shrink-0 flex border-t border-gray-200 p-4`}>
            <Link href="/profile">
              <a className={`flex-shrink-0 w-10/12 group block`}>
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
            </Link>
          </div>
        </div>
      </MainSidebarDiv>
    </Fragment>
  )
}

export default MainSidebar