// React
import * as React from "react";

// NextJS
import { useRouter } from "next/router";

// External
import tw from "twin.macro";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { DocumentTextIcon, PhotographIcon } from "@heroicons/react/outline";
import { SearchIcon, DownloadIcon, GlobeIcon, LinkIcon } from "@heroicons/react/solid";
import dayjs from "dayjs";
import loadable from "@loadable/component";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";

// JSON
import HeadingOptionsLabel from "./labels/HeadingOptions.json";

// Loadable
const SiteVerifyErrorModal = loadable(() => import("src/components/modals/SiteVerifyModal"), {
	resolveComponent: (components) => components.SiteVerifyErrorModal
});
const UpgradeErrorModal = loadable(() => import("src/components/modals/UpgradeErrorModal"));

const HeadingOptions = (props) => {
	const [componentReady, setComponentReady] = React.useState(false);
	const [showSiteVerifyErrorModal, setShowSiteVerifyErrorModal] = React.useState(false);
	const [showUpgradeErrorModal, setShowUpgradeErrorModal] = React.useState(false);

	const calendar = require("dayjs/plugin/calendar");
	const timezone = require("dayjs/plugin/timezone");
	const utc = require("dayjs/plugin/utc");

	dayjs.extend(calendar);
	dayjs.extend(utc);
	dayjs.extend(timezone);

	const calendarStrings = {
		lastDay: "[Yesterday], dddd [at] hh:mm:ss A",
		lastWeek: "MMMM DD, YYYY [at] hh:mm:ss A",
		sameDay: "[Today], dddd [at] hh:mm:ss A",
		sameElse: "MMMM DD, YYYY [at] hh:mm:ss A"
	};

	const { asPath } = useRouter();

	React.useEffect(() => {
		(() => {
			setComponentReady(false);

			setTimeout(() => {
				setComponentReady(true);
			}, 500);
		})();
	}, []);

	return (
		<div tw="pt-4 m-auto md:flex md:items-center md:justify-between">
			<UpgradeErrorModal show={showUpgradeErrorModal} setShowModal={setShowUpgradeErrorModal} />
			<SiteVerifyErrorModal show={showSiteVerifyErrorModal} setShowModal={setShowSiteVerifyErrorModal} />

			<div tw="flex-1 min-w-0">
				<h2 tw="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">{props.pageTitle}</h2>
				<div tw="mt-4 flex flex-col sm:flex-row sm:flex-wrap sm:mt-2 sm:space-x-6">
					<div tw="mt-2 flex items-center text-sm text-gray-500">
						<GlobeIcon tw="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
						{props.siteName && componentReady ? (
							<a
								href={props.siteUrl}
								target="_blank"
								title={props.siteName}
								className="truncate-link"
								tw="max-w-lg text-sm leading-6 font-semibold text-gray-500 hover:text-gray-900 truncate"
							>
								{props.siteName}
							</a>
						) : (
							HeadingOptionsLabel[4].label
						)}
					</div>

					{asPath.includes("overview") && (
						<div tw="mt-2 flex items-center text-sm text-gray-500">
							<FontAwesomeIcon
								icon={["fas", "spider"]}
								tw="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
								aria-hidden="true"
							/>

							{props.scanFinishedAt && componentReady ? (
								<p tw="text-sm leading-6 text-gray-500">
									{!props.disableLocalTime
										? dayjs(props.scanFinishedAt).calendar(null, calendarStrings)
										: dayjs.utc(props.scanFinishedAt).calendar(null, calendarStrings)}
									<span tw="ml-2 font-medium">({!props.disableLocalTime ? dayjs.tz.guess() : "UTC"})</span>
								</p>
							) : (
								HeadingOptionsLabel[4].label
							)}
						</div>
					)}

					<div tw="mt-2 flex items-center text-sm text-gray-500">
						{(props.isLinks || props.isSeo || props.isPages || props.isImages) && props.count ? (
							<>
								{props.isLinks ? (
									<LinkIcon tw="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
								) : props.isSeo ? (
									<SearchIcon tw="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
								) : props.isPages ? (
									<DocumentTextIcon tw="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
								) : props.isImages ? (
									<PhotographIcon tw="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
								) : null}

								{(props.permissions?.includes("can_see_images") &&
									props.permissions?.includes("can_see_pages") &&
									props.permissions?.includes("can_see_scripts") &&
									props.permissions?.includes("can_see_stylesheets")) ||
								asPath.includes("links")
									? props.count > 1 && componentReady
										? props.count + " " + props.dataLabel[0]
										: props.count == 1 && componentReady
										? props.count + " " + props.dataLabel[1]
										: props.count == 0 && componentReady
										? props.dataLabel[2]
										: HeadingOptionsLabel[4].label
									: HeadingOptionsLabel[1].label}
							</>
						) : null}
					</div>
				</div>
			</div>

			<div tw="mt-4 flex md:mt-0 md:ml-4">
				{componentReady ? (
					<button
						type="button"
						disabled={props.isCrawlStarted && !props.isCrawlFinished}
						onClick={
							props.permissions?.includes("can_start_scan")
								? props.verified
									? props.handleCrawl
									: () => setShowSiteVerifyErrorModal(!showSiteVerifyErrorModal)
								: () => setShowUpgradeErrorModal(!showUpgradeErrorModal)
						}
						css={[
							tw`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none`,
							props.permissions?.includes("can_start_scan")
								? props.verified
									? props.isCrawlStarted && !props.isCrawlFinished
										? tw`bg-green-600 opacity-50 cursor-not-allowed`
										: tw`bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-500`
									: tw`bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-offset-2 focus:ring-red-500`
								: tw`bg-yellow-600 hover:bg-yellow-700 focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500`
						]}
					>
						<span tw="flex items-center space-x-2">
							{props.permissions?.includes("can_start_scan") ? (
								<>
									<FontAwesomeIcon icon={["fas", "spider"]} tw="w-4 h-4 text-white" />

									{props.verified ? (
										!props.isCrawlStarted && props.isCrawlFinished ? (
											<span>{HeadingOptionsLabel[2].label}</span>
										) : (
											<span>{HeadingOptionsLabel[3].label}</span>
										)
									) : (
										<span>{HeadingOptionsLabel[2].label}</span>
									)}
								</>
							) : props.verified ? (
								<>
									<FontAwesomeIcon icon={["fas", "crown"]} tw="w-4 h-4 text-white" />

									<span>{HeadingOptionsLabel[2].label}</span>
								</>
							) : (
								<>
									<FontAwesomeIcon icon={["fas", "crown"]} tw="w-4 h-4 text-white" />

									<span>{HeadingOptionsLabel[2].label}</span>
								</>
							)}
						</span>
					</button>
				) : (
					<Skeleton duration={2} width={150} height={40} />
				)}

				{asPath.includes("links") ? (
					componentReady ? (
						<>
							{console.log("hello")}
							<a
								href={`/api/site/${props.siteId}/scan/${props.scanObjId}/${
									props.isLinks ? "link" : props.isPages || props.isSeo ? "page" : props.isImages ? "image" : null
								}/?format=csv${props.queryString}`}
								tw="inline-flex items-center ml-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
							>
								<span tw="flex items-center space-x-2">
									<DownloadIcon tw="w-4 h-4 text-white" />

									<span>{HeadingOptionsLabel[0].label}</span>
								</span>
							</a>
						</>
					) : (
						<Skeleton duration={2} width={150} height={40} tw="ml-2" />
					)
				) : asPath.includes("pages") || asPath.includes("images") ? (
					props.permissions?.includes("can_see_images") &&
					props.permissions?.includes("can_see_pages") &&
					props.permissions?.includes("can_see_scripts") &&
					props.permissions?.includes("can_see_stylesheets") ? (
						componentReady ? (
							<a
								href={`/api/site/${props.siteId}/scan/${props.scanObjId}/${
									props.isLinks ? "link" : props.isPages || props.isSeo ? "page" : props.isImages ? "image" : null
								}/?format=csv${props.queryString}`}
								tw="inline-flex items-center ml-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
							>
								<span tw="flex items-center space-x-2">
									<DownloadIcon tw="w-4 h-4 text-white" />

									<span>{HeadingOptionsLabel[0].label}</span>
								</span>
							</a>
						) : (
							<Skeleton duration={2} width={150} height={40} tw="ml-2" />
						)
					) : componentReady ? (
						<button
							type="button"
							onClick={() => setShowUpgradeErrorModal(!showUpgradeErrorModal)}
							tw="inline-flex items-center ml-2 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none bg-yellow-600 hover:bg-yellow-700 focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
						>
							<span tw="flex items-center space-x-2">
								<FontAwesomeIcon icon={["fas", "crown"]} tw="w-4 h-4 text-white" />
								<span>{HeadingOptionsLabel[0].label}</span>
							</span>
						</button>
					) : (
						<Skeleton duration={2} width={150} height={40} tw="ml-2" />
					)
				) : null}
			</div>
		</div>
	);
};

HeadingOptions.propTypes = {};

export default HeadingOptions;
