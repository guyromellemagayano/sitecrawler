import { Fragment } from "react";
import { useRouter } from "next/router";
import fetch from "node-fetch";
import useSWR from "swr";
import Cookies from "js-cookie";
import Link from "next/link";
import styled from "styled-components";
import Skeleton from "react-loading-skeleton";
import DashboardPages from "public/data/dashboard-pages.json";
import useUser from "hooks/useUser";
import Layout from "components/Layout";

const fetcher = async (url) => {
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
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
  const { user: user, userError: userError } = useUser({
    redirectTo: "/",
    redirectIfFound: false,
  });

  const { data: site, error: siteError } = useSWR("/api/site/", fetcher);

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
                      {val.links.map((val2, key) => {
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
                      })}
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
