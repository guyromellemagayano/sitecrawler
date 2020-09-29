import { Fragment, useEffect, useState } from "react";
import Link from "next/link";
import fetch from "node-fetch";
import Cookies from "js-cookie";
import styled from "styled-components";
import useSWR from "swr";
import Skeleton from "react-loading-skeleton";
import { Transition } from "@tailwindui/react";
import Layout from "components/Layout";
import useDropdownOutsideClick from "hooks/useDropdownOutsideClick";

const apiParameters = {
  method: "GET",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-CSRFToken": Cookies.get("csrftoken"),
  },
};

const SidebarDiv = styled.div``;

const Sidebar = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [userLoaded, setUserLoaded] = useState(false);
  const {
    ref,
    isComponentVisible,
    setIsComponentVisible,
  } = useDropdownOutsideClick(false);

  const setDropdownToggle = () => {
    setShowDropdown(!showDropdown);
    setIsComponentVisible(!isComponentVisible);
  };

  const fetcher = (url) => fetch(url, apiParameters).then((res) => res.json());

  const { data: user, error: userError } = useSWR("/api/auth/user/", fetcher, {
    refreshInterval: 2500,
  });

  useEffect(() => {
    if (user && user !== undefined) setUserLoaded(true);
  }, [user]);

  return (
    <Fragment>
      {userError && <Layout>Failed to load.</Layout>}

      {!userLoaded ? (
        <SidebarDiv className={`flex-shrink-0 flex flex-col border-gray-200`}>
          <span
            className={`flex justify-between items-center my-1 group px-3 py-2`}
          >
            <span className={`w-full flex justify-between`}>
              <Skeleton duration={2} width={100} />
              <Skeleton duration={2} width={50} />
            </span>
          </span>
          <Link href="/dashboard/settings/profile">
            <a
              className={`border-t p-4 flex-shrink-0 w-full group block hover:text-gray-900 hover:bg-gray-100 transition ease-in-out duration-150`}
            >
              <div className={`flex items-center`}>
                <div>
                  <Skeleton circle={true} duration={2} width={40} height={40} />
                </div>
                <div className={`ml-3`}>
                  <Skeleton duration={2} width={145} />
                  <Skeleton duration={2} width={145} />
                </div>
              </div>
            </a>
          </Link>
        </SidebarDiv>
      ) : (
        <SidebarDiv
          ref={ref}
          className={`flex-shrink-0 flex flex-col relative`}
        >
          <button
            type="button"
            className={`p-4 flex items-center justify-between flex-shrink-0 w-full group block transition ease-in-out duration-150 ${
              isComponentVisible ? "bg-gray-900" : "hover:bg-gray-900"
            }`}
            id="options-menu"
            aria-haspopup="true"
            aria-expanded={`${isComponentVisible ? "true" : "false"}`}
            onClick={setDropdownToggle}
          >
            <div className={`flex items-center`}>
              <div className={`flex flex-col flex-wrap text-left`}>
                <p
                  className={`text-sm leading-5 font-medium text-white group-hover:text-gray-1000`}
                >
                  {user.first_name} {user.last_name}
                </p>
                <p
                  className={`text-xs leading-4 font-medium text-white group-hover:text-gray-1000 transition ease-in-out duration-150`}
                >
                  @{user.username}
                </p>
              </div>
            </div>
            <div>
              <svg
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className={`selector text-white w-6 h-6`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                ></path>
              </svg>
            </div>
          </button>

          <Transition
            show={isComponentVisible}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <div
              className={`z-10 mx-3 origin-top absolute right-0 left-0 bottom-0 mt-1 mb-20 rounded-md shadow-lg`}
            >
              <div
                className={`rounded-md bg-white shadow-xs`}
                role="menu"
                aria-orientation="vertical"
                aria-labelledby="options-menu"
              >
                <div className={`py-1`}>
                  <span
                    className={`flex justify-between items-center my-1 group px-4 py-2`}
                  >
                    <span
                      className={`${
                        user.group.name === "Basic"
                          ? "text-green-800"
                          : user.group.name === "Pro"
                          ? "text-blue-800"
                          : "text-red-800"
                      } text-sm leading-5 font-medium`}
                    >
                      {user.group.name} Plan
                    </span>
                    {user.group.name === "Basic" ? (
                      <Link href="/dashboard/settings/subscriptions">
                        <a
                          className={`bg-green-200 text-green-800 hover:text-white hover:bg-green-600 text-xs leading-4 font-medium inline-flex items-center px-2 py-1 rounded transition ease-in-out duration-150`}
                        >
                          <small>Upgrade</small>
                        </a>
                      </Link>
                    ) : user.group.name === "Pro" ? (
                      <Link href="/dashboard/settings/subscriptions">
                        <a
                          className={`bg-blue-200 text-blue-800 hover:text-white hover:bg-blue-600 text-xs leading-4 font-medium inline-flex items-center px-2 py-1 rounded transition ease-in-out duration-150`}
                        >
                          <small>Upgrade</small>
                        </a>
                      </Link>
                    ) : null}
                  </span>
                </div>
                <div className={`border-t border-gray-100`}></div>
                <div className={`py-1`}>
                  <Link href="/dashboard/settings/profile">
                    <a
                      className={`block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900`}
                      role="menuitem"
                    >
                      View Profile
                    </a>
                  </Link>
                  <Link href="/dashboard/settings/subscriptions">
                    <a
                      className={`block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900`}
                      role="menuitem"
                    >
                      Subscription Plans
                    </a>
                  </Link>
                  <Link href="/dashboard/settings/payment-details">
                    <a
                      className={`block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900`}
                      role="menuitem"
                    >
                      Payment Details
                    </a>
                  </Link>
                  <Link href="/dashboard/settings/billing-history">
                    <a
                      className={`block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900`}
                      role="menuitem"
                    >
                      Billing History
                    </a>
                  </Link>
                  <Link href="/dashboard/settings/global">
                    <a
                      className={`block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900`}
                      role="menuitem"
                    >
                      App Settings
                    </a>
                  </Link>
                </div>
                <div className={`border-t border-gray-100`}></div>
                <div className={`py-1`}>
                  <Link href="/logout">
                    <a
                      className={`block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900`}
                      role="menuitem"
                    >
                      Logout
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </Transition>
        </SidebarDiv>
      )}
    </Fragment>
  );
};

export default Sidebar;
