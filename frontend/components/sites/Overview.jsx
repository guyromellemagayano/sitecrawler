import { Fragment } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Cookies from "js-cookie";
import useSWR from "swr";
import styled from "styled-components";
import Moment from "react-moment";
import ReactTooltip from "react-tooltip";
import Skeleton from "react-loading-skeleton";
import SiteSuccessStatus from "components/status/SiteSuccessStatus";
import SiteWarningStatus from "components/status/SiteWarningStatus";
import SiteDangerStatus from "components/status/SiteDangerStatus";

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

const SitesOverviewDiv = styled.div`
  height: 100%;
  min-height: 25rem;
`;

const SitesOverview = (props) => {
  const { query } = useRouter();
  const userApiEndpoint = "/api/auth/user/";
  const calendarStrings = {
    lastDay: "[Yesterday], dddd",
    sameDay: "[Today], dddd",
    lastWeek: "MMMM DD, YYYY",
    sameElse: "MMMM DD, YYYY",
  };

  const { data: user, error: userError } = useSWR(userApiEndpoint, fetcher);
  const { data: scan, error: scanError } = useSWR(
    () =>
      props.id ? `/api/site/${props.id}/scan/?ordering=-finished_at` : null,
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

  const { data: stats, error: statsError } = useSWR(() =>
    props.id && scanObjId ? `/api/site/${props.id}/scan/${scanObjId}/` : null
  );

  const { data: nonTlsPages, error: nonTlsPagesError } = useSWR(() => 
    props.id && scanObjId ? `/api/site/${props.id}/scan/${scanObjId}/page?tls_total=false` : null
  );

  if (userError) return <div>{userError.message}</div>;
  if (scanError) return <div>{scanError.message}</div>;
  if (statsError) return <div>{statsError.message}</div>;
  if (nonTlsPagesError) return <div>{nonTlsPagesError.message}</div>;

  if (!user || !scan || !stats || !nonTlsPages) {
    return <Skeleton width={280} height={198} duration={2} />;
  }

  return (
    <Fragment>
      <style jsx>{`
        .btn-crawler {
          top: 0;
          right: 0;
          padding: 2.25rem 1.5rem;
        }
      `}</style>
      <div className={`btn-crawler absolute mt-4`}>
        {user.permissions.includes("can_start_scan") ? (
          props.crawlable ? (
            <button
              type={`button`}
              onClick={props.onCrawl}
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
      <SitesOverviewDiv>
        <div className={`bg-white overflow-hidden shadow-xs rounded-lg h-full`}>
          <div className={`px-4 py-5 sm:p-6`}>
            <h2 className={`text-lg font-bold leading-7 text-gray-900 mb-5`}>
              Site Status
            </h2>
            <dl className={`mb-8 max-w-xl text-sm leading-5`}>
              {!user.settings.disableLocalTime ? (
                <Fragment>
                  <dt className={`text-sm leading-5 font-medium text-gray-500`}>
                    Last Crawled
                  </dt>
                  <dd className={`mt-1 text-sm leading-5 text-gray-900`}>
                    <Moment
                      calendar={calendarStrings}
                      date={props.finishedAt}
                      local
                    />
                    &nbsp;
                    <Moment date={props.finishedAt} format="hh:mm:ss A" local />
                  </dd>
                </Fragment>
              ) : (
                <Fragment>
                  <dt className={`text-sm leading-5 font-medium text-gray-500`}>
                    Last Crawled
                  </dt>
                  <dd className={`mt-1 text-sm leading-5 text-gray-900`}>
                    <Moment
                      calendar={calendarStrings}
                      date={props.finishedAt}
                      utc
                    />
                    &nbsp;
                    <Moment date={props.finishedAt} format="hh:mm:ss A" utc />
                  </dd>
                </Fragment>
              )}
            </dl>
            <dl
              className={`grid grid-cols-1 col-gap-4 row-gap-8 sm:grid-cols-2`}
            >
              <div className={`sm:col-span-1`}>
                <dt className={`text-sm leading-5 font-medium text-gray-500`}>
                  Site Status
                </dt>
                <dd className={`mt-1 text-sm leading-5 text-gray-900`}>
                  {props.verified ? (
                    <SiteSuccessStatus text={`Verified`} />
                  ) : (
                    <SiteDangerStatus text={`Unverified`} />
                  )}
                </dd>
              </div>
              <div className={`sm:col-span-1`}>
                <dt className={`text-sm leading-5 font-medium text-gray-500`}>
                  SSL Valid
                </dt>
                <dd className={`mt-1 text-sm leading-5 text-gray-900`}>
                  {stats.num_pages_tls_non_ok == 0 &&
                  stats.num_pages_tls_non_ok !== undefined ? (
                    <SiteSuccessStatus text={`Valid`} />
                  ) : (
                    <Fragment>
                      <span className={`flex items-center justify-start`}>
                        <SiteDangerStatus text={`Not Valid`} />
                        <a
                          data-tip={``}
                          data-for={`stats-tls-not-ok`}
                          data-background-color={`#E53E3E`}
                          data-iscapture={true}
                          data-scroll-hide={false}
                          className={`flex cursor-pointer`}
                        >
                          <span className={`ml-2 inline-block w-4 h-4 overflow-hidden`}>
                            <svg
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              className={`text-red-400`}
                            >
                              <path
                                fillRule="evenodd"
                                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                                clipRule="evenodd"
                              ></path>
                            </svg>
                          </span>
                        </a>
                        <ReactTooltip
                          id={`stats-tls-not-ok`}
                          className={`ssl-valid-tooltip w-32`}
                          type={`dark`}
                          effect={`solid`}
                          place={`bottom`}
                          clickable={true}
                          multiline={true}
                          delayHide={500}
                          delayShow={500}
                        >
                          <span
                            className={`text-left text-xs leading-4 font-normal text-white normal-case tracking-wider`}
                          >
                            <p>
                              <strong className={`block mb-3`}>Here are our findings:</strong>
                              Apparently you have {nonTlsPages.count} pages that have some TLS issues. You can check this 
                              <strong className={`ml-1`}>
                                {
                                  <Link 
                                    href={`/dashboard/site/[siteId]/pages/?tls_total=false`}
                                    as={`/dashboard/site/${query.siteId}/pages/?tls_total=false`}
                                  >
                                    <a className={`hover:text-red-300`}>link</a>
                                  </Link>
                                }
                              </strong> for more information.
                            </p>
                          </span>
                        </ReactTooltip>
                      </span>
                    </Fragment>
                  )}
                </dd>
              </div>
              <div className={`sm:col-span-1`}>
                <dt className={`text-sm leading-5 font-medium text-gray-500`}>
                  Forced HTTPS
                </dt>
                <dd className={`mt-1 text-sm leading-5 text-gray-900`}>
                  <SiteWarningStatus text={`Coming Soon`} />
                </dd>
              </div>
              <div className={`sm:col-span-1`}>
                <dt className={`text-sm leading-5 font-medium text-gray-500`}>
                  Crawl Status
                </dt>
                <dd className={`mt-1 text-sm leading-5 text-gray-900`}>
                  {props.crawlFinished ? (
                    <SiteSuccessStatus text={`Finished`} />
                  ) : (
                    <SiteWarningStatus text={`In Progress`} />
                  )}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </SitesOverviewDiv>
    </Fragment>
  );
};

export default SitesOverview;

SitesOverview.propTypes = {};
