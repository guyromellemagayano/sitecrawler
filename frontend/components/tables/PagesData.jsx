import { MemoizedSiteDanagerIcon } from "@components/icons/SiteDangerIcon";
import { MemoizedSiteSuccessIcon } from "@components/icons/SiteSuccessIcon";
import { DashboardSitesLink, SitePagesSlug } from "@constants/PageLinks";
import { useComponentVisible } from "@hooks/useComponentVisible";
import { SiteCrawlerAppContext } from "@pages/_app";
import bytes from "bytes";
import dayjs from "dayjs";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import { memo, useContext, useEffect } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/**
 * Custom function to render the `PagesData` component
 *
 * @param {object} link
 */
const PagesData = ({ page = null }) => {
	// Site data props
	const pageId = page?.id ?? null;
	const pageUrl = page?.url ?? null;
	const pageTotalLinks = page?.num_links ?? null;
	const pageTotalImages = page?.num_images ?? null;
	const pageTotalScripts = page?.num_scripts ?? null;
	const pageTotalStylesheets = page?.num_stylesheets ?? null;
	const pageTotalSize = page?.size_total ?? null;
	const pageTlsStatus = page?.tls_status ?? null;
	const pageImagesTlsStatus = page?.tls_images ?? null;
	const pageScriptsTlsStatus = page?.tls_scripts ?? null;
	const pageStylesheetsTlsStatus = page?.tls_stylesheets ?? null;
	const pageTotalOkLinks = page?.num_ok_links ?? null;
	const pageTotalNonOkLinks = page?.num_non_ok_links ?? null;
	const pageTotalOkImages = page?.num_ok_images ?? null;
	const pageTotalNonOkImages = page?.num_non_ok_images ?? null;
	const pageTotalOkScripts = page?.num_ok_scripts ?? null;
	const pageTotalNonOkScripts = page?.num_non_ok_scripts ?? null;
	const pageTotalOkStylesheets = page?.num_ok_stylesheets ?? null;
	const pageTotalNonOkStylesheets = page?.num_non_ok_stylesheets ?? null;
	const pageTotalTlsImages = page?.num_tls_images ?? null;
	const pageTotalNonTlsImages = page?.num_non_tls_images ?? null;
	const pageTotalTlsScripts = page?.num_tls_scripts ?? null;
	const pageTotalNonTlsScripts = page?.num_non_tls_scripts ?? null;
	const pageTotalTlsStylesheets = page?.num_tls_stylesheets ?? null;
	const pageTotalNonTlsStylesheets = page?.num_non_tls_stylesheets ?? null;
	const pageResolvedTls = page?.resolved_tls ?? null;
	const pageResolvedSize = page?.resolved_size ?? null;
	const pageResolvedMissingTitle = page?.resolved_missing_title ?? null;
	const pageResolvedMissingDescription = page?.resolved_missing_description ?? null;
	const pageResolvedMissingH1First = page?.resolved_missing_h1_first ?? null;
	const pageResolvedMissingH1Second = page?.resolved_missing_h1_second ?? null;
	const pageResolvedMissingH2First = page?.resolved_missing_h2_first ?? null;
	const pageResolvedMissingH2Second = page?.resolved_missing_h2_second ?? null;
	const pageResolvedDuplicateTitle = page?.resolved_duplicate_title ?? null;
	const pageResolvedDuplicateDescription = page?.resolved_duplicate_description ?? null;

	// Router
	const { prefetch } = useRouter();

	// Translations
	const { t } = useTranslation();
	const markAsResolvedText = t("sites:markAsResolved");
	const visitExternalSiteText = t("sites:visitExternalSite");
	const goToSiteOverviewText = t("sites:goToSiteOverview");

	// Custom context
	const { isComponentReady, querySiteId, user, pages } = useContext(SiteCrawlerAppContext);

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
		// Prefetch pages page for faster loading
		prefetch(DashboardSitesLink + querySiteId + SitePagesSlug + pageId);
	}, [pageId, prefetch, querySiteId]);

	return (
		<tr>
			<td className="truncate-link flex-none whitespace-nowrap p-4">
				<div className="flex flex-col items-start">
					<div>
						{isComponentReady ? (
							<div>
								<p className="block truncate text-sm font-semibold leading-6 text-gray-500">{pageUrl}</p>
								<span className="flex justify-start space-x-2 text-sm leading-5 text-gray-500">
									<Link
										href="/dashboard/sites/[siteId]/pages/[pageId]/"
										as={`/dashboard/sites/${querySiteId}/pages/${pageId}`}
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
										href={pageUrl}
										className="flex cursor-pointer items-center justify-start text-sm font-semibold leading-6 text-gray-600 transition duration-150 ease-in-out hover:text-gray-500 focus:outline-none"
										title={visitExternalSiteText}
										target="_blank"
										rel="noreferrer"
									>
										{visitExternalSiteText}
									</a>

									{!pageTlsStatus ? (
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
				{isComponentReady ? (
					<span className="text-gray-500">
						{pageTotalSize > 0
							? bytes(pageTotalSize, {
									thousandsSeparator: " ",
									unitSeparator: " "
							  })
							: 0}
					</span>
				) : (
					<Skeleton duration={2} width={45} />
				)}
			</td>
			<td className="truncate-link whitespace-nowrap px-6 py-4 text-sm font-semibold leading-5 text-gray-500">
				{isComponentReady && pageTlsStatus ? (
					<MemoizedSiteSuccessIcon />
				) : isComponentReady && !pageTlsStatus ? (
					<MemoizedSiteDanagerIcon />
				) : (
					<Skeleton duration={2} width={150} />
				)}
			</td>
			<td className="truncate-link whitespace-nowrap px-6 py-4 text-sm font-semibold leading-5 text-gray-500">
				{isComponentReady && pageImagesTlsStatus ? (
					<MemoizedSiteSuccessIcon />
				) : isComponentReady && !pageImagesTlsStatus ? (
					<MemoizedSiteDanagerIcon />
				) : (
					<Skeleton duration={2} width={150} />
				)}
			</td>
			<td className="truncate-link whitespace-nowrap px-6 py-4 text-sm font-semibold leading-5 text-gray-500">
				{isComponentReady && pageScriptsTlsStatus ? (
					<MemoizedSiteSuccessIcon />
				) : isComponentReady && !pageScriptsTlsStatus ? (
					<MemoizedSiteDanagerIcon />
				) : (
					<Skeleton duration={2} width={150} />
				)}
			</td>
			<td className="truncate-link whitespace-nowrap px-6 py-4 text-sm font-semibold leading-5 text-gray-500">
				{isComponentReady && pageStylesheetsTlsStatus ? (
					<MemoizedSiteSuccessIcon />
				) : isComponentReady && !pageStylesheetsTlsStatus ? (
					<MemoizedSiteDanagerIcon />
				) : (
					<Skeleton duration={2} width={150} />
				)}
			</td>
			<td className="truncate-link whitespace-nowrap px-6 py-4 text-sm font-semibold leading-5 text-gray-500">
				{isComponentReady && pageTotalLinks ? (
					<span className="text-gray-500">{pageTotalLinks}</span>
				) : (
					<Skeleton duration={2} width={45} />
				)}
			</td>
			<td className="truncate-link whitespace-nowrap px-6 py-4 text-sm font-semibold leading-5 text-gray-500">
				{isComponentReady ? (
					<span className="text-gray-500">{pageTotalImages > 0 ? pageTotalImages : 0}</span>
				) : (
					<Skeleton duration={2} width={45} />
				)}
			</td>
			<td className="truncate-link whitespace-nowrap px-6 py-4 text-sm font-semibold leading-5 text-gray-500">
				{isComponentReady ? (
					<span className="text-gray-500">{pageTotalScripts > 0 ? pageTotalScripts : 0}</span>
				) : (
					<Skeleton duration={2} width={45} />
				)}
			</td>
			<td className="truncate-link whitespace-nowrap px-6 py-4 text-sm font-semibold leading-5 text-gray-500">
				{isComponentReady ? (
					<span className="text-gray-500">{pageTotalStylesheets > 0 ? pageTotalStylesheets : 0}</span>
				) : (
					<Skeleton duration={2} width={45} />
				)}
			</td>
			<td className="truncate-link whitespace-nowrap px-6 py-4 text-sm font-semibold leading-5 text-gray-500">
				{isComponentReady ? (
					pageTotalOkLinks > 0 ? (
						<span className="text-green-500">{pageTotalOkLinks}</span>
					) : (
						<span className="text-red-500">0</span>
					)
				) : (
					<Skeleton duration={2} width={45} />
				)}
			</td>
			<td className="truncate-link whitespace-nowrap px-6 py-4 text-sm font-semibold leading-5 text-gray-500">
				{isComponentReady ? (
					pageTotalNonOkLinks > 0 ? (
						<span className="text-red-500">{pageTotalNonOkLinks}</span>
					) : (
						<span className="text-green-500">0</span>
					)
				) : (
					<Skeleton duration={2} width={45} />
				)}
			</td>
			<td className="truncate-link whitespace-nowrap px-6 py-4 text-sm font-semibold leading-5 text-gray-500">
				{isComponentReady ? (
					pageTotalOkImages > 0 ? (
						<span className="text-green-500">{pageTotalOkImages}</span>
					) : (
						<span className="text-red-500">0</span>
					)
				) : (
					<Skeleton duration={2} width={45} />
				)}
			</td>
			<td className="truncate-link whitespace-nowrap px-6 py-4 text-sm font-semibold leading-5 text-gray-500">
				{isComponentReady ? (
					pageTotalNonOkImages > 0 ? (
						<span className="text-red-500">{pageTotalNonOkImages}</span>
					) : (
						<span className="text-green-500">0</span>
					)
				) : (
					<Skeleton duration={2} width={45} />
				)}
			</td>
			<td className="truncate-link whitespace-nowrap px-6 py-4 text-sm font-semibold leading-5 text-gray-500">
				{isComponentReady ? (
					pageTotalOkScripts > 0 ? (
						<span className="text-green-500">{pageTotalOkScripts}</span>
					) : (
						<span className="text-red-500">0</span>
					)
				) : (
					<Skeleton duration={2} width={45} />
				)}
			</td>
			<td className="truncate-link whitespace-nowrap px-6 py-4 text-sm font-semibold leading-5 text-gray-500">
				{isComponentReady ? (
					pageTotalNonOkScripts > 0 ? (
						<span className="text-red-500">{pageTotalNonOkScripts}</span>
					) : (
						<span className="text-green-500">0</span>
					)
				) : (
					<Skeleton duration={2} width={45} />
				)}
			</td>
			<td className="truncate-link whitespace-nowrap px-6 py-4 text-sm font-semibold leading-5 text-gray-500">
				{isComponentReady ? (
					pageTotalOkStylesheets > 0 ? (
						<span className="text-green-500">{pageTotalOkStylesheets}</span>
					) : (
						<span className="text-red-500">0</span>
					)
				) : (
					<Skeleton duration={2} width={45} />
				)}
			</td>
			<td className="truncate-link whitespace-nowrap px-6 py-4 text-sm font-semibold leading-5 text-gray-500">
				{isComponentReady ? (
					pageTotalNonOkStylesheets > 0 ? (
						<span className="text-red-500">{pageTotalNonOkStylesheets}</span>
					) : (
						<span className="text-green-500">0</span>
					)
				) : (
					<Skeleton duration={2} width={45} />
				)}
			</td>
			<td className="truncate-link whitespace-nowrap px-6 py-4 text-sm font-semibold leading-5 text-gray-500">
				{isComponentReady ? (
					pageTotalTlsImages > 0 ? (
						<span className="text-green-500">{pageTotalTlsImages}</span>
					) : (
						<span className="text-red-500">0</span>
					)
				) : (
					<Skeleton duration={2} width={45} />
				)}
			</td>
			<td className="truncate-link whitespace-nowrap px-6 py-4 text-sm font-semibold leading-5 text-gray-500">
				{isComponentReady ? (
					pageTotalNonTlsImages > 0 ? (
						<span className="text-red-500">{pageTotalNonTlsImages}</span>
					) : (
						<span className="text-green-500">0</span>
					)
				) : (
					<Skeleton duration={2} width={45} />
				)}
			</td>
			<td className="truncate-link whitespace-nowrap px-6 py-4 text-sm font-semibold leading-5 text-gray-500">
				{isComponentReady ? (
					pageTotalTlsScripts > 0 ? (
						<span className="text-green-500">{pageTotalTlsScripts}</span>
					) : (
						<span className="text-red-500">0</span>
					)
				) : (
					<Skeleton duration={2} width={45} />
				)}
			</td>
			<td className="truncate-link whitespace-nowrap px-6 py-4 text-sm font-semibold leading-5 text-gray-500">
				{isComponentReady ? (
					pageTotalNonTlsScripts > 0 ? (
						<span className="text-red-500">{pageTotalNonTlsScripts}</span>
					) : (
						<span className="text-green-500">0</span>
					)
				) : (
					<Skeleton duration={2} width={45} />
				)}
			</td>
			<td className="truncate-link whitespace-nowrap px-6 py-4 text-sm font-semibold leading-5 text-gray-500">
				{isComponentReady ? (
					pageTotalTlsStylesheets > 0 ? (
						<span className="text-green-500">{pageTotalTlsStylesheets}</span>
					) : (
						<span className="text-red-500">0</span>
					)
				) : (
					<Skeleton duration={2} width={45} />
				)}
			</td>
			<td className="truncate-link whitespace-nowrap px-6 py-4 text-sm font-semibold leading-5 text-gray-500">
				{isComponentReady ? (
					pageTotalNonTlsStylesheets > 0 ? (
						<span className="text-red-500">{pageTotalNonTlsStylesheets}</span>
					) : (
						<span className="text-green-500">0</span>
					)
				) : (
					<Skeleton duration={2} width={45} />
				)}
			</td>
			<td className="truncate-link whitespace-nowrap px-6 py-4 text-sm font-semibold leading-5 text-gray-500">
				{isComponentReady ? (
					pageResolvedTls ? (
						<span className="text-gray-500">{pageResolvedTls}</span>
					) : null
				) : (
					<Skeleton duration={2} width={75} />
				)}
			</td>
			<td className="truncate-link whitespace-nowrap px-6 py-4 text-sm font-semibold leading-5 text-gray-500">
				{isComponentReady ? (
					pageResolvedSize ? (
						<span className="text-gray-500">{pageResolvedSize}</span>
					) : null
				) : (
					<Skeleton duration={2} width={75} />
				)}
			</td>
			<td className="truncate-link whitespace-nowrap px-6 py-4 text-sm font-semibold leading-5 text-gray-500">
				{isComponentReady ? (
					pageResolvedMissingTitle ? (
						<span className="text-gray-500">{pageResolvedMissingTitle}</span>
					) : null
				) : (
					<Skeleton duration={2} width={75} />
				)}
			</td>
			<td className="truncate-link whitespace-nowrap px-6 py-4 text-sm font-semibold leading-5 text-gray-500">
				{isComponentReady ? (
					pageResolvedMissingDescription ? (
						<span className="text-gray-500">{pageResolvedMissingDescription}</span>
					) : null
				) : (
					<Skeleton duration={2} width={75} />
				)}
			</td>
			<td className="truncate-link whitespace-nowrap px-6 py-4 text-sm font-semibold leading-5 text-gray-500">
				{isComponentReady ? (
					pageResolvedMissingH1First ? (
						<span className="text-gray-500">{pageResolvedMissingH1First}</span>
					) : null
				) : (
					<Skeleton duration={2} width={75} />
				)}
			</td>
			<td className="truncate-link whitespace-nowrap px-6 py-4 text-sm font-semibold leading-5 text-gray-500">
				{isComponentReady ? (
					pageResolvedMissingH1Second ? (
						<span className="text-gray-500">{pageResolvedMissingH1Second}</span>
					) : null
				) : (
					<Skeleton duration={2} width={75} />
				)}
			</td>
			<td className="truncate-link whitespace-nowrap px-6 py-4 text-sm font-semibold leading-5 text-gray-500">
				{isComponentReady ? (
					pageResolvedMissingH2First ? (
						<span className="text-gray-500">{pageResolvedMissingH2First}</span>
					) : null
				) : (
					<Skeleton duration={2} width={75} />
				)}
			</td>
			<td className="truncate-link whitespace-nowrap px-6 py-4 text-sm font-semibold leading-5 text-gray-500">
				{isComponentReady ? (
					pageResolvedMissingH2Second ? (
						<span className="text-gray-500">{pageResolvedMissingH2Second}</span>
					) : null
				) : (
					<Skeleton duration={2} width={75} />
				)}
			</td>
			<td className="truncate-link whitespace-nowrap px-6 py-4 text-sm font-semibold leading-5 text-gray-500">
				{isComponentReady ? (
					pageResolvedDuplicateTitle ? (
						<span className="text-gray-500">{pageResolvedDuplicateTitle}</span>
					) : null
				) : (
					<Skeleton duration={2} width={75} />
				)}
			</td>
			<td className="truncate-link whitespace-nowrap px-6 py-4 text-sm font-semibold leading-5 text-gray-500">
				{isComponentReady ? (
					pageResolvedDuplicateDescription ? (
						<span className="text-gray-500">{pageResolvedDuplicateDescription}</span>
					) : null
				) : (
					<Skeleton duration={2} width={75} />
				)}
			</td>
		</tr>
	);
};

PagesData.propTypes = {
	page: PropTypes.shape({
		id: PropTypes.number,
		num_images: PropTypes.number,
		num_links: PropTypes.number,
		num_non_ok_images: PropTypes.number,
		num_non_ok_links: PropTypes.number,
		num_non_ok_scripts: PropTypes.number,
		num_non_ok_stylesheets: PropTypes.number,
		num_non_tls_images: PropTypes.number,
		num_non_tls_scripts: PropTypes.number,
		num_non_tls_stylesheets: PropTypes.number,
		num_ok_images: PropTypes.number,
		num_ok_links: PropTypes.number,
		num_ok_scripts: PropTypes.number,
		num_ok_stylesheets: PropTypes.number,
		num_scripts: PropTypes.number,
		num_stylesheets: PropTypes.number,
		num_tls_images: PropTypes.number,
		num_tls_scripts: PropTypes.number,
		num_tls_stylesheets: PropTypes.number,
		resolved_duplicate_description: PropTypes.bool,
		resolved_duplicate_title: PropTypes.bool,
		resolved_missing_description: PropTypes.bool,
		resolved_missing_h1_first: PropTypes.bool,
		resolved_missing_h1_second: PropTypes.bool,
		resolved_missing_h2_first: PropTypes.bool,
		resolved_missing_h2_second: PropTypes.bool,
		resolved_missing_title: PropTypes.bool,
		resolved_size: PropTypes.bool,
		resolved_tls: PropTypes.bool,
		size_total: PropTypes.number,
		tls_images: PropTypes.bool,
		tls_scripts: PropTypes.bool,
		tls_status: PropTypes.any,
		tls_stylesheets: PropTypes.bool,
		url: PropTypes.string
	}),
	validatingPages: PropTypes.bool
};

/**
 * Memoized custom `PagesData` component
 */
export const MemoizedPagesData = memo(PagesData);
