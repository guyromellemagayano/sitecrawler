// React
import { useState } from "react";

// NextJS
import { useRouter } from "next/router";

// External
import { DocumentTextIcon, PhotographIcon } from "@heroicons/react/outline";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SearchIcon, DownloadIcon, GlobeIcon, LinkIcon } from "@heroicons/react/solid";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";
import tw from "twin.macro";

// Enums
import { HeadingOptionsLabels } from "@enums/HeadingOptionsLabels";

// Components
import SiteVerifyErrorModal from "@components/modals/SiteVerifyModal";
import UpgradeErrorModal from "@components/modals/UpgradeErrorModal";

const HeadingOptions = ({
	componentReady,
	count,
	dataLabel,
	disableLocalTime,
	handleCrawl,
	isCrawlFinished,
	isCrawlStarted,
	isImages,
	isLinks,
	isPages,
	isSeo,
	pageTitle,
	permissions,
	queryString,
	scanFinishedAt,
	scanObjId,
	siteId,
	siteName,
	siteUrl,
	verified
}) => {
	const [showSiteVerifyErrorModal, setShowSiteVerifyErrorModal] = useState(false);
	const [showUpgradeErrorModal, setShowUpgradeErrorModal] = useState(false);

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

	return (
		<div tw="pt-4 m-auto md:flex md:items-center md:justify-between">
			<UpgradeErrorModal
				showModal={showUpgradeErrorModal}
				handleShowModal={() => setShowUpgradeErrorModal(!showUpgradeErrorModal)}
			/>

			<SiteVerifyErrorModal
				showModal={showSiteVerifyErrorModal}
				handleShowModal={() => setShowSiteVerifyErrorModal(!showSiteVerifyErrorModal)}
			/>

			<div tw="flex-1 min-w-0">
				<h2 tw="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">{pageTitle}</h2>
				<div tw="mt-4 flex flex-col sm:flex-row sm:flex-wrap sm:mt-2 sm:space-x-6">
					<div tw="mt-2 flex items-center text-sm text-gray-500">
						<GlobeIcon tw="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
						{componentReady ? (
							<a
								href={siteUrl}
								target="_blank"
								title={siteName}
								className="truncate-link"
								tw="max-w-lg text-sm leading-6 font-semibold text-gray-500 hover:text-gray-900 truncate"
							>
								{siteName}
							</a>
						) : (
							HeadingOptionsLabels[4].label
						)}
					</div>

					{asPath.includes("overview") && (
						<div tw="mt-2 flex items-center text-sm text-gray-500">
							<FontAwesomeIcon
								icon={["fas", "spider"]}
								tw="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400"
								aria-hidden="true"
							/>

							{scanFinishedAt && componentReady ? (
								<p tw="text-sm leading-6 text-gray-500">
									{!disableLocalTime
										? dayjs(scanFinishedAt).calendar(null, calendarStrings)
										: dayjs.utc(scanFinishedAt).calendar(null, calendarStrings)}
									<span tw="ml-2 font-medium">
										({!disableLocalTime ? dayjs.tz.guess() : "UTC"})
									</span>
								</p>
							) : (
								HeadingOptionsLabels[4].label
							)}
						</div>
					)}

					<div tw="mt-2 flex items-center text-sm text-gray-500">
						{isLinks || isSeo || isPages || isImages ? (
							<>
								{isLinks ? (
									<LinkIcon tw="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
								) : isSeo ? (
									<SearchIcon tw="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
								) : isPages ? (
									<DocumentTextIcon tw="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
								) : isImages ? (
									<PhotographIcon tw="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
								) : null}

								{(permissions?.includes("can_see_images") &&
									permissions?.includes("can_see_pages") &&
									permissions?.includes("can_see_scripts") &&
									permissions?.includes("can_see_stylesheets")) ||
								asPath.includes("links")
									? count > 1 && componentReady
										? count + " " + dataLabel[0]
										: count == 1 && componentReady
										? count + " " + dataLabel[1]
										: count == 0 && componentReady
										? dataLabel[2]
										: HeadingOptionsLabels[4].label
									: HeadingOptionsLabels[1].label}
							</>
						) : null}
					</div>
				</div>
			</div>

			<div tw="mt-4 flex md:mt-0 md:ml-4">
				{componentReady ? (
					<button
						type="button"
						disabled={isCrawlStarted && !isCrawlFinished}
						onClick={
							permissions?.includes("can_start_scan")
								? verified
									? handleCrawl
									: () => setShowSiteVerifyErrorModal(!showSiteVerifyErrorModal)
								: () => setShowUpgradeErrorModal(!showUpgradeErrorModal)
						}
						css={[
							tw`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none`,
							permissions?.includes("can_start_scan")
								? verified
									? isCrawlStarted && !isCrawlFinished
										? tw`bg-green-600 opacity-50 cursor-not-allowed`
										: tw`bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-500`
									: tw`bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-offset-2 focus:ring-red-500`
								: tw`bg-yellow-600 hover:bg-yellow-700 focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500`
						]}
					>
						<span tw="flex items-center space-x-2">
							{permissions?.includes("can_start_scan") ? (
								<>
									<FontAwesomeIcon icon={["fas", "spider"]} tw="w-4 h-4 text-white" />

									{verified ? (
										!isCrawlStarted && isCrawlFinished ? (
											<span>{HeadingOptionsLabels[2].label}</span>
										) : (
											<span>{HeadingOptionsLabels[3].label}</span>
										)
									) : (
										<span>{HeadingOptionsLabels[2].label}</span>
									)}
								</>
							) : verified ? (
								<>
									<FontAwesomeIcon icon={["fas", "crown"]} tw="w-4 h-4 text-white" />

									<span>{HeadingOptionsLabels[2].label}</span>
								</>
							) : (
								<>
									<FontAwesomeIcon icon={["fas", "crown"]} tw="w-4 h-4 text-white" />

									<span>{HeadingOptionsLabels[2].label}</span>
								</>
							)}
						</span>
					</button>
				) : (
					<Skeleton duration={2} width={150} height={40} />
				)}

				{asPath.includes("links") ? (
					componentReady ? (
						<a
							href={`/api/site/${siteId}/scan/${scanObjId}/${
								isLinks ? "link" : isPages || isSeo ? "page" : isImages ? "image" : null
							}/?format=csv${queryString}`}
							tw="inline-flex items-center ml-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
						>
							<span tw="flex items-center space-x-2">
								<DownloadIcon tw="w-4 h-4 text-white" />

								<span>{HeadingOptionsLabels[0].label}</span>
							</span>
						</a>
					) : (
						<Skeleton duration={2} width={150} height={40} tw="ml-2" />
					)
				) : asPath.includes("pages") || asPath.includes("images") ? (
					permissions?.includes("can_see_images") &&
					permissions?.includes("can_see_pages") &&
					permissions?.includes("can_see_scripts") &&
					permissions?.includes("can_see_stylesheets") ? (
						componentReady ? (
							<a
								href={`/api/site/${siteId}/scan/${scanObjId}/${
									isLinks ? "link" : isPages || isSeo ? "page" : isImages ? "image" : null
								}/?format=csv${queryString}`}
								tw="inline-flex items-center ml-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
							>
								<span tw="flex items-center space-x-2">
									<DownloadIcon tw="w-4 h-4 text-white" />

									<span>{HeadingOptionsLabels[0].label}</span>
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
								<span>{HeadingOptionsLabels[0].label}</span>
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

HeadingOptions.propTypes = {
	componentReady: PropTypes.bool,
	count: PropTypes.number,
	dataLabel: PropTypes.array,
	disableLocalTime: PropTypes.bool,
	handleCrawl: PropTypes.func,
	isCrawlFinished: PropTypes.bool,
	isCrawlStarted: PropTypes.bool,
	isImages: PropTypes.bool,
	isLinks: PropTypes.bool,
	isPages: PropTypes.bool,
	isSeo: PropTypes.bool,
	pageTitle: PropTypes.string,
	permissions: PropTypes.array,
	queryString: PropTypes.string,
	scanFinishedAt: PropTypes.string,
	scanObjId: PropTypes.number,
	siteId: PropTypes.number,
	siteName: PropTypes.string,
	siteUrl: PropTypes.string,
	verified: PropTypes.bool
};

HeadingOptions.defaultProps = {
	componentReady: false,
	count: null,
	dataLabel: null,
	disableLocalTime: false,
	handleCrawl: null,
	isCrawlFinished: false,
	isCrawlStarted: false,
	isImages: false,
	isLinks: false,
	isPages: false,
	isSeo: false,
	pageTitle: null,
	permissions: null,
	queryString: null,
	scanFinishedAt: null,
	scanObjId: null,
	siteId: null,
	siteName: null,
	siteUrl: null,
	verified: false
};

export default HeadingOptions;
