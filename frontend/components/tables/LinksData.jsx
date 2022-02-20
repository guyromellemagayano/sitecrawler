import { MemoizedBadge } from "@components/badges";
import { useComponentVisible } from "@hooks/useComponentVisible";
import { useLinkDetail } from "@hooks/useLinkDetail";
import { useScan } from "@hooks/useScan";
import { useUser } from "@hooks/useUser";
import { SiteCrawlerAppContext } from "@pages/_app";
import { handleConversionStringToLowercase, handleConversionStringToNumber } from "@utils/convertCase";
import dayjs from "dayjs";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { memo, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import "twin.macro";

/**
 * Custom function to render the `LinksData` component
 *
 * @param {object} link
 * @param {boolean} validatingLinks
 */
const LinksData = ({ link = null, validatingLinks = false }) => {
	// Site data props
	const linkId = link?.id ?? null;
	const linkStatus = link?.status ?? null;
	const linkType = link?.type ?? null;
	const linkUrl = link?.url ?? null;
	const linkHttpStatus = link?.http_status ?? null;
	const linkTlsStatus = link?.tls_status ?? null;
	const linkOccurrences = link?.occurences ?? null;
	const linkScanId = link?.scan_id ?? null;

	// Router
	const { query } = useRouter();
	const { siteId } = query;

	// Custom variables
	const sanitizedSiteId = handleConversionStringToNumber(siteId);

	// Translations
	const { t } = useTranslation();
	const markAsResolvedText = t("sites:markAsResolved");
	const visitExternalSiteText = t("sites:visitExternalSite");
	const goToSiteOverviewText = t("sites:goToSiteOverview");
	const internalText = t("sites:internal");
	const externalText = t("sites:external");
	const otherText = t("sites:other");
	const othersText = t("sites:others");

	// Custom context
	const { isComponentReady } = useContext(SiteCrawlerAppContext);

	// SWR hooks
	const { user, disableLocalTime, permissions } = useUser();
	const { scanObjId, selectedSiteRef } = useScan(sanitizedSiteId);
	const { linkDetail, linkDetailId, linkDetailPages } = useLinkDetail(sanitizedSiteId, scanObjId, linkId);

	// Custom hooks
	const {
		ref: siteVerifyModalRef,
		isComponentVisible: isSiteVerifyModalVisible,
		setIsComponentVisible: setIsSiteVerifyModalVisible
	} = useComponentVisible(false);
	const {
		ref: siteDeleteModalRef,
		isComponentVisible: isSiteDeleteModalVisible,
		setIsComponentVisible: setIsSiteDeleteModalVisible
	} = useComponentVisible(false);

	// DayJS options
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

	return (
		<tr ref={selectedSiteRef}>
			<td tw="flex-none p-4 whitespace-nowrap">
				<div tw="flex flex-col items-start">
					<div>
						<>
							{isComponentReady &&
							user &&
							Math.round(user?.status / 100) === 2 &&
							!user?.data?.detail &&
							linkStatus &&
							!validatingLinks ? (
								<>
									{linkStatus === "OK" && linkTlsStatus === "OK" ? (
										<span
											aria-label="OK"
											tw="relative -left-3 flex-shrink-0 inline-block h-2 w-2 rounded-full leading-5 bg-green-400"
										></span>
									) : linkStatus === "HTTP_ERROR" && linkTlsStatus === "ERROR" ? (
										<span
											aria-label="HTTP_ERROR"
											tw="relative -left-3 flex-shrink-0 inline-block h-2 w-2 rounded-full leading-5 bg-red-400"
										></span>
									) : linkStatus === "TIMEOUT" ? (
										<span
											aria-label="TIMEOUT"
											tw="relative -left-3 flex-shrink-0 inline-block h-2 w-2 rounded-full leading-5 bg-yellow-400"
										></span>
									) : (
										<span
											aria-label="OTHER ERROR"
											tw="relative -left-3 flex-shrink-0 inline-block h-2 w-2 rounded-full leading-5 bg-blue-400"
										></span>
									)}

									<div tw="inline-flex flex-col justify-start items-start">
										<span tw="flex items-center justify-start text-sm leading-6 font-semibold text-gray-500">
											<p className="truncate-link">{linkUrl}</p>
										</span>
										<span tw="flex space-x-2 justify-start text-sm leading-5 text-gray-500">
											<Link
												href="/dashboard/sites/[siteId]/links/[linkId]/"
												as={`/dashboard/sites/${sanitizedSiteId}/links/${linkDetailId}`}
												passHref
											>
												<a
													type="button"
													tw="cursor-pointer flex items-center justify-start text-sm focus:outline-none leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150"
												>
													{goToSiteOverviewText}
												</a>
											</Link>

											<a
												href={linkUrl}
												tw="cursor-pointer flex items-center justify-start text-sm focus:outline-none leading-6 font-semibold text-gray-600 hover:text-gray-500 transition ease-in-out duration-150"
												title={visitExternalSiteText}
												target="_blank"
												rel="noreferrer"
											>
												{visitExternalSiteText}
											</a>

											<button
												type="button"
												tw="cursor-pointer ml-3 flex items-center justify-start text-sm focus:outline-none leading-6 font-semibold text-green-600 hover:text-green-500 transition ease-in-out duration-150"
												onClick={() => {}}
											>
												{markAsResolvedText}
											</button>
										</span>
									</div>
								</>
							) : (
								<span tw="relative -left-3 flex items-start py-2 space-x-3">
									<Skeleton
										duration={2}
										width={9}
										height={9}
										circle={true}
										className="relative -left-3 top-4 block flex-shrink-0"
									/>
									<div tw="inline-flex flex-col justify-start items-start">
										<Skeleton
											duration={2}
											width={150}
											className="relative -left-3 inline-flex flex-col items-start justify-start"
										/>
										<span tw="flex flex-row justify-start text-sm leading-5 text-gray-500 space-x-3">
											<Skeleton duration={2} width={63} />
											<Skeleton duration={2} width={63} />
											<Skeleton duration={2} width={63} />
											<Skeleton duration={2} width={63} />
										</span>
									</div>
								</span>
							)}
						</>
					</div>
				</div>
			</td>
			<td tw="px-6 py-4 whitespace-nowrap text-sm text-gray-500 leading-5 font-semibold">
				{isComponentReady &&
				user &&
				Math.round(user?.status / 100) === 2 &&
				!user?.data?.detail &&
				linkType &&
				!validatingLinks ? (
					linkType === "PAGE" ? (
						internalText
					) : linkType === "EXTERNAL" ? (
						externalText
					) : (
						otherText
					)
				) : (
					<Skeleton duration={2} width={100} />
				)}
			</td>
			<td tw="px-6 py-4 whitespace-nowrap text-sm text-gray-500 leading-5 font-semibold">
				{isComponentReady &&
				user &&
				Math.round(user?.status / 100) === 2 &&
				!user?.data?.detail &&
				linkStatus &&
				!validatingLinks ? (
					linkStatus === "OK" ? (
						<MemoizedBadge text={"OK"} isSuccess />
					) : linkStatus === "TIMEOUT" ? (
						<MemoizedBadge text={"TIMEOUT"} isWarning />
					) : linkStatus === "HTTP_ERROR" ? (
						<MemoizedBadge text={`${linkHttpStatus} HTTP ERROR`} isDanger />
					) : (
						<MemoizedBadge text={"OTHER ERROR"} />
					)
				) : (
					<Skeleton duration={2} width={150} />
				)}
			</td>
			<td tw="px-6 py-4 whitespace-nowrap text-sm text-gray-500 leading-5 font-semibold">
				{isComponentReady &&
				user &&
				Math.round(user?.status / 100) === 2 &&
				!user?.data?.detail &&
				linkHttpStatus &&
				!validatingLinks ? (
					Math.round(linkHttpStatus / 100) === 2 ? (
						<span tw="text-green-500">{linkHttpStatus}</span>
					) : Math.round(linkHttpStatus / 100) === 4 || Math.round(linkHttpStatus / 100) === 5 ? (
						<span tw="text-red-500">{linkHttpStatus}</span>
					) : Math.round(linkHttpStatus / 100) === 3 ? (
						<span tw="text-yellow-500">{linkHttpStatus}</span>
					) : (
						<span tw="text-gray-500">{linkHttpStatus}</span>
					)
				) : (
					<Skeleton duration={2} width={45} />
				)}
			</td>
			<td tw="px-6 py-4 whitespace-nowrap text-sm text-gray-500 leading-5 font-semibold">
				{isComponentReady &&
				user &&
				Math.round(user?.status / 100) === 2 &&
				!user?.data?.detail &&
				linkDetailPages?.length > 0 &&
				!validatingLinks ? (
					<Link
						href="/dashboard/sites/[siteId]/links/[linkId]/"
						as={`/dashboard/sites/${siteId}/links/${linkDetailId}/`}
						passHref
					>
						<a tw="mr-3 flex items-center outline-none focus:outline-none text-sm leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150">
							<span className="truncate-link">
								{linkDetailPages[0]?.url === linkUrl ? "/" : linkDetailPages[0]?.url}
							</span>
							&nbsp;
							{linkDetailPages.length - 1 > 0
								? "+" + handleConversionStringToNumber(linkDetailPages.length - 1)
								: null}{" "}
							{linkDetailPages.length - 1 > 1
								? handleConversionStringToLowercase(othersText)
								: linkDetailPages.length - 1 === 1
								? handleConversionStringToLowercase("other")
								: null}
						</a>
					</Link>
				) : (
					<Skeleton duration={2} width={120} />
				)}
			</td>
			<td tw="px-6 py-4 whitespace-nowrap text-sm text-gray-500 leading-5 font-semibold">
				{isComponentReady &&
				user &&
				Math.round(user?.status / 100) === 2 &&
				!user?.data?.detail &&
				linkOccurrences &&
				!validatingLinks ? (
					<span tw="text-gray-500">{linkOccurrences}</span>
				) : (
					<Skeleton duration={2} width={45} />
				)}
			</td>
		</tr>
	);
};

LinksData.propTypes = {
	link: PropTypes.shape({
		http_status: PropTypes.number,
		id: PropTypes.number,
		occurences: PropTypes.number,
		scan_id: PropTypes.number,
		status: PropTypes.string,
		tls_status: PropTypes.string,
		type: PropTypes.string,
		url: PropTypes.string
	}),
	validatingLinks: PropTypes.bool
};

/**
 * Memoized custom `LinksData` component
 */
export const MemoizedLinksData = memo(LinksData);
