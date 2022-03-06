import { MemoizedBadge } from "@components/badges";
import { MemoizedSiteDanagerIcon } from "@components/icons/SiteDangerIcon";
import { MemoizedSiteSuccessIcon } from "@components/icons/SiteSuccessIcon";
import { useComponentVisible } from "@hooks/useComponentVisible";
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

/**
 * Custom function to render the `ImagesData` component
 *
 * @param {object} image
 */
const ImagesData = ({ image = null }) => {
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
		<tr>
			<td className="flex-none whitespace-nowrap p-4">
				<div className="flex flex-col items-start">
					<div>
						{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
							<>
								{imageStatus === "OK" && imageTlsStatus === "OK" ? (
									<span
										aria-label="Ok"
										className="relative -left-3 inline-block h-2 w-2 flex-shrink-0 rounded-full bg-green-400 leading-5"
									></span>
								) : imageStatus === "TIMEOUT" ? (
									<span
										aria-label="Timeout"
										className="relative -left-3 inline-block h-2 w-2 flex-shrink-0 rounded-full bg-yellow-400 leading-5"
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
										className="relative -left-3 inline-block h-2 w-2 flex-shrink-0 rounded-full bg-red-400 leading-5"
									></span>
								)}

								<div className="inline-flex flex-col items-start justify-start">
									<span className="flex items-center justify-start text-sm font-semibold leading-6 text-gray-500">
										<p className="truncate-link">{imageUrl}</p>
									</span>
									<span className="flex justify-start space-x-2 text-sm leading-5 text-gray-500">
										<Link
											href="/dashboard/sites/[siteId]/images/[imageId]/"
											as={`/dashboard/sites/${sanitizedSiteId}/images/${imageId}`}
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
											href={imageUrl}
											className="flex cursor-pointer items-center justify-start text-sm font-semibold leading-6 text-gray-600 transition duration-150 ease-in-out hover:text-gray-500 focus:outline-none"
											title={visitExternalSiteText}
											target="_blank"
											rel="noreferrer"
										>
											{visitExternalSiteText}
										</a>

										{imageStatus !== "OK" ? (
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
			<td className="whitespace-nowrap px-6 py-4 text-sm leading-5 text-gray-500">
				{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
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
			<td className="whitespace-nowrap px-6 py-4 text-sm font-semibold leading-5 text-gray-500">
				{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
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
			<td className="whitespace-nowrap px-6 py-4 text-sm font-semibold leading-5 text-gray-500">
				{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
					imageTlsStatus ? (
						<MemoizedSiteSuccessIcon />
					) : !imageTlsStatus ? (
						<MemoizedSiteDanagerIcon />
					) : null
				) : (
					<Skeleton duration={2} width={150} />
				)}
			</td>
			<td className="whitespace-nowrap px-6 py-4 text-sm font-semibold leading-5 text-gray-500">
				{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
					Math.round(imageHttpStatus / 100) === 2 ? (
						<span className="text-green-500">{imageHttpStatus}</span>
					) : Math.round(imageHttpStatus / 100) === 4 || Math.round(imageHttpStatus / 100) === 5 ? (
						<span className="text-red-500">{imageHttpStatus}</span>
					) : Math.round(imageHttpStatus / 100) === 3 ? (
						<span className="text-yellow-500">{imageHttpStatus}</span>
					) : (
						<span className="text-gray-500">{imageHttpStatus}</span>
					)
				) : (
					<Skeleton duration={2} width={45} />
				)}
			</td>
			<td className="whitespace-nowrap px-6 py-4 text-sm font-semibold leading-5 text-gray-500">
				{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
					<span className="text-gray-500">
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
			<td className="whitespace-nowrap px-6 py-4 text-sm font-semibold leading-5 text-gray-500">
				{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
					imageOccurences ? (
						<span className="text-gray-500">{imageOccurences}</span>
					) : null
				) : (
					<Skeleton duration={2} width={45} />
				)}
			</td>
			<td className="whitespace-nowrap px-6 py-4 text-sm font-semibold leading-5 text-gray-500">
				{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
					<span className="text-gray-500">{imageMissingAlts > 0 ? imageMissingAlts : 0}</span>
				) : (
					<Skeleton duration={2} width={45} />
				)}
			</td>

			<td className="whitespace-nowrap px-6 py-4 text-sm font-semibold leading-5 text-gray-500">
				{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
					imageResolvedStatus ? (
						<span className="text-gray-500">{imageResolvedStatus}</span>
					) : null
				) : (
					<Skeleton duration={2} width={75} />
				)}
			</td>
			<td className="whitespace-nowrap px-6 py-4 text-sm font-semibold leading-5 text-gray-500">
				{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
					imageResolvedMissingAlts ? (
						<span className="text-gray-500">{imageResolvedMissingAlts}</span>
					) : null
				) : (
					<Skeleton duration={2} width={75} />
				)}
			</td>
			<td className="whitespace-nowrap px-6 py-4 text-sm font-semibold leading-5 text-gray-500">
				{isComponentReady && user && Math.round(user?.status / 100) === 2 && !user?.data?.detail ? (
					imageResolvedTls ? (
						<span className="text-gray-500">{imageResolvedTls}</span>
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
		http_status: PropTypes.any,
		id: PropTypes.number,
		missing_alts: PropTypes.number,
		occurences: PropTypes.number,
		resolved_missing_alts: PropTypes.bool,
		resolved_status: PropTypes.bool,
		resolved_tls: PropTypes.bool,
		size: PropTypes.number,
		status: PropTypes.string,
		tls_status: PropTypes.any,
		type: PropTypes.string,
		url: PropTypes.string
	})
};

/**
 * Memoized custom `ImagesData` component
 */
export const MemoizedImagesData = memo(ImagesData);
