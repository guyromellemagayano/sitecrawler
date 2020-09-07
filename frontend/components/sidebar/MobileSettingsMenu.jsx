import { Fragment } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import styled from 'styled-components'
import SettingsPages from 'public/data/settings-pages.json'
import useUser from 'hooks/useUser'
import Layout from 'components/Layout'

const MobileSettingsMenuDiv = styled.nav`
  .back-nav {
    margin-bottom: 1rem;
  }
`

const MobileSettingsMenu = () => {
  const { user: user, userError: userError } = useUser({
    redirectTo: '/',
    redirectIfFound: false,
  })

  return (
    <Fragment>
      {userError && <Layout>{userError.message}</Layout>}

      {!user ? (
        <MobileSettingsMenuDiv className={`mt-5 flex-1 px-2 bg-white`}>
          {[...Array(5)].map((val, index) => {
            return (
              <a
                key={index}
                className={`group ml-1 mt-2 flex justify-start items-center`}
              >
                <Skeleton circle={true} duration={2} width={30} height={30} />
                <span className={`ml-3`}>
                  <Skeleton duration={2} width={150} />
                </span>
              </a>
            )
          })}
        </MobileSettingsMenuDiv>
      ) : (
        <MobileSettingsMenuDiv className={`mt-5 flex-1 px-2 bg-gray-1000`}>
          {SettingsPages.map((val, key) => {
            return (
              <Fragment key={key}>
                {val.slug !== "navigation" ? (
                  <Fragment>
                    <h3
                      className={`${val.slug}-headline mt-8 px-3 text-xs leading-4 font-semibold text-gray-300 uppercase tracking-wider`}
                    >
                      {val.category}
                    </h3>
                    <div
                      className={`my-3`}
                      role="group"
                      aria-labelledby={`${val.slug}-headline`}
                    >
                      {val.links.map((val2, key) => {
                        return (
                          <Link key={key} href={val2.url}>
                            <a
                              className={`${
                                useRouter().pathname.indexOf(val2.url) == 0
                                  ? "group mt-1 flex items-center px-3 py-2 text-sm leading-5 font-medium text-gray-600 rounded-md bg-white hover:text-gray-600 hover:bg-white focus:outline-none focus:bg-gray-200 transition ease-in-out duration-150"
                                  : "mt-1 group flex items-center px-3 py-2 text-sm leading-5 font-medium text-gray-500 rounded-md hover:text-gray-600 hover:bg-white focus:outline-none focus:bg-white transition ease-in-out duration-150"
                              }`}
                            >
                              <svg
                                className={`mr-3 h-6 w-5 text-gray-500 group-hover:text-gray-500 group-focus:text-gray-500 transition ease-in-out duration-150`}
                                stroke={`currentColor`}
                                fill={`none`}
                                viewBox={`0 0 24 24`}
                              >
                                <path
                                  strokeLinecap={`round`}
                                  strokeLinejoin={`round`}
                                  strokeWidth={`2`}
                                  d={val2.icon}
                                />
                              </svg>
                              <span>{val2.title}</span>
                            </a>
                          </Link>
                        )
                      })}
                    </div>
                  </Fragment>
                ) : (
                  <div
                    className={`mt-1`}
                    role="group"
                    aria-labelledby={`${val.slug}-headline`}
                  >
                    {val.links.map((val2, key) => {
                      return (
                        <Link
                          key={key}
                          href={
                            val2.url.indexOf("/dashboard/sites") > -1
                              ? val2.url
                              : "/dashboard/site/" + query.siteId + val2.url
                          }
                        >
                          <a
                            className={`${
                              useRouter().pathname.indexOf(val2.url) == 0
                                ? "group mt-1 flex items-center px-3 py-2 text-sm leading-5 font-medium text-gray-600 rounded-md bg-white hover:text-gray-600 hover:bg-white focus:outline-none focus:bg-gray-200 transition ease-in-out duration-150"
                                : "back-nav mt-1 group flex items-center px-3 py-2 text-sm leading-5 font-medium text-gray-500 rounded-md hover:text-gray-600 hover:bg-white focus:outline-none focus:bg-white transition ease-in-out duration-150"
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
                                d={val2.icon}
                              />
                              {val2.icon2 ? (
                                <path
                                  strokeLinecap={`round`}
                                  strokeLinejoin={`round`}
                                  strokeWidth={`2`}
                                  d={val2.icon2}
                                />
                              ) : null}
                            </svg>
                            <span>{val2.title}</span>
                            {val2.url === "/links" && (
                              <span
                                className={`ml-auto inline-block px-3 text-xs leading-4 rounded-full bg-purple-100 text-purple-800 transition ease-in-out duration-150`}
                              >
                                {stats.num_links}
                              </span>
                            )}
                            {val2.url === "/pages" && (
                              <span
                                className={`ml-auto inline-block px-3 text-xs leading-4 rounded-full bg-purple-100 text-purple-800 transition ease-in-out duration-150`}
                              >
                                {stats.num_pages}
                              </span>
                            )}
                          </a>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </Fragment>
            )
          })}
        </MobileSettingsMenuDiv>
      )}
    </Fragment>
  )
}

export default MobileSettingsMenu
