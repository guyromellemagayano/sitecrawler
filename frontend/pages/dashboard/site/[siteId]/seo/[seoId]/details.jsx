import { Fragment, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";
import fetch from "node-fetch";
import useSWR from "swr";
import Cookies from "js-cookie";
import styled from "styled-components";
import Moment from "react-moment";
import Layout from "components/Layout";
import MobileSidebar from "components/sidebar/MobileSidebar";
import MainSidebar from "components/sidebar/MainSidebar";
import SiteFooter from "components/footer/SiteFooter";

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

const SeoDetailDiv = styled.div``;

const SeoDetail = () => {
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

  const pageLocationApiEndpoint = `/api/site/${query.siteId}/scan/${scanObjId}/page/${query.seoId}/`;

  const { data: pageLocation, error: pageLocationError } = useSWR(
    () =>
      query.siteId && scanObjId && query.seoId ? pageLocationApiEndpoint : null,
    fetcher
  );

  const pageTitle = `SEO Detail |`;

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

  // console.log(pageLocation)

  return (
    <Layout>
      {pageLocation && page && site && user ? (
        <Fragment>
          <Head>
            <title>
              {pageTitle} {pageLocation.url}
            </title>
          </Head>

          <SeoDetailDiv className={`h-screen flex overflow-hidden bg-gray-100`}>
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
                        href="/dashboard/site/[siteId]/seo"
                        as={"/dashboard/site/" + query.siteId + "/seo"}
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
                          Back to SEO
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
                        href="/dashboard/site/[siteId]/seo"
                        as={"/dashboard/site/" + query.siteId + "/seo"}
                      >
                        <a
                          className={`whitespace-no-wrap font-medium text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out`}
                        >
                          All SEO
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
                        href={"/dashboard/site/[siteId]/seo/[seoId]/details"}
                        as={
                          "/dashboard/site/" +
                          query.siteId +
                          "/seo/" +
                          query.seoId +
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
                        SEO Details for: <br />
                        <a
                          href={pageLocation.url}
                          target={`_blank`}
                          title={pageLocation.url}
                          className={`text-2xl font-bold leading-7 sm:text-3xl sm:leading-9 block mr-3 text-sm font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150 break-words whitespace-normal`}
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
                            Total Number of Links
                          </dt>
                          <dd
                            className={`mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2`}
                          >
                            {pageLocation.num_links !== null &&
                            pageLocation.num_links !== undefined &&
                            pageLocation.num_links !== ""
                              ? pageLocation.num_links
                              : 0}
                          </dd>
                        </div>
                        <div
                          className={`mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:px-6 sm:py-5`}
                        >
                          <dt
                            className={`text-sm leading-5 font-medium text-gray-500`}
                          >
                            Total Number of Working Links
                          </dt>
                          <dd
                            className={`mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2`}
                          >
                            {pageLocation.num_ok_links !== null &&
                            pageLocation.num_ok_links !== undefined &&
                            pageLocation.num_ok_links !== "" &&
                            pageLocation.num_ok_links !== 0
                              ? pageLocation.num_ok_links
                              : 0}
                          </dd>
                        </div>
                        <div
                          className={`mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:px-6 sm:py-5`}
                        >
                          <dt
                            className={`text-sm leading-5 font-medium text-gray-500`}
                          >
                            Total Number of Non-Working Links
                          </dt>
                          <dd
                            className={`mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2`}
                          >
                            {pageLocation.num_non_ok_links !== null &&
                            pageLocation.num_non_ok_links !== undefined &&
                            pageLocation.num_non_ok_links !== "" &&
                            pageLocation.num_non_ok_links !== 0
                              ? pageLocation.num_non_ok_links
                              : 0}
                          </dd>
                        </div>
                        <div
                          className={`mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:px-6 sm:py-5`}
                        >
                          <dt
                            className={`text-sm leading-5 font-medium text-gray-500`}
                          >
                            Title
                          </dt>
                          <dd
                            className={`mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2`}
                          >
                            {pageLocation.pagedata.title !== null &&
                            pageLocation.pagedata.title !== undefined &&
                            pageLocation.pagedata.title !== "" ? (
                              pageLocation.pagedata.title
                            ) : (
                              <span className="text-gray-500">None</span>
                            )}
                          </dd>
                        </div>
                        <div
                          className={`mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:px-6 sm:py-5`}
                        >
                          <dt
                            className={`text-sm leading-5 font-medium text-gray-500`}
                          >
                            Description
                          </dt>
                          <dd
                            className={`mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2`}
                          >
                            {pageLocation.pagedata.description !== null &&
                            pageLocation.pagedata.description !== undefined &&
                            pageLocation.pagedata.description !== "" ? (
                              pageLocation.pagedata.description
                            ) : (
                              <span className="text-gray-500">None</span>
                            )}
                          </dd>
                        </div>
                        <div
                          className={`mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:px-6 sm:py-5`}
                        >
                          <dt
                            className={`text-sm leading-5 font-medium text-gray-500`}
                          >
                            First H1 Text
                          </dt>
                          <dd
                            className={`mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2`}
                          >
                            {pageLocation.pagedata.h1_first !== null &&
                            pageLocation.pagedata.h1_first !== undefined &&
                            pageLocation.pagedata.h1_first !== "" ? (
                              pageLocation.pagedata.h1_first
                            ) : (
                              <span className="text-gray-500">None</span>
                            )}
                          </dd>
                        </div>
                        <div
                          className={`mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:px-6 sm:py-5`}
                        >
                          <dt
                            className={`text-sm leading-5 font-medium text-gray-500`}
                          >
                            Second H1 Text
                          </dt>
                          <dd
                            className={`mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2`}
                          >
                            {pageLocation.pagedata.h1_second !== null &&
                            pageLocation.pagedata.h1_second !== undefined &&
                            pageLocation.pagedata.h1_second !== "" ? (
                              pageLocation.pagedata.h1_second
                            ) : (
                              <span className="text-gray-500">None</span>
                            )}
                          </dd>
                        </div>
                        <div
                          className={`mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:px-6 sm:py-5`}
                        >
                          <dt
                            className={`text-sm leading-5 font-medium text-gray-500`}
                          >
                            First H2 Text
                          </dt>
                          <dd
                            className={`mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2`}
                          >
                            {pageLocation.pagedata.h2_first !== null &&
                            pageLocation.pagedata.h2_first !== undefined &&
                            pageLocation.pagedata.h2_first !== "" ? (
                              pageLocation.pagedata.h2_first
                            ) : (
                              <span className="text-gray-500">None</span>
                            )}
                          </dd>
                        </div>
                        <div
                          className={`mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:px-6 sm:py-5`}
                        >
                          <dt
                            className={`text-sm leading-5 font-medium text-gray-500`}
                          >
                            Second H2 Text
                          </dt>
                          <dd
                            className={`mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2`}
                          >
                            {pageLocation.pagedata.h2_second !== null &&
                            pageLocation.pagedata.h2_second !== undefined &&
                            pageLocation.pagedata.h2_second !== "" ? (
                              pageLocation.pagedata.h2_second
                            ) : (
                              <span className="text-gray-500">None</span>
                            )}
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
          </SeoDetailDiv>
        </Fragment>
      ) : null}
    </Layout>
  );
};

export default SeoDetail;
