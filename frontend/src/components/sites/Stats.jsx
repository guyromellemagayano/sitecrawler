// React
import { useState, useEffect } from "react";

// External
import loadable from "@loadable/component";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";
import tw from "twin.macro";

// JSON
import StatsLabel from "public/labels/components/sites/Stats.json";

// Hooks
import { useScan, useStats, useLinks, useImages } from "src/hooks/useSite";

// Components
const PageSvg = loadable(() => import("src/components/svg/outline/PageSvg"));
const LinksSvg = loadable(() => import("src/components/svg/outline/LinksSvg"));
const ImageSvg = loadable(() => import("src/components/svg/outline/ImageSvg"));
const InformationCircleSvg = loadable(() =>
  import("src/components/svg/outline/InformationCircleSvg")
);
const SiteStatsSkeleton = loadable(() =>
  import("src/components/skeletons/SiteStatsSkeleton")
);

const SitesStats = ({ crawlableHandler, sid, user }) => {
  const [componentReady, setComponentReady] = useState(false);
  const [imagesData, setImagesData] = useState([]);
  const [linksData, setLinksData] = useState([]);
  const [scanData, setScanData] = useState([]);
  const [scanObjId, setScanObjId] = useState(0);
  const [statsData, setStatsData] = useState([]);

  // FIXME: if user.permissions.includes("can_see_images") > apply images
  // add code here
  // ---------------------
  // ---------------------

  // const setLinkErrors = (type) => {
  //   let valLength = 0;

  //   if (links) {
  //     links.results.map((val, key) => {
  //       if (
  //         val.status === "HTTP_ERROR" ||
  //         val.status === "TIMEOUT" ||
  //         val.status === "OTHER_ERROR"
  //       ) {
  //         if (val.type === type) {
  //           valLength++;
  //         }
  //       }
  //     });
  //   }

  //   return valLength;
  // };

  const { scan: scan, scanError: scanError } = useScan({
    querySid: sid,
    refreshInterval: 1000,
  });

  useEffect(() => {
    if (scan && scan !== undefined && Object.keys(scan).length > 0) {
      setScanData(scan);

      if (
        scanData.results &&
        scanData.results !== undefined &&
        Object.keys(scanData.results).length > 0
      ) {
        setScanObjId(scanData.results[scanData.results.length - 1].id);
      }
    }

    if (
      scanError &&
      scanError.message !== "" &&
      scanError.message !== undefined
    ) {
      // TODO: add generic alert here
      console.log("ERROR: " + scanError.message);
    }
  });

  const { stats: stats, statsError: statsError } = useStats({
    querySid: sid,
    scanObjId: scanObjId,
  });

  const { links: links, linksError: linksError } = useLinks({
    querySid: sid,
    scanObjId: scanObjId,
  });

  const { images: images, imagesError: imagesError } = useImages({
    querySid: sid,
    scanObjId: scanObjId,
  });

  useEffect(() => {
    if (statsData && stats !== undefined && Object.keys(stats).length > 0) {
      setStatsData(stats);
    }

    if (links && links !== undefined && Object.keys(links).length > 0) {
      setLinksData(links);
    }

    if (images && images !== undefined && Object.keys(images).length > 0) {
      setImagesData(images);
    }

    if (statsError || linksError || imagesError) {
      // TODO: add generic alert here
      console.log(
        "ERROR: " + statsError.message !== "" &&
          statsError.message !== undefined
          ? statsError.message
          : linksError.message !== "" && linksError.message !== undefined
          ? linksError
          : imagesError.message !== "" && imagesError.message !== undefined
          ? imagesError.message
          : StatsLabel[1].label
      );
    }
  }, [stats, links, images]);

  useEffect(() => {
    if (user && statsData && linksData && imagesData) {
      setTimeout(() => {
        setComponentReady(true);
      }, 500);
    }
  }, [user, statsData, linksData, imagesData]);

  const setSeoErrors = () => {
    let valLength = 0;

    if (statsData) {
      if (
        (statsData.num_pages_without_title !== 0 &&
          statsData.num_pages_without_title !== undefined) ||
        (statsData.num_pages_without_description !== 0 &&
          statsData.num_pages_without_description !== undefined) ||
        (statsData.num_pages_without_h1_first !== 0 &&
          statsData.num_pages_without_h1_first !== undefined) ||
        (statsData.num_pages_without_h2_first !== 0 &&
          statsData.num_pages_without_h2_first !== undefined)
      ) {
        valLength =
          (statsData ? statsData.num_pages_without_title : 0) +
          (statsData ? statsData.num_pages_without_description : 0) +
          (statsData ? statsData.num_pages_without_h1_first : 0) +
          (statsData ? statsData.num_pages_without_h2_first : 0);
      }
    }

    return valLength;
  };

  const setPageErrors = () => {
    let valLength = 0;

    if (stats) {
      if (
        (statsData.num_pages_big !== 0 &&
          statsData.num_pages_big !== undefined) ||
        (statsData.num_pages_tls_non_ok !== 0 &&
          statsData.num_pages_tls_non_ok !== undefined)
      ) {
        valLength =
          (statsData ? statsData.num_pages_big : 0) +
          (statsData ? statsData.num_pages_tls_non_ok : 0);
      }
    }

    return valLength;
  };

  const setImageErrors = () => {
    let valLength = 0;

    if (stats) {
      if (
        statsData.num_non_ok_images !== 0 &&
        statsData.num_non_ok_images !== undefined
      ) {
        valLength = statsData ? statsData.num_non_ok_images : 0;
      }
    }

    return valLength;
  };

  useEffect(() => {
    if (
      statsData &&
      statsData !== undefined &&
      Object.keys(statsData).length > 0
    ) {
      if (statsData.finished_at) crawlableHandler(true);
      else if (statsData.started_at && statsData.finished_at == null)
        crawlableHandler(false);
    }
  }, [statsData]);

  const PageTabs = [
    {
      title: "Total Issues",
      count:
        statsData &&
        statsData !== undefined &&
        Object.keys(statsData).length > 0 &&
        statsData.num_non_ok_links +
          setSeoErrors() +
          setPageErrors() +
          setImageErrors(),
    },
    {
      title: "Total Pages",
      count:
        statsData &&
        statsData !== undefined &&
        Object.keys(statsData).length > 0 &&
        statsData.num_pages,
    },
    {
      title: "Total Links",
      count:
        statsData &&
        statsData !== undefined &&
        Object.keys(statsData).length > 0 &&
        statsData.num_links,
    },
    {
      title: "Total Images",
      count:
        statsData &&
        statsData !== undefined &&
        Object.keys(statsData).length > 0 &&
        statsData.num_images,
    },
  ];

  return componentReady ? (
    <div tw="px-6 py-5 sm:p-6  bg-white overflow-hidden rounded-lg">
      <h2 tw="text-lg font-bold leading-7 text-gray-900">
        {StatsLabel[0].label}
      </h2>
      <div tw="grid grid-cols-2 h-full overflow-hidden py-6">
        {PageTabs.map((val, key) => {
          return (
            <div
              key={key}
              tw="flex items-center justify-start space-y-px space-x-px"
            >
              <div tw="flex items-start justify-center">
                <dl tw="mr-2 mr-1">
                  <dt>
                    {val.title === "Total Pages" ? (
                      <PageSvg
                        className={tw`mr-3 mr-1 h-9 h-7 w-8 h-6 text-gray-500`}
                      />
                    ) : val.title === "Total Links" ? (
                      <LinksSvg
                        className={tw`mr-3 mr-1 h-9 h-7 w-8 h-6 text-gray-500`}
                      />
                    ) : val.title === "Total Images" ? (
                      <ImageSvg
                        className={tw`mr-3 mr-1 h-9 h-7 w-8 h-6 text-gray-500`}
                      />
                    ) : (
                      <InformationCircleSvg
                        className={tw`mr-3 mr-1 h-9 h-7 w-8 h-6 text-gray-500`}
                      />
                    )}
                  </dt>
                </dl>
                <dl>
                  <dt tw="text-sm text-xs lg:text-sm leading-5 font-medium text-gray-500 truncate">
                    {val.title}
                  </dt>

                  {val.title === "Total Issues" && val.count > 0 ? (
                    <dd tw="mt-1 text-3xl leading-9 font-semibold text-red-700">
                      {val.count}
                    </dd>
                  ) : (
                    <dd tw="mt-1 text-3xl leading-9 font-semibold text-gray-900">
                      {val.count}
                    </dd>
                  )}
                </dl>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  ) : (
    <SiteStatsSkeleton />
  );
};

SitesStats.propTypes = {};

export default SitesStats;
