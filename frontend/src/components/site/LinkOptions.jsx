// React
import { useState, useEffect } from "react";

// NextJS
import { useRouter } from "next/router";

// External
import { Transition } from "@headlessui/react";
import loadable from "@loadable/component";
import tw from "twin.macro";

// JSON
import LinkOptionsLabel from "public/labels/components/site/LinkOptionsLabel.json";

// Hooks
import { useScan, useStats } from "src/hooks/useSite";

// Components
const AddSiteSkeleton = loadable(() =>
  import("src/components/skeletons/AddSiteSkeleton")
);
const SearchSvg = loadable(() => import("src/components/svg/solid/SearchSvg"));

const LinkOptions = ({
  sid,
  user,
  site,
  searchKey,
  onSearchEvent,
  onCrawl,
  crawlable,
  crawlFinished,
  crawlableHandler,
}) => {
  const [componentReady, setComponentReady] = useState(false);
  const [scanData, setScanData] = useState([]);
  const [scanObjId, setScanObjId] = useState(0);
  const [statsData, setStatsData] = useState([]);

  const { asPath } = useRouter();

  const { scan: scan } = useScan({
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
        setScanObjId(
          scanData.results
            .map((e) => {
              return e.id;
            })
            .sort((a, b) => a.id - b.id)
            .reverse()[0]
        );
      }
    }
  });

  const { stats: stats } = useStats({
    querySid: sid,
    scanObjId: scanObjId,
    refreshInterval: 1000,
  });

  useEffect(() => {
    if (statsData && stats !== undefined && Object.keys(stats).length > 0) {
      setStatsData(stats);
    }
  }, [stats]);

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

  useEffect(() => {
    if (
      user &&
      user !== undefined &&
      user !== [] &&
      Object.keys(user).length > 0 &&
      site &&
      site !== undefined &&
      site !== [] &&
      Object.keys(site).length > 0 &&
      statsData
    ) {
      setTimeout(() => {
        setComponentReady(true);
      }, [500]);
    }
  }, [site, user, statsData]);

  return componentReady ? (
    <div tw="flex flex-col w-0 flex-1 overflow-hidden">
      <div tw="relative z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200">
        <div tw="flex-1 p-4 flex justify-between">
          <div tw="flex-1 flex">
            <div tw="w-full flex lg:ml-0">
              <label htmlFor="searchSites" tw="sr-only">
                {LinkOptionsLabel[1].label}
              </label>
              <div tw="relative w-full text-gray-400 focus-within:text-gray-600">
                <div tw="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                  <SearchSvg className={tw`h-5 w-5 text-gray-400`} />
                </div>
                <input
                  type="search"
                  name="search-links"
                  id="searchlinks"
                  tw="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm"
                  placeholder={
                    asPath.includes("pages")
                      ? LinkOptionsLabel[0].label
                      : asPath.includes("links")
                      ? LinkOptionsLabel[1].label
                      : asPath.includes("images")
                      ? LinkOptionsLabel[2].label
                      : LinkOptionsLabel[3].label
                  }
                  onKeyUp={onSearchEvent}
                  defaultValue={searchKey}
                  autoFocus
                />
              </div>
            </div>
          </div>
          <div tw="ml-4 flex items-center lg:ml-6">
            {componentReady ? (
              user &&
              user !== undefined &&
              Object.keys(user).length > 0 &&
              user.permissions.includes("can_start_scan") ? (
                <button
                  type="button"
                  disabled={!crawlable}
                  onClick={onCrawl}
                  css={[
                    tw`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 focus:outline-none`,
                    !crawlFinished
                      ? tw`opacity-50 cursor-not-allowed`
                      : tw`hover:bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-500`,
                  ]}
                >
                  {crawlFinished
                    ? LinkOptionsLabel[4].label
                    : LinkOptionsLabel[5].label}
                </button>
              ) : null
            ) : (
              <Skeleton duration={2} width={150} height={40} />
            )}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <AddSiteSkeleton />
  );
};

export default LinkOptions;
