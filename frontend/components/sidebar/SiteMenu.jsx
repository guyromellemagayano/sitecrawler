import { useRouter } from 'next/router'
import Link from 'next/link'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import SitePages from '../../config/site-pages.json'

const SiteMenuDiv = styled.nav`
  a:first-child {
    margin-bottom: 1rem;
  }
`

const SiteMenu = props => {
  return (
    <SiteMenuDiv className={`mt-5 flex-1 px-2 bg-white`}>
      {SitePages.map((val, key) => {
        return (
          <Link
            key={key}
            href={
              val.url.indexOf("/sites") > -1
                ? val.url
                : "/site/" + useRouter().query.id + val.url
            }
          >
            <a
              className={`${
                "/site/" + useRouter().query.id + val.url === useRouter().asPath
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
              {val.slug === "all-pages" && props.data.num_pages > 0 ? (
                <span
                  className={`ml-auto inline-block py-0.5 px-3 text-xs leading-4 rounded-full text-gray-600 bg-gray-200 group-hover:bg-gray-200 group-focus:bg-gray-300 transition ease-in-out duration-150`}
                >
                  {props.data.num_pages}
                </span>
              ) : val.slug === "all-links" && props.data.num_links > 0 ? (
                <span
                  className={`ml-auto inline-block py-0.5 px-3 text-xs leading-4 rounded-full text-gray-600 bg-gray-200 group-hover:bg-gray-200 group-focus:bg-gray-300 transition ease-in-out duration-150`}
                >
                  {props.data.num_links}
                </span>
              ) : val.slug === "working-links" && props.data.num_ok_links > 0 ? (
                <span
                  className={`ml-auto inline-block py-0.5 px-3 text-xs leading-4 rounded-full text-gray-600 bg-gray-200 group-hover:bg-gray-200 group-focus:bg-gray-300 transition ease-in-out duration-150`}
                >
                  {props.data.num_ok_links}
                </span>
              ) : val.slug === "links-with-issues" &&
                props.data.num_non_ok_links > 0 ? (
                <span
                  className={`ml-auto inline-block py-0.5 px-3 text-xs leading-4 rounded-full text-gray-600 bg-gray-200 group-hover:bg-gray-200 group-focus:bg-gray-300 transition ease-in-out duration-150`}
                >
                  {props.data.num_non_ok_links}
                </span>
              ) : val.slug === "external-links" &&
                props.data.num_external_links > 0 ? (
                <span
                  className={`ml-auto inline-block py-0.5 px-3 text-xs leading-4 rounded-full text-gray-600 bg-gray-200 group-hover:bg-gray-200 group-focus:bg-gray-300 transition ease-in-out duration-150`}
                >
                  {props.data.num_external_links}
                </span>
              ) : null}
            </a>
          </Link>
        );
      })}
    </SiteMenuDiv>
  );
}

export default SiteMenu

SiteMenu.propTypes = {}