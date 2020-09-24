import { Fragment, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";
import fetch from "node-fetch";
import useSWR from "swr";
import Cookies from "js-cookie";
import bytes from "bytes";
import styled from "styled-components";
import Moment from "react-moment";
import Layout from "components/Layout";
import MobileSidebar from "components/sidebar/MobileSidebar";
import MainSidebar from "components/sidebar/MainSidebar";
import SiteDangerBadge from "components/badges/SiteDangerBadge";
import SiteSuccessBadge from "components/badges/SiteSuccessBadge";
import SiteFooter from "components/footer/SiteFooter";

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

const PageDetailDiv = styled.div`
  .url-heading {
    font-size: 1.4rem;
  }
`;

const PageDetail = () => {
  const [openMobileSidebar, setOpenMobileSidebar] = useState(false);

  const calendarStrings = {
    lastDay: "[Yesterday], dddd",
    sameDay: "[Today], dddd",
    lastWeek: "MMMM DD, YYYY",
    sameElse: "MMMM DD, YYYY",
  };

  const { query } = useRouter();
  const userApiEndpoint = `/api/auth/user/`;

  const { data: user, error: userError } = useSWR(userApiEndpoint, fetcher);

  const { data: site, error: siteError } = useSWR(
    () => (query.siteId ? `/api/site/${query.siteId}/` : null),
    fetcher
  );

  const { data: scan, error: scanError } = useSWR(
    () => (query.siteId ? `/api/site/${query.siteId}/scan/` : null),
    fetcher
  );

  let scanObjId = "";

  if (scan) {
    let scanObj = [];

    scan.results.map((val) => {
      scanObj.push(val);
      return scanObj;
    });

    scanObj.map((val) => {
      scanObjId = val.id;
      return scanObjId;
    });
  }

  const pageApiEndpoint = `/api/site/${query.siteId}/scan/${scanObjId}/page/`;

  const { data: page, error: pageError } = useSWR(
    () => (query.siteId && scanObjId ? pageApiEndpoint : null),
    fetcher
  );

  const pageLocationApiEndpoint = `/api/site/${query.siteId}/scan/${scanObjId}/page/${query.pageId}/`;

  const { data: pageLocation, error: pageLocationError } = useSWR(
    () =>
      query.siteId && scanObjId && query.pageId
        ? pageLocationApiEndpoint
        : null,
    fetcher
  );

  const pageTitle = `Page Detail |`;

  {
    pageLocationError && <Layout>{pageLocationError.message}</Layout>;
  }
  {
    pageError && <Layout>{pageError.message}</Layout>;
  }
  {
    scanError && <Layout>{scanError.message}</Layout>;
  }
  {
    siteError && <Layout>{siteError.message}</Layout>;
  }
  {
    userError && <Layout>{userError.message}</Layout>;
  }

  return (
    <Layout>
      {pageLocation && page && site && user ? (
        <Fragment>
          <Head>
            <title>
              {pageTitle} {pageLocation.url}
            </title>
          </Head>

          <PageDetailDiv
            className={`h-screen flex overflow-hidden bg-gray-1200`}
          >
            <MobileSidebar show={openMobileSidebar} />
            <MainSidebar />

            <div className={`flex flex-col w-0 flex-1 overflow-hidden`}>
              <div className={`md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3`}>
                <button
                  className={`-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:bg-gray-200 transition ease-in-out duration-150`}
                  aria-label={`Open sidebar`}
                  onClick={() =>
                    setTimeout(
                      () => setOpenMobileSidebar(!openMobileSidebar),
                      150
                    )
                  }
                >
                  <svg
                    className={`h-6 w-5`}
                    stroke={`currentColor`}
                    fill={`none`}
                    viewBox={`0 0 24 24`}
                  >
                    <path
                      strokeLinecap={`round`}
                      strokeLinejoin={`round`}
                      strokeWidth={`2`}
                      d={`M4 6h16M4 12h16M4 18h16`}
                    />
                  </svg>
                </button>
              </div>
              <main
                className={`flex-1 relative z-0 overflow-y-auto pt-2 pb-6 focus:outline-none md:py-6`}
                tabIndex={`0`}
              >
                <div
                  className={`max-w-full mx-auto px-4 md:py-4 sm:px-6 md:px-8`}
                >
                  <div>
                    <nav className={`sm:hidden`}>
                      <Link
                        href="/dashboard/site/[siteId]/page"
                        as={"/dashboard/site/" + query.siteId + "/page"}
                      >
                        <a
                          className={`flex items-center text-sm leading-5 font-medium text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out`}
                        >
                          <svg
                            className={`flex-shrink-0 -ml-1 mr-1 h-5 w-5 text-gray-400`}
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Back to Pages
                        </a>
                      </Link>
                    </nav>
                    <nav
                      className={`hidden sm:flex items-center text-sm leading-5 break-words`}
                    >
                      <Link
                        href="/dashboard/site/[siteId]/overview"
                        as={"/dashboard/site/" + query.siteId + "/overview"}
                      >
                        <a
                          className={`whitespace-no-wrap font-normal text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out`}
                        >
                          {site.name}
                        </a>
                      </Link>
                      <svg
                        className={`flex-shrink-0 mx-2 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor`}
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <Link
                        href="/dashboard/site/[siteId]/pages"
                        as={"/dashboard/site/" + query.siteId + "/pages"}
                      >
                        <a
                          className={`whitespace-no-wrap font-medium text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out`}
                        >
                          All Pages
                        </a>
                      </Link>
                      <svg
                        className={`flex-shrink-0 mx-2 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor`}
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <Link
                        href={"/dashboard/site/[siteId]/pages/[pageId]/details"}
                        as={
                          "/dashboard/site/" +
                          query.siteId +
                          "/pages/" +
                          query.pageId +
                          "/details"
                        }
                      >
                        <a
                          className={`truncate font-medium text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out`}
                        >
                          {pageLocation.url}
                        </a>
                      </Link>
                    </nav>
                  </div>
                  <div
                    className={`mt-2 md:flex md:items-center md:justify-between`}
                  >
                    <div className={`flex-1 min-w-0`}>
                      <h2
                        className={`text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:leading-9 sm:truncate lg:overflow-visible`}
                      >
                        Page Details for: <br />
                        <a
                          href={pageLocation.url}
                          target={`_blank`}
                          title={pageLocation.url}
                          className={`url-heading font-bold leading-7 sm:text-3xl sm:leading-9 block mr-3 text-sm font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150 break-words whitespace-normal`}
                        >
                          {pageLocation.url}
                        </a>
                      </h2>
                    </div>
                  </div>
                </div>
                <div className={`max-w-4xl py-6 px-4 sm:px-6 md:px-8`}>
                  <div
                    className={`bg-white shadow overflow-hidden sm:rounded-lg`}
                  >
                    <div className={`px-4 py-5 sm:p-0`}>
                      <dl>
                        <div
                          className={`sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 sm:py-5`}
                        >
                          <dt
                            className={`text-sm leading-5 font-medium text-gray-500`}
                          >
                            Created at
                          </dt>
                          <dd
                            className={`mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2`}
                          >
                            {!user.settings.disableLocalTime ? (
                              <Fragment>
                                <Moment
                                  calendar={calendarStrings}
                                  date={pageLocation.created_at}
                                  local
                                />
                                &nbsp;
                                <Moment
                                  date={pageLocation.created_at}
                                  format="hh:mm:ss A"
                                  local
                                />
                              </Fragment>
                            ) : (
                              <Fragment>
                                <Moment
                                  calendar={calendarStrings}
                                  date={pageLocation.created_at}
                                  utc
                                />
                                &nbsp;
                                <Moment
                                  date={pageLocation.created_at}
                                  format="hh:mm:ss A"
                                  utc
                                />
                              </Fragment>
                            )}
                          </dd>
                        </div>
                        <div
                          className={`mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:px-6 sm:py-5`}
                        >
                          <dt
                            className={`text-sm leading-5 font-medium text-gray-500`}
                          >
                            Page Size
                          </dt>
                          <dd
                            className={`mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2`}
                          >
                            {pageLocation.size_total !== null &&
                            pageLocation.size_total !== undefined &&
                            pageLocation.size_total !== ""
                              ? bytes(pageLocation.size_total, {
                                  thousandsSeparator: " ",
                                  unitSeparator: " ",
                                })
                              : 0}
                          </dd>
                        </div>
                        <div
                          className={`mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:px-6 sm:py-5`}
                        >
                          <dt
                            className={`text-sm leading-5 font-medium text-gray-500`}
                          >
                            Total Size of Images
                          </dt>
                          <dd
                            className={`mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2`}
                          >
                            {pageLocation.size_images !== null &&
                            pageLocation.size_images !== undefined &&
                            pageLocation.size_images !== ""
                              ? bytes(pageLocation.size_images, {
                                  thousandsSeparator: " ",
                                  unitSeparator: " ",
                                })
                              : 0}
                          </dd>
                        </div>
                        <div
                          className={`mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:px-6 sm:py-5`}
                        >
                          <dt
                            className={`text-sm leading-5 font-medium text-gray-500`}
                          >
                            Total Size of Scripts
                          </dt>
                          <dd
                            className={`mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2`}
                          >
                            {pageLocation.size_scripts !== null &&
                            pageLocation.size_scripts !== undefined &&
                            pageLocation.size_scripts !== ""
                              ? bytes(pageLocation.size_scripts, {
                                  thousandsSeparator: " ",
                                  unitSeparator: " ",
                                })
                              : 0}
                          </dd>
                        </div>
                        <div
                          className={`mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:px-6 sm:py-5`}
                        >
                          <dt
                            className={`text-sm leading-5 font-medium text-gray-500`}
                          >
                            Total Size of Stylesheets
                          </dt>
                          <dd
                            className={`mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2`}
                          >
                            {pageLocation.size_stylesheets !== null &&
                            pageLocation.size_stylesheets !== undefined &&
                            pageLocation.size_stylesheets !== ""
                              ? bytes(pageLocation.size_stylesheets, {
                                  thousandsSeparator: " ",
                                  unitSeparator: " ",
                                })
                              : 0}
                          </dd>
                        </div>
                        <div
                          className={`mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:px-6 sm:py-5`}
                        >
                          <dt
                            className={`text-sm leading-5 font-medium text-gray-500`}
                          >
                            Total Number of Working Images
                          </dt>
                          <dd
                            className={`mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2`}
                          >
                            {pageLocation.num_ok_images !== null &&
                            pageLocation.num_ok_images !== undefined &&
                            pageLocation.num_ok_images !== "" &&
                            pageLocation.num_ok_images !== 0
                              ? pageLocation.num_ok_images
                              : 0}
                          </dd>
                        </div>
                        <div
                          className={`mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:px-6 sm:py-5`}
                        >
                          <dt
                            className={`text-sm leading-5 font-medium text-gray-500`}
                          >
                            Total Number of Non-Working Images
                          </dt>
                          <dd
                            className={`mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2`}
                          >
                            {pageLocation.num_non_ok_images !== null &&
                            pageLocation.num_non_ok_images !== undefined &&
                            pageLocation.num_non_ok_images !== "" &&
                            pageLocation.num_non_ok_images !== 0
                              ? pageLocation.num_non_ok_images
                              : 0}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>

                <div className={`max-w-4xl py-6 px-4 sm:px-6 md:px-8`}>
                  <div
                    className={`bg-white shadow overflow-hidden sm:rounded-lg`}
                  >
                    <div className={`px-4 py-5 sm:p-0`}>
                      <dl>
                        <div
                          className={`mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:px-6 sm:py-5`}
                        >
                          <dt
                            className={`text-sm leading-5 font-medium text-gray-500`}
                          >
                            TLS Status - Page
                          </dt>
                          <dd
                            className={`mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2`}
                          >
                            {pageLocation.tls_status !== null &&
                            pageLocation.tls_status !== undefined &&
                            pageLocation.tls_status !== "" &&
                            pageLocation.tls_status !== 0 ? (
                              <SiteSuccessBadge text={"OK"} />
                            ) : pageLocation.tls_status === "NONE" ? (
                              <SiteDangerBadge text={"NONE"} />
                            ) : (
                              <SiteDangerBadge text={"ERROR"} />
                            )}
                          </dd>
                        </div>

                        <div
                          className={`mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:px-6 sm:py-5`}
                        >
                          <dt
                            className={`text-sm leading-5 font-medium text-gray-500`}
                          >
                            TLS Status - Resources
                          </dt>
                          <dd
                            className={`mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2`}
                          >
                            {pageLocation.tls_total !== null &&
                            pageLocation.tls_total !== undefined &&
                            pageLocation.tls_total !== "" &&
                            pageLocation.tls_total !== 0 &&
                            pageLocation.tls_total == true ? (
                              <SiteSuccessBadge text={"OK"} />
                            ) : (
                              <SiteDangerBadge text={"ERROR"} />
                            )}
                          </dd>
                        </div>

                        <div
                          className={`mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:px-6 sm:py-5`}
                        >
                          <dt
                            className={`text-sm leading-5 font-medium text-gray-500`}
                          >
                            Total Number of Non-Secured Images
                          </dt>
                          <dd
                            className={`mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2`}
                          >
                            {pageLocation.num_non_tls_images !== null &&
                            pageLocation.num_non_tls_images !== undefined &&
                            pageLocation.num_non_tls_images !== "" &&
                            pageLocation.num_non_tls_images !== 0
                              ? pageLocation.num_non_tls_images
                              : 0}
                          </dd>
                        </div>

                        <div
                          className={`mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:px-6 sm:py-5`}
                        >
                          <dt
                            className={`text-sm leading-5 font-medium text-gray-500`}
                          >
                            Total Number of Non-Secured Scripts
                          </dt>
                          <dd
                            className={`mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2`}
                          >
                            {pageLocation.num_non_tls_scripts !== null &&
                            pageLocation.num_non_tls_scripts !== undefined &&
                            pageLocation.num_non_tls_scripts !== "" &&
                            pageLocation.num_non_tls_scripts !== 0
                              ? pageLocation.num_non_tls_scripts
                              : 0}
                          </dd>
                        </div>

                        <div
                          className={`mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:px-6 sm:py-5`}
                        >
                          <dt
                            className={`text-sm leading-5 font-medium text-gray-500`}
                          >
                            Total Number of Non-Secured Stylesheets
                          </dt>
                          <dd
                            className={`mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2`}
                          >
                            {pageLocation.num_non_tls_stylesheets !== null &&
                            pageLocation.num_non_tls_stylesheets !== undefined &&
                            pageLocation.num_non_tls_stylesheets !== "" &&
                            pageLocation.num_non_tls_stylesheets !== 0
                              ? pageLocation.num_non_tls_stylesheets
                              : 0}
                          </dd>
                        </div>
                      </dl>
                    </div>
                  </div>
                </div>

                <div
                  className={`static bottom-0 w-full mx-auto px-4 sm:px-6 py-4`}
                >
                  <SiteFooter />
                </div>
              </main>
            </div>
          </PageDetailDiv>
        </Fragment>
      ) : null}
    </Layout>
  );
};

export default PageDetail;
