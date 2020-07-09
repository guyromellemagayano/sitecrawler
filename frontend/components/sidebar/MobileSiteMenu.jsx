import { useRouter } from 'next/router'
import Link from 'next/link'
import styled from 'styled-components'
import SitePages from '../../public/data/site-pages.json'

const SiteMenuDiv = styled.nav`
  a:first-child {
    margin-bottom: 1rem;
  }
`

const SiteMenu = () => {
  return (
    <SiteMenuDiv className={`mt-5 flex-1 px-2 bg-white`}>
      {SitePages.map((val, key) => {
        return (
          <Link
            key={key}
            href={
              val.url.indexOf("/dashboard/sites") > -1
                ? val.url
                : "/dashboard/site/" + useRouter().query.id + val.url
            }
          >
            <a
              className={`${
                "/dashboard/site/" + useRouter().query.id + val.url == useRouter().asPath
                  ? "group mt-1 flex items-center px-2 py-2 text-sm leading-5 font-medium text-gray-900 rounded-md bg-gray-100 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:bg-gray-200 transition ease-in-out duration-150"
                  : "mt-1 group flex items-center px-2 py-2 text-sm leading-5 font-medium text-gray-600 rounded-md hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition ease-in-out duration-150"
              }`}
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
                {val.icon2 ? (
                  <path
                    strokeLinecap={`round`}
                    strokeLinejoin={`round`}
                    strokeWidth={`2`}
                    d={val.icon2}
                  />
                ) : null}
              </svg>
              <span className={`truncate`}>{val.title}</span>
            </a>
          </Link>
        );
      })}
    </SiteMenuDiv>
  );
}

export default SiteMenu