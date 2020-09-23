import { Fragment, useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import fetch from "node-fetch";
import useSWR from "swr";
import Cookies from "js-cookie";
import styled from "styled-components";
import useUser from "hooks/useUser";
import Skeleton from "react-loading-skeleton";
import LinksPagesContent from "public/data/links-pages.json";
import Layout from "components/Layout";
import MobileSidebar from "components/sidebar/MobileSidebar";
import MainSidebar from "components/sidebar/MainSidebar";
import LinkOptions from "components/site/LinkOptions";
import PageTable from "components/site/PageTable";
import Pagination from "components/sites/Pagination";
import PageFilter from "components/site/PageFilter";
import PageSorting from "components/site/PageSorting";
import {
  removeURLParameter,
  slugToCamelcase,
  getSortKeyFromSlug,
  getSlugFromSortKey,
} from "helpers/functions";
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

const initialOrder = {
  pageLargePages: "default",
  pageBrokenSecurity: "default",
};

const PagesDiv = styled.section`
  .btn-crawler {
    top: 0;
    right: 0;
    padding: 2.25rem 1.5rem;
  }
`;

const Pages = (props) => {
  const [openMobileSidebar, setOpenMobileSidebar] = useState(false);
  const [sortOrder, setSortOrder] = useState(initialOrder);
  const [searchKey, setSearchKey] = useState("");
  const [pagePath, setPagePath] = useState("");
  const [allFilter, setAllFilter] = useState(false);
  const [largePageSizeFilter, setLargePageSizeFilter] = useState(false);
  const [brokenSecurityFilter, setBrokenSecurityFilter] = useState(false);
  const [recrawlable, setRecrawlable] = useState(false);
  const [crawlFinished, setCrawlFinished] = useState(false);
  const [linksPerPage, setLinksPerPage] = useState(20);
  const pageTitle = "Pages |";

  const { user: user, userError: userError } = useUser({
    redirectTo: "/",
    redirectIfFound: false,
  });

  const { query, asPath } = useRouter();
  const { data: site, error: siteError } = useSWR(
    () => (query.siteId ? `/api/site/${query.siteId}/` : null),
    fetcher
  );

  const { data: scan, error: scanError } = useSWR(
    () =>
      query.siteId
        ? `/api/site/${query.siteId}/scan/?ordering=-finished_at`
        : null,
    fetcher,
    {
      refreshInterval: 1000,
    }
  );

  let scanObjId = "";

  if (scan) {
    let scanObj = [];

    scan.results.map((val) => {
      scanObj.push(val);
      return scanObj;
    });

    scanObj.map((val, index) => {
      if (index == 0) scanObjId = val.id;

      return scanObjId;
    });
  }

  let scanApiEndpoint =
    props.result.page !== undefined
      ? `/api/site/${query.siteId}/scan/${scanObjId}/page/?per_page=` + linksPerPage + `&page=` +
        props.result.page
      : `/api/site/${query.siteId}/scan/${scanObjId}/page/?per_page=` + linksPerPage;
  let queryString = 
    props.result.size_total_min !== undefined
      ? scanApiEndpoint.includes("?")
        ? `&size_total_min=1048576`
        : `?size_total_min=1048576`
      : "";
  queryString += 
    props.result.tls_total !== undefined
      ? (scanApiEndpoint + queryString).includes("?")
        ? `&tls_total=false`
        : `?tls_total=false`
      : "";
  queryString +=
    props.result.search !== undefined
      ? (scanApiEndpoint + queryString).includes("?")
        ? `&search=${props.result.search}`
        : `?search=${props.result.search}`
      : "";
  queryString +=
    props.result.ordering !== undefined
      ? (scanApiEndpoint + queryString).includes("?")
        ? `&ordering=${props.result.ordering}`
        : `?ordering=${props.result.ordering}`
      : "";

  scanApiEndpoint += queryString;

  const { data: page, error: pageError, mutate: updatePages } = useSWR(
    () => (query.siteId && scanObjId ? scanApiEndpoint : null),
    fetcher,
    {
      refreshInterval: 50000,
    }
  );

  const searchEventHandler = (e) => {
    if (e.keyCode != 13) return false;

    let newPath = removeURLParameter(asPath, "search");
    newPath = removeURLParameter(newPath, "page");

    if (e.target.value == "" || e.target.value == " ") {
      setSearchKey(e.target.value);
      if (newPath.includes("?")) setPagePath(`${newPath}&`);
      else setPagePath(`${newPath}?`);

      Router.push("/dashboard/site/[siteId]/pages", newPath);
      return;
    }

    if (newPath.includes("?")) newPath += `&search=${e.target.value}`;
    else newPath += `?search=${e.target.value}`;

    setSearchKey(e.target.value);
    if (newPath.includes("?")) setPagePath(`${newPath}&`);
    else setPagePath(`${newPath}?`);

    Router.push("/dashboard/site/[siteId]/pages", newPath);

    updatePages();
  };

  const filterChangeHandler = async (e) => {
    const filterType = e.target.value;
    const filterStatus = e.target.checked;

    let newPath = asPath;
    newPath = removeURLParameter(newPath, "page");

    if (filterType == "pageLargePages" && filterStatus == true) {
      setLargePageSizeFilter(true);
      setAllFilter(false);

      if (newPath.includes("?")) newPath += `&size_total_min=1048576`;
      else newPath += `?size_total_min=1048576`;
    } else if (filterType == "pageLargePages" && filterStatus == false) {
      newPath = removeURLParameter(newPath, "size_total_min");
      setLargePageSizeFilter(false);
    }

    if (filterType == "pageBrokenSecurity" && filterStatus == true) {
      setBrokenSecurityFilter(true);
      setAllFilter(false);

      if (newPath.includes("?")) newPath += `&tls_total=false`;
      else newPath += `?tls_total=false`;
    } else if (filterType == "pageBrokenSecurity" && filterStatus == false) {
      newPath = removeURLParameter(newPath, "tls_total");
      setBrokenSecurityFilter(false);
    }

    if (filterType == "all" && filterStatus == true) {
      setLargePageSizeFilter(false);
      setBrokenSecurityFilter(false);

      setAllFilter(true);

      newPath = removeURLParameter(newPath, "size_total_min");
      newPath = removeURLParameter(newPath, "tls_total");

      // if (!newPath.includes("search") && !newPath.includes("size_total_min"))
      //   newPath = newPath.replace("?", "");
    }

    if (newPath.includes("?")) setPagePath(`${newPath}&`);
    else setPagePath(`${newPath}?`);

    Router.push("/dashboard/site/[siteId]/pages", newPath);

    updatePages();

    return true;
  };

  const onItemsPerPageChange = (count) => {
    const countValue = parseInt(count.target.value);

    let newPath = asPath;
    newPath = removeURLParameter(newPath, "page");

    if (countValue) {
      if (newPath.includes("per_page")) {
        newPath = removeURLParameter(newPath, "per_page");
      }
      if (newPath.includes("?")) newPath += `&per_page=${countValue}`;
      else newPath += `?per_page=${countValue}`;

      setLinksPerPage(countValue);

      if (newPath.includes("?")) setPagePath(`${newPath}&`);
      else setPagePath(`${newPath}?`);
      
      Router.push("/dashboard/site/[siteId]/pages/", newPath);

      updatePages();

      return true;
    }
  };

  useEffect(() => {
    if (removeURLParameter(asPath, "page").includes("?"))
      setPagePath(`${removeURLParameter(asPath, "page")}&`);
    else setPagePath(`${removeURLParameter(asPath, "page")}?`);

    if (props.result.search !== undefined) setSearchKey(props.result.search);

    if (props.result.ordering !== undefined) {
      const slug = getSlugFromSortKey(
        LinksPagesContent,
        props.result.ordering.replace("-", "")
      );
      const orderItem = slugToCamelcase(slug);

      if (props.result.ordering.includes("-"))
        setSortOrder((prevState) => ({ ...prevState, [orderItem]: "desc" }));
      else setSortOrder((prevState) => ({ ...prevState, [orderItem]: "asc" }));
    }

    if (props.result.per_page !== undefined) setLinksPerPage(props.result.per_page);
  }, []);

  useEffect(() => {
    if (props.result.size_total_min !== undefined) {
      setLargePageSizeFilter(true);
      setAllFilter(false);
    } else setLargePageSizeFilter(false);

    if (props.result.tls_total !== undefined) {
      setBrokenSecurityFilter(true);
      setAllFilter(false);
    } else setBrokenSecurityFilter(false);

    if (
      props.result.size_total_min == undefined &&
      props.result.tls_total == undefined
    ) {
      setLargePageSizeFilter(false);
      setBrokenSecurityFilter(false);

      setAllFilter(true);
    }
  }, [filterChangeHandler]);

  const SortHandler = (slug, dir) => {
    setSortOrder({ ...initialOrder });

    let newPath = removeURLParameter(asPath, "ordering");

    const sortItem = slugToCamelcase(slug);
    const sortKey = getSortKeyFromSlug(LinksPagesContent, slug);

    if (sortOrder[sortItem] == "default") {
      setSortOrder((prevState) => ({ ...prevState, [sortItem]: dir }));
      if (dir == "asc") {
        if (newPath.includes("?")) newPath += `&ordering=${sortKey}`;
        else newPath += `?ordering=${sortKey}`;
      } else {
        if (newPath.includes("?")) newPath += `&ordering=-${sortKey}`;
        else newPath += `?ordering=-${sortKey}`;
      }
    } else if (sortOrder[sortItem] == "asc") {
      setSortOrder((prevState) => ({ ...prevState, [sortItem]: "desc" }));
      if (newPath.includes("?")) newPath += `&ordering=-${sortKey}`;
      else newPath += `?ordering=-${sortKey}`;
    } else {
      setSortOrder((prevState) => ({ ...prevState, [sortItem]: "asc" }));
      if (newPath.includes("?")) newPath += `&ordering=${sortKey}`;
      else newPath += `?ordering=${sortKey}`;
    }

    // console.log('[pagePath]', newPath)
    if (newPath.includes("?"))
      setPagePath(`${removeURLParameter(newPath, "page")}&`);
    else setPagePath(`${removeURLParameter(newPath, "page")}?`);

    Router.push("/dashboard/site/[siteId]/pages", newPath);
    updatePages();
  };

  const reCrawlEndpoint = `/api/site/${query.siteId}/start_scan/`;

  const onCrawlHandler = async () => {
    setCrawlFinished(false);
    const res = await fetch(reCrawlEndpoint, {
      method: "POST",
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

    // console.log('[onCrawlHandler]', data)

    return data;
  };

  const crawlableHandler = (finished) => {
    if (finished) setCrawlFinished(true);

    if (
      user &&
      user.permissions !== undefined &&
      user.permissions[0] == "can_start_scan" &&
      site &&
      site.verified &&
      finished
    )
      setRecrawlable(true);
    else setRecrawlable(false);
  };

  useEffect(() => {
    if (
      user &&
      user.permissions !== undefined &&
      user.permissions[0] == "can_start_scan" &&
      site &&
      site.verified
    )
      setRecrawlable(true);
    else setRecrawlable(false);
  }, [user, site]);

  {
    userError && <Layout>{userError.message}</Layout>;
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

  return (
    <Layout>
      {user && page && site ? (
        <Fragment>
          <Head>
            <title>
              {pageTitle} {site.name}
            </title>
          </Head>

          <PagesDiv className={`h-screen flex overflow-hidden bg-gray-1200`}>
            <MobileSidebar
              show={openMobileSidebar}
              crawlableHandler={crawlableHandler}
            />
            <MainSidebar crawlableHandler={crawlableHandler} />

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
                        href="/dashboard/site/[siteId]/overview"
                        as={"/dashboard/site/" + query.siteId + "/overview"}
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
                          Back to Overview
                        </a>
                      </Link>
                    </nav>
                    <nav
                      className={`hidden sm:flex items-center text-sm leading-5`}
                    >
                      <Link
                        href="/dashboard/site/[siteId]/overview"
                        as={"/dashboard/site/" + query.siteId + "/overview"}
                      >
                        <a
                          className={`font-normal text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out`}
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
                          className={`font-medium text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out`}
                        >
                          All Pages
                        </a>
                      </Link>
                    </nav>
                  </div>
                  <div
                    className={`mt-2 md:flex md:items-center md:justify-between`}
                  >
                    <div className={`flex-1 min-w-0`}>
                      <div className={`flex items-center`}>
                        <div>
                          <div className={`flex items-center`}>
                            <h2 className={`text-2xl font-bold leading-7 text-gray-900 sm:leading-9 sm:truncate`}>
                              {site.name}
                            </h2>
                            <dl className={`ml-5 flex flex-col sm:ml-5 sm:flex-row sm:flex-wrap`}>
                              <dd className={`flex items-center text-md leading-5 text-gray-500 font-medium sm:mr-6`}>
                                <svg className={`flex-shrink-0 mr-2 h-5 w-5 text-gray-400`} viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" clipRule="evenodd" />
                                </svg>
                                {page.count > 0 ? page.count + " pages found" : "No pages found"}
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`btn-crawler absolute mt-4`}>
                  {user.permissions.includes("can_start_scan") ? (
                    recrawlable ? (
                      <button
                        type={`button`}
                        onClick={onCrawlHandler}
                        className={`w-32 mt-3 mr-3 rounded-md shadow sm:mt-0 relative items-center px-4 py-2 border border-transparent text-sm uppercase leading-5 font-medium rounded-md block text-white text-center bg-gray-1000 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:border-gray-900 focus:shadow-outline-gray active:bg-gray-900 transition ease-in-out duration-150`}
                      >
                        Recrawl
                      </button>
                    ) : (
                      <button
                        disabled={`disabled`}
                        type={`button`}
                        className={`w-32 mt-3 mr-3 rounded-md shadow sm:mt-0 relative items-center px-4 py-2 border border-transparent text-sm uppercase leading-5 font-medium rounded-md block text-white text-center bg-gray-1000 opacity-50 cursor-not-allowed`}
                      >
                        Recrawl
                      </button>
                    )
                  ) : null}
                </div>
                <div className={`max-w-full mx-auto px-4 py-4 sm:px-6 md:px-8`}>
                  <LinkOptions
                    searchKey={searchKey}
                    onSearchEvent={searchEventHandler}
                  />
                  <PageFilter
                    onFilterChange={filterChangeHandler}
                    allFilter={allFilter}
                    largePageSizeFilter={largePageSizeFilter}
                    brokenSecurityFilter={brokenSecurityFilter}
                  />
                  <Pagination
                    href="/dashboard/site/[siteId]/pages"
                    pathName={pagePath}
                    apiEndpoint={scanApiEndpoint}
                    page={props.result.page ? props.result.page : 0}
                    linksPerPage={linksPerPage}
                    onItemsPerPageChange={onItemsPerPageChange}
                  />
                  <div className={`py-4`}>
                    <div className={`flex flex-col`}>
                      <div
                        className={`-my-2 py-2 overflow-x-auto sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8`}
                      >
                        <div
                          className={`align-middle inline-block min-w-full shadow-xs overflow-hidden rounded-lg border-gray-200`}
                        >
                          <table className={`min-w-full`}>
                            <thead>
                              <tr>
                                {LinksPagesContent.map((site, key) => {
                                  return (
                                    <Fragment key={key}>
                                      <th
                                        className={`px-6 py-3 border-b border-gray-200 bg-white text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider`}
                                      >
                                        <div
                                          className={`flex items-center justify-start`}
                                        >
                                          {site.slug != undefined ? (
                                            <PageSorting
                                              sortOrder={sortOrder}
                                              onSortHandler={SortHandler}
                                              key={key}
                                              slug={site.slug}
                                            />
                                          ) : null}
                                          <span className="label flex items-center">
                                            {site.label}
                                          </span>
                                        </div>
                                      </th>
                                    </Fragment>
                                  );
                                })}
                              </tr>
                            </thead>
                            {page.results &&
                              page.results.map((val, key) => (
                                <PageTable key={key} val={val} />
                              ))}
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Pagination
                    href="/dashboard/site/[siteId]/pages"
                    pathName={pagePath}
                    apiEndpoint={scanApiEndpoint}
                    page={props.result.page ? props.result.page : 0}
                    linksPerPage={linksPerPage}
                    onItemsPerPageChange={onItemsPerPageChange}
                  />
                </div>

                <div
                  className={`static bottom-0 w-full mx-auto px-4 sm:px-6 py-4`}
                >
                  <SiteFooter />
                </div>
              </main>
            </div>
          </PagesDiv>
        </Fragment>
      ) : null}
    </Layout>
  );
};

export async function getServerSideProps(context) {
  // console.log('[Query]', context.query)
  return {
    props: {
      result: context.query,
    },
  };
}

export default Pages;
