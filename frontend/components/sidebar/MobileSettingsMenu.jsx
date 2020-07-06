import { Fragment } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import styled from 'styled-components'
import SettingsPages from '../../public/data/settings-pages.json'

const PrimaryMenuDiv = styled.nav`
  a:first-child {
    margin-bottom: 1rem;
  }
`

const PrimaryMenu = () => {
  return (
    <PrimaryMenuDiv className={`mt-5 flex-1 px-2 bg-white`}>
      {
        SettingsPages.map((val, key) => {
          return (
            <Fragment key={key}>
              <Link href={val.url}>
                <a
                  className={`${useRouter().pathname === val.url ? "group mt-1 flex items-center px-2 py-2 text-sm leading-5 font-medium text-gray-900 rounded-md bg-gray-100 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:bg-gray-200 transition ease-in-out duration-150" : "mt-1 group flex items-center px-2 py-2 text-sm leading-5 font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition ease-in-out duration-150"}`}
                >
                  <svg
                    className={`mr-3 h-6 w-5 text-gray-400 group-hover:text-gray-500 group-focus:text-gray-500 transition ease-in-out duration-150`}
                    stroke={`currentColor`}
                    fill={`none`}
                    viewBox={`0 0 24 24`}
                  >
                    <path
                      strokeLinecap={`round`}
                      strokeLinejoin={`round`}
                      strokeWidth={`2`}
                      d={val.icon}
                    />
                  </svg>
                  {val.title}
                </a>
              </Link>
            </Fragment>
          )
        })
      }
      {
        <Link href="/logout">
          <a
            className={`mt-1 group flex items-center px-2 py-2 text-sm leading-5 font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition ease-in-out duration-150`}
          >
            <svg
              className={`mr-3 h-6 w-5 text-gray-400 group-hover:text-gray-500 group-focus:text-gray-500 transition ease-in-out duration-150`}
              stroke={`currentColor`}
              fill={`none`}
              viewBox={`0 0 24 24`}
            >
              <path
                strokeLinecap={`round`}
                strokeLinejoin={`round`}
                strokeWidth={`2`}
                d={`M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1`}
              />
            </svg>
            Sign Out
          </a>
        </Link>
      }
    </PrimaryMenuDiv>
  );
}

export default PrimaryMenu