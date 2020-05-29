import Cookies from 'js-cookie'
import Link from 'next/link'
import styled from 'styled-components'
import fetchJson from '../../hooks/fetch-json'
import useUser from '../../hooks/use-user'
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

          <button
            className={`block w-2/12 items-center text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600`}
            onClick={async (e) => {
              e.preventDefault();

              await mutateUser(
                fetchJson("/api/auth/logout/", {
                  method: 'POST',
                  headers: {
                    'Accept': "application/json",
                    "Content-Type": "application/json",
                    "X-CSRFToken": Cookies.get("csrftoken"),
                  },
                })
              );
              
              router.push("/login");
            }}
          >
            <svg
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
            </svg>
          </button>
        </div>
      </div>
    </MainSidebarDiv>
  );
}

export default MainSidebar