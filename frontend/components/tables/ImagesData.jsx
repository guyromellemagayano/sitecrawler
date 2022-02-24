import { MemoizedBadge } from "@components/badges";
import { MemoizedSiteDanagerIcon } from "@components/icons/SiteDangerIcon";
import { MemoizedSiteSuccessIcon } from "@components/icons/SiteSuccessIcon";
import { useComponentVisible } from "@hooks/useComponentVisible";
import { useLinkDetail } from "@hooks/useLinkDetail";
import { useScan } from "@hooks/useScan";
import { useUser } from "@hooks/useUser";
import { SiteCrawlerAppContext } from "@pages/_app";
import { handleConversionStringToNumber } from "@utils/convertCase";
import bytes from "bytes";
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
 * Custom function to render the `ImagesData` component
 *
 * @param {object} link
 * @param {boolean} validatingImages
 */
const ImagesData = ({ image = null, validatingImages = false }) => {
	// Site data props
	const imageId = image?.id ?? null;
	const imageType = image?.type ?? null;
	const imageStatus = image?.status ?? null;
	const imageUrl = image?.url ?? null;
	const imageHttpStatus = image?.http_status ?? null;
	const imageSize = image?.size ?? null;
	const imageOccurences = image?.occurences ?? null;
	const imageTlsStatus = image?.tls_status ?? null;
	const imageMissingAlts = image?.missing_alts ?? null;
	const imageResolvedStatus = image?.resolved_status ?? null;
	const imageResolvedMissingAlts = image?.resolved_missing_alts ?? null;
	const imageResolvedTls = image?.resolved_tls ?? null;

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
	const { linkDetail, linkDetailId, linkDetailPages } = useLinkDetail(sanitizedSiteId, scanObjId, imageId);

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
						<div>
							{isComponentReady &&
							user &&
							Math.round(user?.status / 100) === 2 &&
							!user?.data?.detail &&
							!validatingImages ? (
								<>
									{imageStatus === "OK" && imageTlsStatus === "OK" ? (
										<span
											aria-label="Ok"
											tw="relative -left-3 flex-shrink-0 inline-block h-2 w-2 rounded-full leading-5 bg-green-400"
										></span>
									) : imageStatus === "TIMEOUT" ? (
										<span
											aria-label="Timeout"
											tw="relative -left-3 flex-shrink-0 inline-block h-2 w-2 rounded-full leading-5 bg-yellow-400"
										></span>
									) : (
										<span
											aria-label={
												imageStatus === "HTTP_ERROR" && imageTlsStatus === "ERROR"
													? "HTTP Error"
													: imageStatus === "TOO MANY REDIRECTS"
													? "Too Many Redirects"
													: "Other Error"
											}
											tw="relative -left-3 flex-shrink-0 inline-block h-2 w-2 rounded-full leading-5 bg-red-400"
										></span>
									)}

									<div tw="inline-flex flex-col justify-start items-start">
										<span tw="flex items-center justify-start text-sm leading-6 font-semibold text-gray-500">
											<p className="truncate-link">{imageUrl}</p>
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
												href={imageUrl}
												tw="cursor-pointer flex items-center justify-start text-sm focus:outline-none leading-6 font-semibold text-gray-600 hover:text-gray-500 transition ease-in-out duration-150"
												title={visitExternalSiteText}
												target="_blank"
												rel="noreferrer"
											>
												{visitExternalSiteText}
											</a>

											{imageStatus !== "OK" ? (
												<button
													type="button"
													tw="cursor-pointer ml-3 flex items-center justify-start text-sm focus:outline-none leading-6 font-semibold text-green-600 hover:text-green-500 transition ease-in-out duration-150"
													onClick={() => {}}
												>
													{markAsResolvedText}
												</button>
											) : null}
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
						</div>
					</div>
				</div>
			</td>
			<td tw="px-6 py-4 whitespace-nowrap text-sm text-gray-500 leading-5">
				{isComponentReady &&
				user &&
				Math.round(user?.status / 100) === 2 &&
				!user?.data?.detail &&
				!validatingImages ? (
					imageType === "PAGE" ? (
						internalText
					) : imageType === "EXTERNAL" ? (
						externalText
					) : imageType === "NON_WEB" ? (
						nonWebText
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
				!validatingImages ? (
					imageStatus === "OK" ? (
						<MemoizedBadge text="OK" isSuccess />
					) : imageStatus === "TIMEOUT" ? (
						<MemoizedBadge text="TIMEOUT" isWarning />
					) : imageStatus === "HTTP_ERROR" ? (
						<MemoizedBadge text={`${imageHttpStatus} HTTP ERROR`} isDanger />
					) : (
						<MemoizedBadge text="OTHER ERROR" isDanger />
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
				!validatingImages ? (
					imageTlsStatus ? (
						<MemoizedSiteSuccessIcon />
					) : !imageTlsStatus ? (
						<MemoizedSiteDanagerIcon />
					) : null
				) : (
					<Skeleton duration={2} width={150} />
				)}
			</td>
			<td tw="px-6 py-4 whitespace-nowrap text-sm text-gray-500 leading-5 font-semibold">
				{isComponentReady &&
				user &&
				Math.round(user?.status / 100) === 2 &&
				!user?.data?.detail &&
				!validatingImages ? (
					Math.round(imageHttpStatus / 100) === 2 ? (
						<span tw="text-green-500">{imageHttpStatus}</span>
					) : Math.round(imageHttpStatus / 100) === 4 || Math.round(imageHttpStatus / 100) === 5 ? (
						<span tw="text-red-500">{imageHttpStatus}</span>
					) : Math.round(imageHttpStatus / 100) === 3 ? (
						<span tw="text-yellow-500">{imageHttpStatus}</span>
					) : (
						<span tw="text-gray-500">{imageHttpStatus}</span>
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
				!validatingImages ? (
					<span tw="text-gray-500">
						{imageSize > 0
							? bytes(imageSize, {
									thousandsSeparator: " ",
									unitSeparator: " "
							  })
							: 0}
					</span>
				) : (
					<Skeleton duration={2} width={45} />
				)}
			</td>
			<td tw="px-6 py-4 whitespace-nowrap text-sm text-gray-500 leading-5 font-semibold">
				{isComponentReady &&
				user &&
				Math.round(user?.status / 100) === 2 &&
				!user?.data?.detail &&
				!validatingImages ? (
					imageOccurences ? (
						<span tw="text-gray-500">{imageOccurences}</span>
					) : null
				) : (
					<Skeleton duration={2} width={45} />
				)}
			</td>
			<td tw="px-6 py-4 whitespace-nowrap text-sm text-gray-500 leading-5 font-semibold">
				{isComponentReady &&
				user &&
				Math.round(user?.status / 100) === 2 &&
				!user?.data?.detail &&
				!validatingImages ? (
					<span tw="text-gray-500">{imageOccurences > 0 ? imageOccurences : 0}</span>
				) : (
					<Skeleton duration={2} width={45} />
				)}
			</td>
			<td tw="px-6 py-4 whitespace-nowrap text-sm text-gray-500 leading-5 font-semibold">
				{isComponentReady &&
				user &&
				Math.round(user?.status / 100) === 2 &&
				!user?.data?.detail &&
				!validatingImages ? (
					<span tw="text-gray-500">{imageMissingAlts > 0 ? imageMissingAlts : 0}</span>
				) : (
					<Skeleton duration={2} width={45} />
				)}
			</td>

			<td tw="px-6 py-4 whitespace-nowrap text-sm text-gray-500 leading-5 font-semibold">
				{isComponentReady &&
				user &&
				Math.round(user?.status / 100) === 2 &&
				!user?.data?.detail &&
				!validatingImages ? (
					imageResolvedStatus ? (
						<span tw="text-gray-500">{imageResolvedStatus}</span>
					) : null
				) : (
					<Skeleton duration={2} width={75} />
				)}
			</td>
			<td tw="px-6 py-4 whitespace-nowrap text-sm text-gray-500 leading-5 font-semibold">
				{isComponentReady &&
				user &&
				Math.round(user?.status / 100) === 2 &&
				!user?.data?.detail &&
				!validatingImages ? (
					imageResolvedMissingAlts ? (
						<span tw="text-gray-500">{imageResolvedMissingAlts}</span>
					) : null
				) : (
					<Skeleton duration={2} width={75} />
				)}
			</td>
			<td tw="px-6 py-4 whitespace-nowrap text-sm text-gray-500 leading-5 font-semibold">
				{isComponentReady &&
				user &&
				Math.round(user?.status / 100) === 2 &&
				!user?.data?.detail &&
				!validatingImages ? (
					imageResolvedTls ? (
						<span tw="text-gray-500">{imageResolvedTls}</span>
					) : null
				) : (
					<Skeleton duration={2} width={75} />
				)}
			</td>
		</tr>
	);
};

ImagesData.propTypes = {
	image: PropTypes.shape({
		http_status: PropTypes.string,
		id: PropTypes.number,
		missing_alts: PropTypes.number,
		occurences: PropTypes.number,
		resolved_missing_alts: PropTypes.bool,
		resolved_status: PropTypes.bool,
		resolved_tls: PropTypes.bool,
		size: PropTypes.number,
		status: PropTypes.string,
		tls_status: PropTypes.bool,
		type: PropTypes.string,
		url: PropTypes.string
	}),
	validatingImages: PropTypes.bool
};

/**
 * Memoized custom `ImagesData` component
 */
export const MemoizedImagesData = memo(ImagesData);
