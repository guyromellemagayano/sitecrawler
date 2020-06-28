import { Fragment } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import styled from 'styled-components'
import DashboardPages from '../../public/data/dashboard-pages.json'

const MobilePrimaryMenuDiv = styled.nav``

const MobilePrimaryMenu = () => {
  return (
    <MobilePrimaryMenuDiv className={`mt-5 flex-1 px-2 bg-white`}>
      {
        DashboardPages.map((val, key) => {
          return (
            <Fragment key={key}>
              <Link href={val.url} as={val.url + "/"}>
                <a
                  className={`${useRouter().pathname === val.url ? "group mt-1 flex items-center px-2 py-2 text-base leading-6 font-medium text-gray-900 rounded-md bg-gray-100 focus:outline-none focus:bg-gray-200 transition ease-in-out duration-150" : "mt-1 group flex items-center px-2 py-2 text-base leading-6 font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:text-gray-900 focus:bg-gray-100 transition ease-in-out duration-150"}`}
                >
                  <svg
                    className={`mr-4 h-6 w-5 text-gray-400 group-hover:text-gray-500 group-focus:text-gray-500 transition ease-in-out duration-150`}
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
    </MobilePrimaryMenuDiv>
  );
}

export default MobilePrimaryMenu