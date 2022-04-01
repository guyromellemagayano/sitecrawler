/* eslint-disable react-hooks/exhaustive-deps */
import { MemoizedBadge } from "@components/badges";
import { MemoizedSiteSuccessIcon } from "@components/icons/SiteSuccessIcon";
import { DashboardSitesLink, SiteLinksSlug } from "@constants/PageLinks";
import { useComponentVisible } from "@hooks/useComponentVisible";
import { SiteCrawlerAppContext } from "@pages/_app";
import dayjs from "dayjs";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { memo, useContext, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/**
 * Custom function to render the `LinksData` component
 *
 * @param {object} link
 */
const LinksData = ({ link = null }) => {
	// Site data props
	const linkId = link?.id ?? null;
	const linkStatus = link?.status ?? null;
	const linkType = link?.type ?? null;
	const linkUrl = link?.url ?? null;
	const linkHttpStatus = link?.http_status ?? null;
	const linkTlsStatus = link?.tls_status ?? null;
	const linkOccurrences = link?.occurences ?? null;
	const linkResolvedStatus = link?.resolved_status ?? null;
	const linkResolvedTls = link?.resolved_tls ?? null;
	const linkResponseTime = link?.response_time ?? null;

	// Router
	const { prefetch } = useRouter();

	// Translations
	const { t } = useTranslation();
	const markAsResolvedText = t("sites:markAsResolved");
	const visitExternalSiteText = t("sites:visitExternalSite");
	const goToSiteOverviewText = t("sites:goToSiteOverview");
	const othersText = t("sites:others");
	const nonWebText = t("sites:nonWeb");

	// Custom context
	const { isComponentReady, querySiteId, user, links } = useContext(SiteCrawlerAppContext);

	// Custom variables
	const disableLocalTime = user?.data?.settings?.disableLocalTime ?? false;
	const permissions = user?.data?.permissions ?? null;

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

	useEffect(() => {
		// Prefetch links page for faster loading
		prefetch(DashboardSitesLink + querySiteId + SiteLinksSlug + linkId);
	}, []);

	return (
		<tr>
			<td className="truncate-link flex-none whitespace-nowrap p-4">
				<div className="flex flex-col items-start">
					<div>
						{isComponentReady ? (
							<div>
								<p className="block truncate text-sm font-semibold leading-6 text-gray-500">{linkUrl}</p>
								<span className="flex justify-start space-x-2 text-sm leading-5 text-gray-500">
									<Link
										href="/dashboard/sites/[siteId]/links/[linkId]/"
										as={`/dashboard/sites/${querySiteId}/links/${linkId}/`}
										title={linkUrl}
										passHref
									>
										<a
											type="button"
											className="flex cursor-pointer items-center justify-start text-sm font-semibold leading-6 text-indigo-600 transition duration-150 ease-in-out hover:text-indigo-500 focus:outline-none"
										>
											{goToSiteOverviewText}
										</a>
									</Link>

									<a
										href={linkUrl}
										className="flex cursor-pointer items-center justify-start text-sm font-semibold leading-6 text-gray-600 transition duration-150 ease-in-out hover:text-gray-500 focus:outline-none"
										title={visitExternalSiteText}
										target="_blank"
										rel="noreferrer"
									>
										{visitExternalSiteText}
									</a>

									{linkStatus !== "OK" ? (
										<button
											type="button"
											className="ml-3 flex cursor-pointer items-center justify-start text-sm font-semibold leading-6 text-green-600 transition duration-150 ease-in-out hover:text-green-500 focus:outline-none"
											onClick={(e) => {}}
										>
											{markAsResolvedText}
										</button>
									) : null}
								</span>
							</div>
						) : (
							<span className="flex items-start space-x-3 py-2">
								<Skeleton
									duration={2}
									width={9}
									height={9}
									circle={true}
									className="relative top-1 block flex-shrink-0"
								/>
								<div className="inline-flex flex-col items-start justify-start">
									<Skeleton
										duration={2}
										width={150}
										className="relative inline-flex flex-col items-start justify-start"
									/>
									<span className="flex flex-row justify-start space-x-3 text-sm leading-5 text-gray-500">
										<Skeleton duration={2} width={63} />
										<Skeleton duration={2} width={63} />
										<Skeleton duration={2} width={63} />
										<Skeleton duration={2} width={63} />
										<Skeleton duration={2} width={63} />
									</span>
								</div>
							</span>
						)}
					</div>
				</div>
			</td>
			<td className="truncate-link whitespace-nowrap px-6 py-4 text-sm font-semibold leading-5 text-gray-500">
				{isComponentReady ? linkType : <Skeleton duration={2} width={100} />}
			</td>
			<td className="truncate-link whitespace-nowrap px-6 py-4 text-sm font-semibold leading-5 text-gray-500">
				{isComponentReady ? (
					linkStatus === "OK" ? (
						<MemoizedBadge text="OK" isSuccess />
					) : linkStatus === "TIMEOUT" ? (
						<MemoizedBadge text="TIMEOUT" isWarning />
					) : linkStatus === "HTTP_ERROR" ? (
						<MemoizedBadge text="HTTP ERROR" isDanger />
					) : (
						<MemoizedBadge text="OTHER ERROR" isDanger />
					)
				) : (
					<Skeleton duration={2} width={150} />
				)}
			</td>
			<td className="truncate-link whitespace-nowrap px-6 py-4 text-sm font-semibold leading-5 text-gray-500">
				{isComponentReady ? (
					Math.round(linkHttpStatus / 100) === 2 ? (
						<span className="text-green-500">{linkHttpStatus}</span>
					) : Math.round(linkHttpStatus / 100) === 4 || Math.round(linkHttpStatus / 100) === 5 ? (
						<span className="text-red-500">{linkHttpStatus}</span>
					) : Math.round(linkHttpStatus / 100) === 3 ? (
						<span className="text-yellow-500">{linkHttpStatus}</span>
					) : (
						<span className="text-gray-500">{linkHttpStatus}</span>
					)
				) : (
					<Skeleton duration={2} width={45} />
				)}
			</td>
			<td className="truncate-link whitespace-nowrap px-6 py-4 text-sm font-semibold leading-5 text-gray-500">
				{isComponentReady ? (
					linkResponseTime ? (
						<span className="text-gray-500">{linkResponseTime + "ms"}</span>
					) : null
				) : (
					<Skeleton duration={2} width={45} />
				)}
			</td>
			{/* <td className="truncate-link whitespace-nowrap px-6 py-4 text-sm font-semibold leading-5 text-gray-500">
				{isComponentReady ? (
					pages?.length > 0 ? (
						<Link
							href="/dashboard/sites/[siteId]/links/[linkId]/"
							as={`/dashboard/sites/${querySiteId}/links/${linkId}/`}
							passHref
						>
							<a className="mr-3 flex items-center text-sm font-semibold leading-6 text-indigo-600 outline-none transition duration-150 ease-in-out hover:text-indigo-500 focus:outline-none">
								<span className="truncate-link">{pages[0]?.url === linkUrl ? "/" : pages[0]?.url}</span>
								&nbsp;
								{pages.length - 1 > 0 ? "+" + handleConversionStringToNumber(pages.length - 1) : null}{" "}
								{pages.length - 1 > 1
									? handleConversionStringToLowercase(othersText)
									: pages.length - 1 === 1
									? handleConversionStringToLowercase(otherText)
									: null}
							</a>
						</Link>
					) : null
				) : (
					<Skeleton duration={2} width={120} />
				)}
			</td> */}
			<td className="truncate-link whitespace-nowrap px-6 py-4 text-sm font-semibold leading-5 text-gray-500">
				{isComponentReady ? (
					linkOccurrences ? (
						<span className="text-gray-500">{linkOccurrences}</span>
					) : null
				) : (
					<Skeleton duration={2} width={45} />
				)}
			</td>
			<td className="truncate-link whitespace-nowrap px-6 py-4 text-sm font-semibold leading-5 text-gray-500">
				{isComponentReady && linkResolvedStatus ? (
					<MemoizedSiteSuccessIcon />
				) : isComponentReady && !linkResolvedStatus ? null : (
					<Skeleton duration={2} width={75} />
				)}
			</td>
			<td className="truncate-link whitespace-nowrap px-6 py-4 text-sm font-semibold leading-5 text-gray-500">
				{isComponentReady && linkResolvedTls ? (
					<MemoizedSiteSuccessIcon />
				) : isComponentReady && !linkResolvedTls ? null : (
					<Skeleton duration={2} width={75} />
				)}
			</td>
		</tr>
	);
};

LinksData.propTypes = {
	link: PropTypes.shape({
		http_status: PropTypes.any,
		id: PropTypes.number,
		occurences: PropTypes.number,
		resolved_status: PropTypes.any,
		resolved_tls: PropTypes.any,
		status: PropTypes.string,
		tls_status: PropTypes.any,
		type: PropTypes.string,
		url: PropTypes.string
	})
};

/**
 * Memoized custom `LinksData` component
 */
export const MemoizedLinksData = memo(LinksData);
