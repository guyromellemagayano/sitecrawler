import { useState, Fragment, useEffect } from "react";
import Router, { useRouter } from "next/router";
import fetch from "node-fetch";
import useSWR from "swr";
import Cookies from "js-cookie";
import Link from "next/link";
import styled from "styled-components";
import Skeleton from "react-loading-skeleton";
import DashboardPages from "public/data/dashboard-pages.json";
import useUser from "hooks/useUser";
import Layout from "components/Layout";
import Transition from "hooks/Transition";
import useDropdownOutsideClick from "hooks/useDropdownOutsideClick";
import { removeURLParameter } from "helpers/functions";

const fetcher = async (url) => {
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "X-CSRFToken": Cookies.get("csrftoken"),
    },
  });

  const data = await res.json();

  if (res.status !== 200) {
    throw new Error(data.message);
  }

  return data;
};

const PrimaryMenuDiv = styled.nav``;

const PrimaryMenu = () => {
  const [selectedSite, setSelectedSite] = useState(undefined);
  const {
    ref,
    isComponentVisible,
    setIsComponentVisible,
  } = useDropdownOutsideClick(false);

  const setDropdownToggle = () => {
    setIsComponentVisible(!isComponentVisible);
  };

  const { query, asPath } = useRouter();
    
  const { user: user, userError: userError } = useUser({
    redirectTo: "/",
    redirectIfFound: false,
  });

  const { data: site, error: siteError } = useSWR("/api/site/", fetcher, {
    refreshInterval: 1000,
  });
  
  const siteSelectOnLoad = (siteId = query.siteId) => {
    if (site == undefined) return false;

    for (let i = 0; i < site.results.length; i++) {
      if (site.results[i].id == siteId) setSelectedSite(site.results[i]);
    }
  };
  
  const dropdownHandler = (siteId, verified) => {
    if (!verified) return false;

    Router.push(
      `/dashboard/site/[siteId]/overview`,
      `/dashboard/site/${siteId}/overview`
    );

    setTimeout(() => {
      siteSelectOnLoad(siteId);
      setIsComponentVisible(!isComponentVisible);
    }, 250);
  };

  useEffect(() => {
    siteSelectOnLoad();
  }, [site]);

  return (
    <Fragment>
      {userError ||
        (siteError && (
          <Layout>{userError.message || siteError.message}</Layout>
        ))}

      {!user || !site ? (
        <PrimaryMenuDiv className={`mt-5 flex-1 px-2 bg-gray-1000`}>
          {[...Array(3)].map((val, index) => {
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
            );
          })}
        </PrimaryMenuDiv>
      ) : (
        <PrimaryMenuDiv className={`flex-1 px-4 bg-gray-1000`}>
          {DashboardPages.map((val, key) => {
            return (
              <Fragment key={key}>
                {user.group.id === 3 ||
                (user.group.id !== 3 && val.slug !== "reports") ? (
                  <Fragment>
                    <h3
                      className={`${val.slug}-headline mt-8 text-xs leading-4 font-semibold text-gray-300 uppercase tracking-wider`}
                    >
                      {val.category}
                    </h3>
                    <div
                      className={`my-3`}
                      role="group"
                      aria-labelledby={`${val.slug}-headline`}
                    >
                      {val.links ? val.links.map((val2, key) => {
                        return (
                          <Link key={key} href={val2.url}>
                            <a
                              className={`${
                                useRouter().pathname.indexOf(val2.url) == 0
                                  ? "group mt-1 flex items-center px-3 py-2 text-sm leading-5 font-medium text-gray-100 rounded-md bg-gray-1100"
                                  : "mt-1 group flex items-center px-3 py-2 text-sm leading-5 font-medium text-gray-500 rounded-md hover:text-gray-100 hover:bg-gray-1100 focus:outline-none focus:bg-gray-1100 transition ease-in-out duration-150"
                              }`}
                            >
                              <svg
                                className={`mr-3 h-6 w-5`}
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
                              {val2.url === "/dashboard/sites" && (
                                <span
                                  className={`ml-auto inline-block px-3 text-xs leading-4 rounded-full bg-white text-black transition ease-in-out duration-150`}
                                >
                                  {site.count}
                                </span>
                              )}
                            </a>
                          </Link>
                        );
                      }) : (
                        <div className={`space-y-1`}>
                          <div ref={ref} className={`relative`}>
                            <div className={`relative`}>
                              <span
                                className={`inline-block w-full rounded-md shadow-sm`}
                              >
                                <button
                                  type="button"
                                  aria-haspopup="listbox"
                                  aria-expanded="true"
                                  aria-labelledby="listbox-label"
                                  className={`cursor-default relative w-full rounded-md border border-gray-700 pl-3 pr-10 py-2 text-left focus:outline-none transition ease-in-out duration-150 sm:text-sm sm:leading-5`}
                                  onClick={setDropdownToggle}
                                >
                                  <div
                                    className={`flex items-center space-x-3`}
                                  >
                                    <span
                                      className={`block truncate text-gray-600`}
                                    >
                                      Select Site
                                    </span>
                                  </div>
                                  <span
                                    className={`absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none`}
                                  >
                                    <svg
                                      className={`h-5 w-5 text-gray-400`}
                                      viewBox="0 0 20 20"
                                      fill="none"
                                      stroke="currentColor"
                                    >
                                      <path
                                        d="M7 7l3-3 3 3m0 6l-3 3-3-3"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  </span>
                                </button>
                              </span>

                              <Transition show={isComponentVisible}>
                                <Transition
                                  enter="transition ease-out duration-100"
                                  enterFrom="transform opacity-0 scale-95"
                                  enterTo="transform opacity-100 scale-100"
                                  leave="transition ease-in duration-75"
                                  leaveFrom="transform opacity-100 scale-100"
                                  leaveTo="transform opacity-0 scale-95"
                                >
                                  <div
                                    className={`absolute mt-1 w-full rounded-md bg-white shadow-lg`}
                                  >
                                    <ul
                                      tabIndex="-1"
                                      role="listbox"
                                      aria-labelledby="listbox-label"
                                      aria-activedescendant="listbox-item-3"
                                      className={`max-h-xs py-2 rounded-md text-base leading-6 shadow-xs overflow-auto focus:outline-none sm:text-sm sm:leading-5`}
                                    >
                                      {site.results.map((val, key) => {
                                        return (
                                          <li
                                            key={key}
                                            onClick={() =>
                                              dropdownHandler(
                                                val.id,
                                                val.verified
                                              )
                                            }
                                            id={`listbox-item-${key}`}
                                            role="option"
                                            className={`hover:text-white hover:bg-indigo-600 text-gray-900 ${
                                              val.verified
                                                ? "cursor-pointer"
                                                : "cursor-not-allowed"
                                            } select-none relative py-2 pl-3 pr-9`}
                                          >
                                            <div
                                              className={`flex items-center space-x-3`}
                                            >
                                              <span
                                                aria-label="Online"
                                                className={`${
                                                  val.verified
                                                    ? "bg-green-400"
                                                    : "bg-red-400"
                                                } flex-shrink-0 inline-block h-2 w-2 rounded-full`}
                                              ></span>
                                              <span
                                                className={`font-normal block truncate`}
                                              >
                                                {val.name}
                                              </span>
                                            </div>
                                          </li>
                                        );
                                      })}
                                    </ul>
                                  </div>
                                </Transition>
                              </Transition>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </Fragment>
                ) : null}
              </Fragment>
            );
          })}
        </PrimaryMenuDiv>
      )}
    </Fragment>
  );
};

export default PrimaryMenu;
