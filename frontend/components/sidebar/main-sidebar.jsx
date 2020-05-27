import React, { useState } from 'react'
import Link from 'next/link'
import styled from 'styled-components'
import fetchJson from '../../lib/fetch-json'
import useUser from '../../lib/use-user'
import { useRouter } from 'next/router'
import PrimaryMenu from './primary-menu'

const MainSidebarDiv = styled.aside``

const MainSidebar = () => {
  const { mutateUser } = useUser()
  const router = useRouter()

  return (
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
          <PrimaryMenu />
        </div>
        <div className={`flex-shrink-0 flex border-t border-gray-200 p-4`}>
          <Link href="/profile">
            <a className={`flex-shrink-0 w-11/12 group block`}>
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

          <button
            className={`flex items-center text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600`}
          >
            <svg className={`h-5 w-5" fill="currentColor" viewBox="0 0 20 20`}>
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>

          <div
            className={`origin-bottom-left absolute bottom-14 left-4 mt-2 w-56 rounded-md shadow-lg`}
          >
            <div className={`rounded-md bg-white shadow-xs`}>
              <div className={`py-1`}>
                <button
                  type="submit"
                  className={`block w-full text-left px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900`}
                  onClick={async (e) => {
                    e.preventDefault();
                    await mutateUser(fetchJson('/api/auth/logout/', { method: 'POST' }));
                    router.push("/login");
                  }}
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainSidebarDiv>
  );
}

export default MainSidebar