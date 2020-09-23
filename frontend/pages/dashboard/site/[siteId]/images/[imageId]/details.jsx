import { Fragment, useState } from "react";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/router";
import fetch from "node-fetch";
import useSWR from "swr";
import Cookies from "js-cookie";
import styled from "styled-components";
import { CopyToClipboard } from "react-copy-to-clipboard";
import bytes from "bytes";
import Moment from "react-moment";
import Layout from "components/Layout";
import MobileSidebar from "components/sidebar/MobileSidebar";
import MainSidebar from "components/sidebar/MainSidebar";
import SiteDangerBadge from "components/badges/SiteDangerBadge";
import SiteSuccessBadge from "components/badges/SiteSuccessBadge";
import SiteWarningBadge from "components/badges/SiteWarningBadge";
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

const ImagesDetailDiv = styled.section`
  .url-heading {
    font-size: 1.4rem;
  }
`;

const ImagesDetail = () => {
  const [openMobileSidebar, setOpenMobileSidebar] = useState(false);
  const [copyValue, setCopyValue] = useState(null);
  const [copied, setCopied] = useState(false);

  const calendarStrings = {
    lastDay: "[Yesterday], dddd",
    sameDay: "[Today], dddd",
    lastWeek: "MMMM DD, YYYY",
    sameElse: "MMMM DD, YYYY",
  };

  const imageTitle = `Image Detail |`;

  const handleUrlCopy = (e) => {
    setCopyValue(e);
    setCopied(true);
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

  const imageApiEndpoint = `/api/site/${query.siteId}/scan/${scanObjId}/image/`;

  const { data: image, error: imageError } = useSWR(
    () => (query.siteId && scanObjId ? imageApiEndpoint : null),
    fetcher
  );

  const imageLocationApiEndpoint = `/api/site/${query.siteId}/scan/${scanObjId}/image/${query.imageId}/`;

  const { data: imageLocation, error: imageLocationError } = useSWR(
    () =>
      query.siteId && scanObjId && query.imageId
        ? imageLocationApiEndpoint
        : null,
    fetcher
  );

  {
    imageLocationError && <Layout>{imageLocationError.message}</Layout>;
  }
  {
    imageError && <Layout>{imageError.message}</Layout>;
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

  // console.log(imageLocation)

  return (
    <Layout>
      {imageLocation && image && site && user ? (
        <Fragment>
          <Head>
            <title>
              {imageTitle} {imageLocation.url}
            </title>
          </Head>

          <ImagesDetailDiv
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
                        href="/dashboard/site/[siteId]/images"
                        as={"/dashboard/site/" + query.siteId + "/images"}
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
                          Back to Images
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
                        href="/dashboard/site/[siteId]/images"
                        as={"/dashboard/site/" + query.siteId + "/images"}
                      >
                        <a
                          className={`whitespace-no-wrap font-medium text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out`}
                        >
                          All images
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
                        href={
                          "/dashboard/site/[siteId]/images/[imageId]/details"
                        }
                        as={
                          "/dashboard/site/" +
                          query.siteId +
                          "/images/" +
                          query.imageId +
                          "/details"
                        }
                      >
                        <a
                          className={`truncate font-medium text-gray-500 hover:text-gray-700 transition duration-150 ease-in-out`}
                        >
                          {imageLocation.url}
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
                        Image Details for: <br />
                        <a
                          href={imageLocation.url}
                          target={`_blank`}
                          title={imageLocation.url}
                          className={`url-heading font-bold leading-7 sm:text-3xl sm:leading-9 block mr-3 text-sm font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150 break-words whitespace-normal`}
                        >
                          {imageLocation.url}
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
                                  date={imageLocation.created_at}
                                  local
                                />
                                &nbsp;
                                <Moment
                                  date={imageLocation.created_at}
                                  format="hh:mm:ss A"
                                  local
                                />
                              </Fragment>
                            ) : (
                              <Fragment>
                                <Moment
                                  calendar={calendarStrings}
                                  date={imageLocation.created_at}
                                  utc
                                />
                                &nbsp;
                                <Moment
                                  date={imageLocation.created_at}
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
                            Type
                          </dt>
                          <dd
                            className={`mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2`}
                          >
                            {imageLocation.type === "PAGE"
                              ? "Page"
                              : imageLocation.type === "EXTERNAL"
                              ? "External"
                              : imageLocation.type === "NON_WEB"
                              ? "Non-Web"
                              : "Other"}
                          </dd>
                        </div>
                        <div
                          className={`mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:px-6 sm:py-5`}
                        >
                          <dt
                            className={`text-sm leading-5 font-medium text-gray-500`}
                          >
                            Status
                          </dt>
                          <dd
                            className={`mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2`}
                          >
                            {imageLocation.status === "OK" ? (
                              <SiteSuccessBadge text={"OK"} />
                            ) : imageLocation.status === "TIMEOUT" ? (
                              <SiteWarningBadge text={"TIMEOUT"} />
                            ) : imageLocation.status === "HTTP_ERROR" ? (
                              <SiteDangerBadge text={"HTTP ERROR"} />
                            ) : (
                              <SiteDangerBadge text={"OTHER ERROR"} />
                            )}
                          </dd>
                        </div>
                        {imageLocation.error !== null &&
                        imageLocation.error !== undefined ? (
                          <div
                            className={`mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:px-6 sm:py-5`}
                          >
                            <dt
                              className={`text-sm leading-5 font-medium text-gray-500`}
                            >
                              Error
                            </dt>
                            <dd
                              className={`mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2`}
                            >
                              <SiteDangerBadge text={imageLocation.error} />
                            </dd>
                          </div>
                        ) : null}
                      </dl>
                    </div>
                    <div
                      className={`mt-8 sm:mt-0 sm:grid sm:grid-cols-3 sm:gap-4 sm:border-t sm:border-gray-200 sm:px-6 sm:py-5`}
                    >
                      <dt
                        className={`text-sm leading-5 font-medium text-gray-500`}
                      >
                        Image Size
                      </dt>
                      <dd
                        className={`mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2`}
                      >
                        {imageLocation.size !== null &&
                        imageLocation.size !== undefined &&
                        imageLocation.size !== "" ? (
                          bytes(imageLocation.size, {
                            thousandsSeparator: " ",
                            unitSeparator: " ",
                          })
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
                        Page Links
                      </dt>
                      <dd
                        className={`mt-1 text-sm leading-5 text-gray-900 sm:mt-0 sm:col-span-2`}
                      >
                        <ul className={`border border-gray-200 rounded-md`}>
                          {imageLocation.pages.map((val, key) => {
                            return (
                              <li
                                key={key}
                                className={`border-b border-gray-200 pl-3 pr-4 py-3 flex items-center justify-between text-sm leading-5`}
                              >
                                <div className={`w-0 flex-1 flex items-center`}>
                                  <svg
                                    className={`flex-shrink-0 h-5 w-5 text-gray-400`}
                                    fill="none"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  <span className={`ml-2 flex-1 w-0`}>
                                    <a
                                      href={val.url}
                                      target={`_blank`}
                                      title={val.url}
                                      className={`break-words block p-2 font-medium text-indigo-600 hover:text-indigo-500 transition duration-150 ease-in-out`}
                                    >
                                      {val.url}
                                    </a>
                                  </span>
                                </div>
                                <div className={`ml-4 flex-shrink-0`}>
                                  <CopyToClipboard
                                    onCopy={handleUrlCopy}
                                    text={val.url}
                                  >
                                    <button
                                      className={`font-medium text-indigo-600 hover:text-indigo-500 transition duration-150 ease-in-out`}
                                    >
                                      {copied && copyValue === val.url
                                        ? "Copied!"
                                        : "Copy URL"}
                                    </button>
                                  </CopyToClipboard>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </dd>
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
          </ImagesDetailDiv>
        </Fragment>
      ) : null}
    </Layout>
  );
};

export default ImagesDetail;
