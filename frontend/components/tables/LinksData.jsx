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
	const linkResolvedStatus = link?.resolved_status ?? "";
	const linkResolvedTls = link?.resolved_tls ?? "";

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
	const nonWebText = t("sites:nonWeb");

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
			<td className="flex-none whitespace-nowrap p-4">
				<div className="flex flex-col items-start">
					<div>
						<div>
							{isComponentReady &&
							user &&
							Math.round(user?.status / 100) === 2 &&
							!user?.data?.detail &&
							!validatingLinks ? (
								<>
									{linkStatus === "OK" && linkTlsStatus === "OK" ? (
										<span
											aria-label="Ok"
											className="relative -left-3 inline-block h-2 w-2 flex-shrink-0 rounded-full bg-green-400 leading-5"
										></span>
									) : linkStatus === "TIMEOUT" ? (
										<span
											aria-label="Timeout"
											className="relative -left-3 inline-block h-2 w-2 flex-shrink-0 rounded-full bg-yellow-400 leading-5"
										></span>
									) : (
										<span
											aria-label={
												linkStatus === "HTTP_ERROR" && linkTlsStatus === "ERROR"
													? "HTTP Error"
													: linkStatus === "TOO MANY REDIRECTS"
													? "Too Many Redirects"
													: "Other Error"
											}
											className="relative -left-3 inline-block h-2 w-2 flex-shrink-0 rounded-full bg-red-400 leading-5"
										></span>
									)}

									<div className="inline-flex flex-col items-start justify-start">
										<span className="flex items-center justify-start text-sm font-semibold leading-6 text-gray-500">
											<p className="truncate-link">{linkUrl}</p>
										</span>
										<span className="flex justify-start space-x-2 text-sm leading-5 text-gray-500">
											<Link
												href="/dashboard/sites/[siteId]/links/[linkId]/"
												as={`/dashboard/sites/${sanitizedSiteId}/links/${linkDetailId}`}
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
													onClick={() => {}}
												>
													{markAsResolvedText}
												</button>
											) : null}
										</span>
									</div>
								</>
							) : (
								<span className="relative -left-3 flex items-start space-x-3 py-2">
									<Skeleton
										duration={2}
										width={9}
										height={9}
										circle={true}
										className="relative -left-3 top-4 block flex-shrink-0"
									/>
									<div className="inline-flex flex-col items-start justify-start">
										<Skeleton
											duration={2}
											width={150}
											className="relative -left-3 inline-flex flex-col items-start justify-start"
										/>
										<span className="flex flex-row justify-start space-x-3 text-sm leading-5 text-gray-500">
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
				</div>
			</td>
			<td className="whitespace-nowrap px-6 py-4 text-sm leading-5 text-gray-500">
				{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail && !validatingLinks ? (
					linkType === "PAGE" ? (
						internalText
					) : linkType === "EXTERNAL" ? (
						externalText
					) : linkType === "NON_WEB" ? (
						nonWebText
					) : (
						otherText
					)
				) : (
					<Skeleton duration={2} width={100} />
				)}
			</td>
			<td className="whitespace-nowrap px-6 py-4 text-sm font-semibold leading-5 text-gray-500">
				{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail && !validatingLinks ? (
					linkStatus === "OK" ? (
						<MemoizedBadge text="OK" isSuccess />
					) : linkStatus === "TIMEOUT" ? (
						<MemoizedBadge text="TIMEOUT" isWarning />
					) : linkStatus === "HTTP_ERROR" ? (
						<MemoizedBadge text={`${linkHttpStatus} HTTP ERROR`} isDanger />
					) : (
						<MemoizedBadge text="OTHER ERROR" isDanger />
					)
				) : (
					<Skeleton duration={2} width={150} />
				)}
			</td>
			<td className="whitespace-nowrap px-6 py-4 text-sm font-semibold leading-5 text-gray-500">
				{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail && !validatingLinks ? (
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
			<td className="whitespace-nowrap px-6 py-4 text-sm font-semibold leading-5 text-gray-500">
				{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail && !validatingLinks ? (
					linkDetailPages?.length > 0 ? (
						<Link
							href="/dashboard/sites/[siteId]/links/[linkId]/"
							as={`/dashboard/sites/${sanitizedSiteId}/links/${linkDetailId}/`}
							passHref
						>
							<a className="mr-3 flex items-center text-sm font-semibold leading-6 text-indigo-600 outline-none transition duration-150 ease-in-out hover:text-indigo-500 focus:outline-none">
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
									? handleConversionStringToLowercase(otherText)
									: null}
							</a>
						</Link>
					) : null
				) : (
					<Skeleton duration={2} width={120} />
				)}
			</td>
			<td className="whitespace-nowrap px-6 py-4 text-sm font-semibold leading-5 text-gray-500">
				{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail && !validatingLinks ? (
					linkOccurrences ? (
						<span className="text-gray-500">{linkOccurrences}</span>
					) : null
				) : (
					<Skeleton duration={2} width={45} />
				)}
			</td>
			<td className="whitespace-nowrap px-6 py-4 text-sm font-semibold leading-5 text-gray-500">
				{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail && !validatingLinks ? (
					linkResolvedStatus ? (
						<span className="text-gray-500">{linkResolvedStatus}</span>
					) : null
				) : (
					<Skeleton duration={2} width={75} />
				)}
			</td>
			<td className="whitespace-nowrap px-6 py-4 text-sm font-semibold leading-5 text-gray-500">
				{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail && !validatingLinks ? (
					linkResolvedTls ? (
						<span className="text-gray-500">{linkResolvedTls}</span>
					) : null
				) : (
					<Skeleton duration={2} width={75} />
				)}
			</td>
		</tr>
	);
};

LinksData.propTypes = {
	link: PropTypes.shape({
		http_status: PropTypes.string,
		id: PropTypes.number,
		occurences: PropTypes.number,
		resolved_status: PropTypes.string,
		resolved_tls: PropTypes.string,
		status: PropTypes.string,
		tls_status: PropTypes.bool,
		type: PropTypes.string,
		url: PropTypes.string
	}),
	validatingLinks: PropTypes.bool
};

/**
 * Memoized custom `LinksData` component
 */
export const MemoizedLinksData = memo(LinksData);
