// React
import { useState, useEffect } from "react";

// NextJS
import { useRouter } from "next/router";
import Link from "next/link";

// External
import loadable from "@loadable/component";
import PropTypes from "prop-types";
import ReactTooltip from "react-tooltip";
import Skeleton from "react-loading-skeleton";
import tw, { styled } from "twin.macro";
import Url from "url-parse";

// Hooks
import { useLinkDetail } from "src/hooks/useSite";
import InformationCircleSvg from "../svg/outline/InformationCircleSvg";

// Components
const SiteDangerBadge = loadable(() =>
  import("src/components/badges/SiteDangerBadge")
);
const SiteSuccessBadge = loadable(() =>
  import("src/components/badges/SiteSuccessBadge")
);
const SiteWarningBadge = loadable(() =>
  import("src/components/badges/SiteWarningBadge")
);

const LinkTableDiv = styled.tbody`
  .HTTP_ERROR-tooltip {
    max-width: 20rem;
    margin-left: 5px !important;
    padding: 1rem 1.5rem;
  }
  td {
    & > div {
      max-width: 100%;
      display: block;

      & > div {
        max-width: 100%;
        display: block;
      }
    }
  }
  .link-item {
    max-width: 100%;
    display: block;

    a {
      max-width: 100%;
      display: block;
    }
  }

  .truncate-link {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 7rem;
  }

  .btn-detail {
    display: inline-block;
    padding: 8px 10px;
    line-height: 1;
    font-size: 0.7rem;
    margin-top: 5px;
  }
`;

const LinkTable = (props) => {
  const [componentReady, setComponentReady] = useState(false);

  const { query } = useRouter();

  const { linkDetail: linkDetail } = useLinkDetail({
    querySid: query.siteId,
    scanObjId: props.val.scan_id,
    linkId: props.val.id,
  });

  useEffect(() => {
    if (
      linkDetail &&
      linkDetail !== undefined &&
      linkDetail !== [] &&
      Object.keys(linkDetail).length > 0
    ) {
      setTimeout(() => {
        setComponentReady(true);
      }, 500);
    }
  }, [linkDetail]);

  return (
    <LinkTableDiv className={`bg-white`}>
      <tr>
        <td
          className={`flex-none px-6 py-4 whitespace-no-wrap border-b border-gray-300`}
        >
          <div className={`flex items-center`}>
            <div>
              <div
                className={`link-item text-sm leading-5 font-medium text-gray-900`}
              >
                {componentReady ? (
                  <a
                    href={props.val.url}
                    target={`_blank`}
                    title={props.val.url}
                    className={`text-sm leading-6 font-semibold text-blue-1000 hover:text-blue-900 transition ease-in-out duration-150 truncate`}
                  >
                    {props.val.url}
                  </a>
                ) : (
                  <Skeleton duration={2} />
                )}
              </div>
              <div
                className={`flex justify-start inline-text-sm leading-5 text-gray-500`}
              >
                {componentReady ? (
                  linkDetail &&
                  linkDetail !== undefined &&
                  linkDetail !== [] &&
                  Object.keys(linkDetail).length > 0 && (
                    <Link
                      href="/site/[siteId]/links/[linkId]/details"
                      as={`/site/${query.siteId}/links/${linkDetail.id}/details`}
                    >
                      <a
                        className={`btn-detail mr-3 outline-none focus:outline-none text-sm leading-6 font-semibold text-white bg-indigo-600 rounded hover:bg-indigo-500 hover:border-0 transition ease-in-out duration-150`}
                      >
                        View Details
                      </a>
                    </Link>
                  )
                ) : (
                  <Skeleton
                    duration={2}
                    className="btn-detail"
                    width={82.2}
                    height={27}
                  />
                )}
              </div>
            </div>
          </div>
        </td>
        <td
          className={`px-6 whitespace-no-wrap border-b border-gray-300 text-sm leading-5 text-gray-500`}
        >
          {componentReady ? (
            props.val.type === "PAGE" ? (
              "Internal"
            ) : props.val.type === "EXTERNAL" ? (
              "External"
            ) : (
              "Other"
            )
          ) : (
            <Skeleton duration={2} width={100} />
          )}
        </td>
        <td
          className={`px-6 whitespace-no-wrap border-b border-gray-300 text-sm leading-5 text-gray-500`}
        >
          {componentReady ? (
            props.val.status === "OK" ? (
              <SiteSuccessBadge text={"OK"} />
            ) : props.val.status === "TIMEOUT" ? (
              <SiteWarningBadge text={"TIMEOUT"} />
            ) : props.val.status === "HTTP_ERROR" ? (
              <>
                <span className={`flex items-center justify-start`}>
                  <SiteDangerBadge
                    text={`${props.val.http_status} HTTP ERROR`}
                  />
                  <a
                    data-tip={``}
                    data-for={props.val.url}
                    data-background-color={"#E53E3E"}
                    data-iscapture={true}
                    data-scroll-hide={false}
                    className={`flex cursor-pointer`}
                  >
                    <InformationCircleSvg
                      className={tw`ml-2 text-red-400 inline-block w-4 h-4 overflow-hidden`}
                    />
                  </a>
                  <ReactTooltip
                    id={props.val.url}
                    className={`${props.val.status + "-tooltip"} w-36`}
                    type={`dark`}
                    effect={`solid`}
                    place={`bottom`}
                    clickable={true}
                    multiline={true}
                  >
                    <span
                      className={`text-left text-xs leading-4 font-normal text-white normal-case tracking-wider`}
                    >
                      <p>
                        <strong>{props.val.error}</strong>
                      </p>
                    </span>
                  </ReactTooltip>
                </span>
              </>
            ) : (
              <SiteDangerBadge text={"OTHER ERROR"} />
            )
          ) : (
            <Skeleton duration={2} width={150} />
          )}
        </td>
        <td
          className={`px-6 whitespace-no-wrap border-b border-gray-300 text-sm leading-5 text-gray-500`}
        >
          {componentReady ? (
            linkDetail &&
            linkDetail !== undefined &&
            linkDetail !== [] &&
            Object.keys(linkDetail).length > 0 &&
            linkDetail.pages.length > 0 && (
              <Link
                href="/site/[siteId]/links/[linkId]/details"
                as={`/site/${query.siteId}/links/${linkDetail.id}/details`}
              >
                <a
                  className={`mr-3 flex items-center outline-none focus:outline-none text-sm leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150`}
                >
                  <span className={`truncate-link`}>
                    {linkDetail.pages[0] &&
                    Url(linkDetail.pages[0].url).pathname !== "" ? (
                      Url(linkDetail.pages[0].url).pathname
                    ) : (
                      <em>_domain</em>
                    )}
                  </span>
                  &nbsp;
                  {linkDetail.pages.length - 1 > 0
                    ? "+" + parseInt(linkDetail.pages.length - 1)
                    : null}{" "}
                  {linkDetail.pages.length - 1 > 1
                    ? "others"
                    : linkDetail.pages.length - 1 === 1
                    ? "other"
                    : null}
                </a>
              </Link>
            )
          ) : (
            <Skeleton duration={2} width={120} />
          )}
        </td>
        <td
          className={`px-6 whitespace-no-wrap border-b border-gray-300 text-sm leading-5 text-gray-500`}
        >
          {componentReady ? (
            props.val.occurences
          ) : (
            <Skeleton duration={2} width={45} />
          )}
        </td>
      </tr>
    </LinkTableDiv>
  );
};

LinkTable.propTypes = {};

export default LinkTable;
