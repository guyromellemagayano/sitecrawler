import { useEffect } from "react";
import { useRouter } from "next/router";
import fetch from "node-fetch";
import Cookies from "js-cookie";
import useSWR from "swr";
import Link from "next/link";
import styled from "styled-components";
import Skeleton from "react-loading-skeleton";
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

const SitesStatsDiv = styled.footer``;

const SitesStats = (props) => {
  const { query } = useRouter();
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

  const { data: stats, error: statsError } = useSWR(
    () =>
      query.siteId && scanObjId
        ? `/api/site/${query.siteId}/scan/${scanObjId}/`
        : null,
    fetcher,
    {
      refreshInterval: 1000,
    }
  );

  const { data: links, error: linksError } = useSWR(
    () =>
      query.siteId && scanObjId
        ? `/api/site/${query.siteId}/scan/${scanObjId}/link/`
        : null,
    fetcher,
    {
      refreshInterval: 1000,
    }
  );

  const { data: images, error: imagesError } = useSWR(
    () =>
      props.url.siteId && scanObjId
        ? `/api/site/${props.url.siteId}/scan/${scanObjId}/image/?tls_status=NONE&tls_status=ERROR`
        : null,
    fetcher,
    {
      refreshInterval: 1000,
    }
  );

  const setLinkErrors = type => {
    let valLength = 0;

    if (links) {
      links.results.map((val, key) => {
        if (
          val.status === "HTTP_ERROR" ||
          val.status === "TIMEOUT" ||
          val.status === "OTHER_ERROR"
        ) {
          if (val.type === type) {
            valLength++;
          }
        }
      });
    }

    return valLength;
  };

  const setSeoErrors = () => {
    let valLength = 0;

    if (stats) {
      if (
        (stats.num_pages_without_title !== 0 && stats.num_pages_without_title !== undefined) ||
        (stats.num_pages_without_description !== 0 && stats.num_pages_without_description !== undefined) ||
        (stats.num_pages_without_h1_first !== 0 && stats.num_pages_without_h1_first !== undefined) ||
        (stats.num_pages_without_h2_first !== 0 && stats.num_pages_without_h2_first !== undefined)
      ) {
        valLength = (stats ? stats.num_pages_without_title : 0) + (stats ? stats.num_pages_without_description : 0) + (stats ? stats.num_pages_without_h1_first : 0) + (stats ? stats.num_pages_without_h2_first : 0);
      }
    }

    return valLength;
  };

  const setPageErrors = () => {
    let valLength = 0;

    if (stats) {
      if (
        (stats.num_pages_big !== 0 && stats.num_pages_big !== undefined) ||
        (stats.num_pages_tls_non_ok !== 0 && stats.num_pages_tls_non_ok !== undefined)
      ) {
        valLength = (stats ? stats.num_pages_big : 0) + (stats ? stats.num_pages_tls_non_ok : 0);
      }
    }

    return valLength;
  };

  const setImageErrors = () => {
    let valLength = 0;

    if (stats) {
      if (
        stats.num_non_ok_images !== 0 && stats.num_non_ok_images !== undefined
      ) {
        valLength = stats ? stats.num_non_ok_images : 0;
      }
    }

    if (images !== undefined) {
      if (
        images.count !== 0 && images.count !== undefined
      ) {
        valLength = valLength + (images.count ? images.count : 0);
      }
    } else {
      valLength = valLength + 10;
    }

    return valLength;
  };

  useEffect(() => {
    if (stats && stats.finished_at) props.crawlableHandler(true);
    else if (stats && stats.started_at && stats.finished_at == null)
      props.crawlableHandler(false);
  }, [stats]);

  {
    statsError && <Layout>{statsError.message}</Layout>;
  }
  {
    scanError && <Layout>{scanError.message}</Layout>;
  }
  {
    linksError && <Layout>{linksError.message}</Layout>;
  }
  {
    imagesError && <Layout>{imagesError.message}</Layout>;
  }

  if (!stats && !scan && !links) {
    return (
      <SitesStatsDiv>
        <div>
          <div
            className={`mt-2 grid grid-cols-1 gap-5 sm:grid-cols-6 sm:gap-64`}
          >
            <Skeleton duration={2} width={280} height={160} />
            <Skeleton duration={2} width={280} height={160} />
          </div>
        </div>
      </SitesStatsDiv>
    );
  } else {
    const PageTabs = [
      {
        title: "Total Issues",
        count: setLinkErrors('PAGE') + setLinkErrors('EXTERNAL') + setSeoErrors() + setPageErrors() + setImageErrors()
      },
      {
        title: "Total Pages",
        count: stats && stats.num_pages
      },
      {
        title: "Total Links",
        count: stats && stats.num_links
      },
      {
        title: "Total Images",
        count: stats && stats.num_images
      },
    ];
    
    return (
      <SitesStatsDiv>
        <div>
          <div
            className={`mt-2 mb-4 py-6 grid grid-cols-1 sm:grid-cols-4 bg-white overflow-hidden shadow-xs rounded-lg divide-x divide-gray-300`}
          >
            {PageTabs.map((val, key) => {
              return (
                <div key={key} className={`flex items-center justify-center`}>
                  <div className={`flex items-start justify-center`}>
                    <dl className={`mr-2`}>
                      <dt>
                        {val.title === "Total Pages" ? (
                          <svg
                            className={`mr-3 h-9 w-8 text-gray-500 group-hover:text-gray-500 group-focus:text-gray-500 transition ease-in-out duration-150`}
                            stroke={`currentColor`}
                            fill={`none`}
                            viewBox={`0 0 24 24`}
                          >
                            <path
                              strokeLinecap={`round`}
                              strokeLinejoin={`round`}
                              strokeWidth={`2`}
                              d={`M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z`}
                            />
                          </svg>
                        ) : val.title === "Total Links" ? (
                          <svg
                            className={`mr-3 h-9 w-8 text-gray-500 group-hover:text-gray-500 group-focus:text-gray-500 transition ease-in-out duration-150`}
                            stroke={`currentColor`}
                            fill={`none`}
                            viewBox={`0 0 24 24`}
                          >
                            <path
                              strokeLinecap={`round`}
                              strokeLinejoin={`round`}
                              strokeWidth={`2`}
                              d={`M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1`}
                            />
                          </svg>
                        ) : val.title === "Total Images" ? (
                          <svg
                            className={`mr-3 h-9 w-8 text-gray-500 group-hover:text-gray-500 group-focus:text-gray-500 transition ease-in-out duration-150`}
                            stroke={`currentColor`}
                            fill={`none`}
                            viewBox={`0 0 24 24`}
                          >
                            <path
                              strokeLinecap={`round`}
                              strokeLinejoin={`round`}
                              strokeWidth={`2`}
                              d={`M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z`}
                            />
                          </svg>
                        ) : (
                          <svg
                            className={`mr-3 h-9 w-8 text-gray-500 group-hover:text-gray-500 group-focus:text-gray-500 transition ease-in-out duration-150`}
                            stroke={`currentColor`}
                            fill={`none`}
                            viewBox={`0 0 24 24`}
                          >
                            <path
                              strokeLinecap={`round`}
                              strokeLinejoin={`round`}
                              strokeWidth={`2`}
                              d={`M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z`}
                            />
                          </svg>
                        )}
                      </dt>
                    </dl>
                    <dl>
                      <dt
                        className={`text-sm leading-5 font-medium text-gray-500 truncate`}
                      >
                        {val.title}
                      </dt>
                      <dd
                        className={`mt-1 text-3xl leading-9 font-semibold text-gray-900`}
                      >
                        {val.count}
                      </dd>
                    </dl>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </SitesStatsDiv>
    );
  }
};

export default SitesStats;
