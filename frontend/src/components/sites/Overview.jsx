// React
import { useState, useEffect } from "react";

// NextJS
import Link from "next/link";

// External
import PropTypes from "prop-types";
import loadable from "@loadable/component";
import Moment from "react-moment";
import ReactTooltip from "react-tooltip";
import Skeleton from "react-loading-skeleton";
import tw from "twin.macro";

// JSON
import OverviewLabel from "public/labels/components/sites/Overview.json";

// Hooks
import { useScan, useStats, useNonTlsPages } from "src/hooks/useSite";

// Components
const InformationCircleSvg = loadable(() =>
  import("src/components/svg/solid/InformationCircleSvg")
);
const SiteDangerStatus = loadable(() =>
  import("src/components/status/SiteDangerStatus")
);
const SiteSuccessStatus = loadable(() =>
  import("src/components/status/SiteSuccessStatus")
);
const SiteWarningStatus = loadable(() =>
  import("src/components/status/SiteWarningStatus")
);
const SitesOverviewSkeleton = loadable(() =>
  import("src/components/skeletons/SitesOverviewSkeleton")
);

const SitesOverview = ({
  id,
  verified,
  finishedAt,
  forceHttps,
  onCrawl,
  crawlable,
  crawlFinished,
  user,
}) => {
  const [componentReady, setComponentReady] = useState(false);
  const [nonTlsPagesData, setNonTlsPagesData] = useState([]);
  const [scanData, setScanData] = useState([]);
  const [statsData, setStatsData] = useState([]);

  let scanObjId = "";

  const calendarStrings = {
    lastDay: "[Yesterday], dddd",
    sameDay: "[Today], dddd",
    lastWeek: "MMMM DD, YYYY",
    sameElse: "MMMM DD, YYYY",
  };

  const { scan: scan, scanError: scanError } = useScan({
    querySid: id,
  });

  useEffect(() => {
    if (scan && scan !== undefined && Object.keys(scan).length > 0) {
      setScanData(scan);

      if (scanData.results && scanData.results !== undefined) {
        let scanObj = [];

        scanData.results.map((val) => {
          scanObj.push(val);
          return scanObj;
        });

        scanObj.map((val, index) => {
          if (index == 0) scanObjId = val.id;

          return scanObjId;
        });
      }
    }
  }, [scan]);

  const { stats: stats, statsError: statsError } = useStats({
    querySid: id,
    scanObjId: scanObjId,
  });

  const {
    nonTlsPages: nonTlsPages,
    nonTlsPagesError: nonTlsPagesError,
  } = useNonTlsPages({
    querySid: id,
    scanObjId: scanObjId,
  });

  useEffect(() => {
    if (
      stats &&
      stats !== undefined &&
      Object.keys(stats).length > 0 &&
      nonTlsPages &&
      nonTlsPages !== undefined &&
      Object.keys(nonTlsPages).length > 0
    ) {
      setStatsData(stats);
      setNonTlsPagesData(nonTlsPages);
    }

    if (scanError || statsError || nonTlsPagesError) {
      // TODO: add generic alert here
      console.log(
        "ERROR: " + scanError
          ? scanError
          : statsError
          ? statsError
          : nonTlsPagesError
          ? nonTlsPagesError
          : OverviewLabel[2].label
      );
    }
  }, [scan, stats, nonTlsPages]);

  useEffect(() => {
    if (user && statsData && nonTlsPagesData) {
      setTimeout(() => {
        setComponentReady(true);
      }, 500);
    }
  }, [user, statsData, nonTlsPagesData]);

  return (
    <div tw="bg-white overflow-hidden rounded-lg h-full border">
      <div tw="px-4 py-5 sm:p-6">
        <div tw="flex items-center justify-between mb-5">
          <h2 tw="text-lg font-bold leading-7 text-gray-900">
            {componentReady ? (
              OverviewLabel[1].label
            ) : (
              <Skeleton duration={2} width={120} height={20} />
            )}
          </h2>
          <div className="btn-crawler">
            {componentReady ? (
              user &&
              user !== undefined &&
              Object.keys(user).length > 0 &&
              user.permissions.includes("can_start_scan") ? (
                <button
                  type="button"
                  disabled={crawlable}
                  onClick={onCrawl}
                  css={[
                    tw`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 focus:outline-none`,
                    !crawlFinished
                      ? tw`opacity-50 cursor-not-allowed`
                      : tw`hover:bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-500`,
                  ]}
                >
                  {crawlFinished
                    ? OverviewLabel[0].label
                    : OverviewLabel[6].label}
                </button>
              ) : null
            ) : (
              <Skeleton duration={2} width={150} height={40} />
            )}
          </div>
        </div>
        <dl tw="mb-8 max-w-xl text-sm leading-5">
          <dt tw="text-sm leading-5 font-medium text-gray-500">
            {componentReady ? (
              OverviewLabel[2].label
            ) : (
              <Skeleton duration={2} width={100} height={15} />
            )}
          </dt>
          {user &&
          user !== undefined &&
          Object.keys(user).length > 0 &&
          !user.settings.disableLocalTime ? (
            <dd tw="mt-1 text-sm leading-5 text-gray-900">
              {componentReady ? (
                <>
                  <Moment calendar={calendarStrings} date={finishedAt} local />
                  &nbsp;
                  <Moment date={finishedAt} format="hh:mm:ss A" local />
                </>
              ) : (
                <Skeleton duration={2} width={240} height={15} />
              )}
            </dd>
          ) : (
            <dd tw="mt-1 text-sm leading-5 text-gray-900">
              {componentReady ? (
                <>
                  <Moment calendar={calendarStrings} date={finishedAt} utc />
                  &nbsp;
                  <Moment date={finishedAt} format="hh:mm:ss A" utc />
                </>
              ) : (
                <Skeleton duration={2} width={240} height={15} />
              )}
            </dd>
          )}
        </dl>
        <dl tw="grid grid-cols-1 grid-cols-2 col-gap-4 row-gap-8 sm:grid-cols-2">
          <div tw="sm:col-span-1">
            <dt tw="text-sm leading-5 font-medium text-gray-500">
              {componentReady ? (
                OverviewLabel[1].label
              ) : (
                <Skeleton duration={2} width={100} height={15} />
              )}
            </dt>
            <dd tw="mt-1 text-sm leading-5 text-gray-900">
              {componentReady ? (
                verified && verified !== undefined ? (
                  <SiteSuccessStatus text="Verified" />
                ) : (
                  <SiteDangerStatus text="Unverified" />
                )
              ) : (
                <span tw="flex space-x-3">
                  <Skeleton circle={true} duration={2} width={15} height={15} />
                  <Skeleton duration={2} width={100} height={15} />
                </span>
              )}
            </dd>
          </div>
          {user &&
            user !== undefined &&
            Object.keys(user).length > 0 &&
            user.permissions.includes("can_see_pages") && (
              <div tw="sm:col-span-1">
                <dt tw="text-sm leading-5 font-medium text-gray-500">
                  {componentReady ? (
                    OverviewLabel[3].label
                  ) : (
                    <Skeleton duration={2} width={100} height={15} />
                  )}
                </dt>
                <dd tw="mt-1 text-sm leading-5 text-gray-900">
                  {componentReady ? (
                    verified && verified !== undefined ? (
                      statsData &&
                      statsData.num_pages_tls_non_ok == 0 &&
                      statsData.num_pages_tls_non_ok !== undefined ? (
                        <SiteSuccessStatus text="Valid" />
                      ) : (
                        <>
                          <span tw="flex items-center justify-start">
                            <SiteDangerStatus text="Not Valid" />

                            <a
                              data-tip=""
                              data-for="stats-tls-not-ok"
                              data-background-color="#E53E3E"
                              data-iscapture={true}
                              data-scroll-hide={false}
                              tw="inline-flex items-center ml-3 focus:outline-none"
                            >
                              <span tw="w-5 h-5">
                                <InformationCircleSvg
                                  className={tw`text-red-400`}
                                />
                              </span>
                            </a>
                            <ReactTooltip
                              id="stats-tls-not-ok"
                              className="ssl-valid-tooltip w-64"
                              type="dark"
                              effect="solid"
                              place="bottom"
                              clickable={true}
                              multiline={true}
                              delayHide={500}
                              delayShow={500}
                            >
                              <span tw="text-left text-xs leading-4 font-normal text-white normal-case tracking-wider">
                                <p>
                                  <strong tw="block mb-3">
                                    Here are our findings:
                                  </strong>
                                  Apparently you have{" "}
                                  {nonTlsPagesData && nonTlsPagesData.count}{" "}
                                  pages that have some TLS issues. You can check
                                  this
                                  <strong tw="ml-1">
                                    {
                                      <Link
                                        href="/dashboard/site/[siteId]/pages/?tls_total=false"
                                        as="/dashboard/site/${query.siteId}/pages/?tls_total=false"
                                      >
                                        <a tw="hover:text-red-300">link</a>
                                      </Link>
                                    }
                                  </strong>{" "}
                                  for more information.
                                </p>
                              </span>
                            </ReactTooltip>
                          </span>
                        </>
                      )
                    ) : (
                      <SiteDangerStatus text="Unverified" />
                    )
                  ) : (
                    <span tw="flex space-x-3">
                      <Skeleton
                        circle={true}
                        duration={2}
                        width={15}
                        height={15}
                      />
                      <Skeleton duration={2} width={100} height={15} />
                      <Skeleton
                        circle={true}
                        duration={2}
                        width={15}
                        height={15}
                      />
                    </span>
                  )}
                </dd>
              </div>
            )}
          <div tw="sm:col-span-1">
            <dt tw="text-sm leading-5 font-medium text-gray-500">
              {componentReady ? (
                OverviewLabel[4].label
              ) : (
                <Skeleton duration={2} width={100} height={15} />
              )}
            </dt>
            <dd tw="mt-1 text-sm leading-5 text-gray-900">
              {componentReady ? (
                forceHttps && forceHttps !== undefined ? (
                  <SiteSuccessStatus text="Yes" />
                ) : (
                  <SiteDangerStatus text="No" />
                )
              ) : (
                <span tw="flex space-x-3">
                  <Skeleton circle={true} duration={2} width={15} height={15} />
                  <Skeleton duration={2} width={100} height={15} />
                </span>
              )}
            </dd>
          </div>
          <div tw="sm:col-span-1">
            <dt tw="text-sm leading-5 font-medium text-gray-500">
              {componentReady ? (
                OverviewLabel[5].label
              ) : (
                <Skeleton duration={2} width={100} height={15} />
              )}
            </dt>
            <dd tw="mt-1 text-sm leading-5 text-gray-900">
              {componentReady ? (
                crawlFinished ? (
                  <SiteSuccessStatus text="Finished" />
                ) : (
                  <SiteWarningStatus text="In Progress" />
                )
              ) : (
                <span tw="flex space-x-3">
                  <Skeleton circle={true} duration={2} width={15} height={15} />
                  <Skeleton duration={2} width={100} height={15} />
                </span>
              )}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default SitesOverview;

SitesOverview.propTypes = {};
