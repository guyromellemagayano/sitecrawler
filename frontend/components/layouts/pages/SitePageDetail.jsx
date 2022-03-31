import { MemoizedBadge } from "@components/badges";
import { MemoizedSiteSuccessIcon } from "@components/icons/SiteSuccessIcon";
import { MemoizedPageOption } from "@components/options/PageOption";
import { SiteCrawlerAppContext } from "@pages/_app";
import { classnames } from "@utils/classnames";
import bytes from "bytes";
import dayjs from "dayjs";
import useTranslation from "next-translate/useTranslation";
import { memo, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/**
 * Custom function to render the `SitePageDetailPageLayout` component
 */
const SitePageDetailPageLayout = () => {
	// Translations
	const { t } = useTranslation();
	const noneText = t("common:none");
	const resolvedIssuesText = t("sites:resolvedIssues");
	const tlsInformationText = t("sites:tlsInformation");
	const createdAtText = t("sites:createdAt");
	const tlsNotBeforeText = t("sites:tls.tlsNotBefore");
	const tlsNotAfterText = t("sites:tls.tlsNotAfter");
	const tlsCommonNameText = t("sites:tls.tlsCommonName");
	const tlsOrganizationText = t("sites:tls.tlsOrganization");
	const tlsDnsNamesText = t("sites:tls.tlsDnsNames");
	const tlsIssuerOrganizationText = t("sites:tls.tlsIssuerOrganization");
	const tlsIssuerCommonNameText = t("sites:tls.tlsIssuerCommonName");
	const tlsCipherSuiteText = t("sites:tls.tlsCipherSuite");
	const tlsVersionText = t("sites:tls.tlsVersion");
	const tlsErrorsText = t("sites:tls.tlsErrors");
	const pageInformationText = t("sites:pageDetail.pageInformation");
	const seoInformationText = t("sites:pageDetail.seoInformation");
	const sizeText = t("sites:pageDetail.size");
	const totalLinksText = t("sites:pageDetail.totalLinks");
	const totalOkLinksText = t("sites:pageDetail.totalOkLinks");
	const totalNonOkLinksText = t("sites:pageDetail.totalNonOkLinks");
	const totalImagesText = t("sites:pageDetail.totalImages");
	const totalOkImagesText = t("sites:pageDetail.totalOkImages");
	const totalNonOkImagesText = t("sites:pageDetail.totalNonOkImages");
	const totalScriptsText = t("sites:pageDetail.totalScripts");
	const totalOkScriptsText = t("sites:pageDetail.totalOkScripts");
	const totalNonOkScriptsText = t("sites:pageDetail.totalNonOkScripts");
	const totalStylesheetsText = t("sites:pageDetail.totalStylesheets");
	const totalOkStylesheetsText = t("sites:pageDetail.totalOkStylesheets");
	const totalNonOkStylesheetsText = t("sites:pageDetail.totalNonOkStylesheets");
	const totalSizeImagesText = t("sites:pageDetail.totalSizeImages");
	const totalSizeScriptsText = t("sites:pageDetail.totalSizeScripts");
	const totalSizeStylesheetsText = t("sites:pageDetail.totalSizeStylesheets");
	const totalSizeText = t("sites:pageDetail.totalSize");
	const totalSizeAdjustedText = t("sites:pageDetail.totalSizeAdjusted");
	const tlsStatusText = t("sites:pageDetail.tlsStatus");
	const totalTlsImagesText = t("sites:pageDetail.totalTlsImages");
	const totalNonTlsImagesText = t("sites:pageDetail.totalNonTlsImages");
	const totalTlsScriptsText = t("sites:pageDetail.totalTlsScripts");
	const totalNonTlsScriptsText = t("sites:pageDetail.totalNonTlsScripts");
	const totalTlsStylesheetsText = t("sites:pageDetail.totalTlsStylesheets");
	const totalNonTlsStylesheetsText = t("sites:pageDetail.totalNonTlsStylesheets");
	const tlsImagesText = t("sites:pageDetail.tlsImages");
	const tlsScriptsText = t("sites:pageDetail.tlsScripts");
	const tlsStylesheetsText = t("sites:pageDetail.tlsStylesheets");
	const tlsTotalText = t("sites:pageDetail.tlsTotal");
	const tlsTotalAdjustedText = t("sites:pageDetail.tlsTotalAdjusted");
	const hasTitleAdjustedText = t("sites:pageDetail.seo.hasTitleAdjusted");
	const hasDescriptionAdjustedText = t("sites:pageDetail.seo.hasDescriptionAdjusted");
	const hasH1FirstAdjustedText = t("sites:pageDetail.seo.hasH1FirstAdjusted");
	const hasH1SecondAdjustedText = t("sites:pageDetail.seo.hasH1SecondAdjusted");
	const hasH2FirstAdjustedText = t("sites:pageDetail.seo.hasH1SecondAdjusted");
	const hasH2SecondAdjustedText = t("sites:pageDetail.seo.hasH2SecondAdjusted");
	const hasDuplicatedTitleAdjustedText = t("sites:pageDetail.seo.hasDuplicatedTitleAdjusted");
	const hasDuplicatedDescriptionAdjustedText = t("sites:pageDetail.seo.hasDuplicatedDescriptionAdjusted");
	const pageDataTitle = t("sites:pageDetail.seo.pageData.title");
	const pageDataDescription = t("sites:pageDetail.seo.pageData.description");
	const pageDataH1First = t("sites:pageDetail.seo.pageData.h1First");
	const pageDataH1Second = t("sites:pageDetail.seo.pageData.h1Second");
	const pageDataH2First = t("sites:pageDetail.seo.pageData.h2First");
	const pageDataH2Second = t("sites:pageDetail.seo.pageData.h2Second");
	const resolvedTlsText = t("sites:pageDetail.resolvedTls");
	const resolvedSizeText = t("sites:pageDetail.resolvedSize");
	const resolvedMissingTitleText = t("sites:pageDetail.resolvedMissingTitle");
	const resolvedMissingDescriptionText = t("sites:pageDetail.resolvedMissingDescription");
	const resolvedMissingH1FirstText = t("sites:pageDetail.resolvedMissingH1First");
	const resolvedMissingH1SecondText = t("sites:pageDetail.resolvedMissingH1Second");
	const resolvedMissingH2FirstText = t("sites:pageDetail.resolvedMissingH2First");
	const resolvedMissingH2SecondText = t("sites:pageDetail.resolvedMissingH2Second");
	const resolvedDuplicateTitleText = t("sites:pageDetail.resolvedDuplicateTitle");
	const resolvedDuplicateDescriptionText = t("sites:pageDetail.resolvedDuplicateDescription");

	// Custom context
	const { isComponentReady, pageId, user, querySiteId } = useContext(SiteCrawlerAppContext);

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

	// Custom variables
	const disableLocalTime = user?.data?.settings?.disableLocalTime ?? false;
	const createdAtTimestamp = pageId?.data?.created_at ?? null;
	const createdAt = createdAtTimestamp
		? !disableLocalTime
			? dayjs(createdAtTimestamp).calendar(null, calendarStrings)
			: dayjs.utc(createdAtTimestamp).calendar(null, calendarStrings)
		: null;
	const size = pageId?.data?.size ?? null;
	const convertedSize = bytes(size ?? 0, {
		thousandsSeparator: " ",
		unitSeparator: " "
	});
	const totalLinks = pageId?.data?.num_links ?? null;
	const totalOkLinks = pageId?.data?.num_ok_links ?? null;
	const totalNonOkLinks = pageId?.data?.num_non_ok_links ?? null;
	const totalImages = pageId?.data?.num_images ?? null;
	const totalOkImages = pageId?.data?.num_ok_images ?? null;
	const totalNonOkImages = pageId?.data?.num_non_ok_images ?? null;
	const totalScripts = pageId?.data?.num_scripts ?? null;
	const totalOkScripts = pageId?.data?.num_ok_scripts ?? null;
	const totalNonOkScripts = pageId?.data?.num_non_ok_scripts ?? null;
	const totalStylesheets = pageId?.data?.num_stylesheets ?? null;
	const totalOkStylesheets = pageId?.data?.num_ok_stylesheets ?? null;
	const totalNonOkStylesheets = pageId?.data?.num_non_ok_stylesheets ?? null;
	const totalSizeImages = pageId?.data?.size_images ?? null;
	const convertedTotalSizeImages = bytes(totalSizeImages ?? 0, {
		thousandsSeparator: " ",
		unitSeparator: " "
	});
	const totalSizeScripts = pageId?.data?.size_scripts ?? null;
	const convertedTotalSizeScripts = bytes(totalSizeScripts ?? 0, {
		thousandsSeparator: " ",
		unitSeparator: " "
	});
	const totalSizeStylesheets = pageId?.data?.size_stylesheets ?? null;
	const convertedTotalSizeStylesheets = bytes(totalSizeStylesheets ?? 0, {
		thousandsSeparator: " ",
		unitSeparator: " "
	});
	const totalSize = pageId?.data?.size_total ?? null;
	const convertedTotalSize = bytes(totalSize ?? 0, {
		thousandsSeparator: " ",
		unitSeparator: " "
	});
	const totalSizeAdjusted = pageId?.data?.size_total_adjusted ?? null;
	const convertedTotalSizeAdjusted = bytes(totalSizeAdjusted ?? 0, {
		thousandsSeparator: " ",
		unitSeparator: " "
	});
	const tlsStatus = pageId?.data?.tls_status ?? null;
	const totalTlsImages = pageId?.data?.num_tls_images ?? null;
	const totalNonTlsImages = pageId?.data?.num_non_tls_images ?? null;
	const totalTlsScripts = pageId?.data?.num_tls_scripts ?? null;
	const totalNonTlsScripts = pageId?.data?.num_non_tls_scripts ?? null;
	const totalTlsStylesheets = pageId?.data?.num_tls_stylesheets ?? null;
	const totalNonTlsStylesheets = pageId?.data?.num_non_tls_stylesheets ?? null;
	const tlsImages = pageId?.data?.tls_images ?? null;
	const tlsScripts = pageId?.data?.tls_scripts ?? null;
	const tlsStylesheets = pageId?.data?.tls_stylesheets ?? null;
	const tlsTotal = pageId?.data?.tls_total ?? null;
	const tlsTotalAdjusted = pageId?.data?.tls_total_adjusted ?? null;
	const hasTitleAdjusted = pageId?.data?.has_title_adjusted ?? null;
	const hasDescriptionAdjusted = pageId?.data?.has_description_adjusted ?? null;
	const hasH1FirstAdjusted = pageId?.data?.has_h1_first_adjusted ?? null;
	const hasH1SecondAdjusted = pageId?.data?.has_h1_second_adjusted ?? null;
	const hasH2FirstAdjusted = pageId?.data?.has_h2_first_adjusted ?? null;
	const hasH2SecondAdjusted = pageId?.data?.has_h2_second_adjusted ?? null;
	const hasDuplicatedTitleAdjusted = pageId?.data?.has_duplicated_title_adjusted ?? null;
	const hasDuplicatedDescriptionAdjusted = pageId?.data?.has_duplicated_description_adjusted ?? null;
	const titlePageData = pageId?.data?.pagedata?.title ?? null;
	const descriptionPageData = pageId?.data?.pagedata?.description ?? null;
	const h1FirstPageData = pageId?.data?.pagedata?.h1_first ?? null;
	const h1SecondPageData = pageId?.data?.pagedata?.h1_second ?? null;
	const h2FirstPageData = pageId?.data?.pagedata?.h2_first ?? null;
	const h2SecondPageData = pageId?.data?.pagedata?.h2_second ?? null;
	const tls = pageId?.data?.tls ?? null;
	const tlsNotBeforeTimestamp = tls ? tls.not_before : null;
	const tlsNotBefore = tlsNotBeforeTimestamp
		? !disableLocalTime
			? dayjs(tlsNotBeforeTimestamp).calendar(null, calendarStrings)
			: dayjs.utc(tlsNotBeforeTimestamp).calendar(null, calendarStrings)
		: null;
	const tlsNotAfterTimestamp = tls ? tls.not_after : null;
	const tlsNotAfter = tlsNotAfterTimestamp
		? !disableLocalTime
			? dayjs(tlsNotAfterTimestamp).calendar(null, calendarStrings)
			: dayjs.utc(tlsNotAfterTimestamp).calendar(null, calendarStrings)
		: null;
	const tlsCommonName = tls ? tls.common_name : null;
	const tlsOrganization = tls ? tls.organization : null;
	const tlsDnsNames = tls ? tls.dns_names : null;
	const tlsIssuerOrganization = tls ? tls.issuer_organization : null;
	const tlsIssuerCommonName = tls ? tls.issuer_cn : null;
	const tlsCipherSuite = tls ? tls.cipher_suite : null;
	const tlsVersion = tls ? tls.version : null;
	const tlsErrors = tls ? tls.errors : null;
	const resolvedTls = pageId?.data?.resolved_tls ?? null;
	const resolvedSize = pageId?.data?.resolved_size ?? null;
	const resolvedMissingTitle = pageId?.data?.resolved_missing_title ?? null;
	const resolvedMissingDescription = pageId?.data?.resolved_missing_description ?? null;
	const resolvedMissingH1First = pageId?.data?.resolved_missing_h1_first ?? null;
	const resolvedMissingH1Second = pageId?.data?.resolved_missing_h1_second ?? null;
	const resolvedMissingH2First = pageId?.data?.resolved_missing_h2_first ?? null;
	const resolvedMissingH2Second = pageId?.data?.resolved_missing_h2_second ?? null;
	const resolvedDuplicateTitle = pageId?.data?.resolved_duplicate_title ?? null;
	const resolvedDuplicateDescription = pageId?.data?.resolved_duplicate_description ?? null;

	return (
		<>
			<MemoizedPageOption isPages />

			<div className="flex flex-auto flex-grow flex-col items-center justify-center px-6 pt-8 focus:outline-none sm:px-6 md:px-0">
				<div className="h-full w-full flex-1 items-center justify-center overflow-y-hidden py-4 first-line:flex">
					<div className="pb-12">
						<div>
							<h3 className="text-xl font-bold leading-6 text-gray-900">{pageInformationText}</h3>
						</div>
						<div className="mt-5">
							<dl className="sm:divide-y sm:divide-gray-200">
								<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
									<dt className="text-sm font-medium text-gray-500">{createdAtText}</dt>
									{isComponentReady && createdAt ? (
										<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{createdAt}</dd>
									) : isComponentReady && !createdAt ? (
										<dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
											<span className="text-gray-500">{noneText}</span>
										</dd>
									) : (
										<dd className="mt-1 sm:col-span-2 sm:mt-0">
											<Skeleton duration={2} width={120} />
										</dd>
									)}
								</div>

								<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
									<dt className="text-sm font-medium text-gray-500">{sizeText}</dt>
									{isComponentReady && size ? (
										<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{convertedSize}</dd>
									) : isComponentReady && !size ? (
										<dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
											<span className="text-gray-500">{noneText}</span>
										</dd>
									) : (
										<dd className="mt-1 sm:col-span-2 sm:mt-0">
											<Skeleton duration={2} width={120} />
										</dd>
									)}
								</div>

								<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
									<dt className="text-sm font-medium text-gray-500">{totalLinksText}</dt>
									{isComponentReady && totalLinks ? (
										<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{totalLinks}</dd>
									) : isComponentReady && !totalLinks ? (
										<dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
											<span className="text-gray-500">{noneText}</span>
										</dd>
									) : (
										<dd className="mt-1 sm:col-span-2 sm:mt-0">
											<Skeleton duration={2} width={120} />
										</dd>
									)}
								</div>

								<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
									<dt className="text-sm font-medium text-gray-500">{totalOkLinksText}</dt>
									{isComponentReady && totalOkLinks ? (
										<dd className="mt-1 text-sm text-green-500 sm:col-span-2 sm:mt-0">{totalOkLinks}</dd>
									) : isComponentReady && !totalOkLinks ? (
										<dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
											<span className="text-gray-500">{noneText}</span>
										</dd>
									) : (
										<dd className="mt-1 sm:col-span-2 sm:mt-0">
											<Skeleton duration={2} width={120} />
										</dd>
									)}
								</div>

								<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
									<dt className="text-sm font-medium text-gray-500">{totalNonOkLinksText}</dt>
									{isComponentReady && totalNonOkLinks ? (
										<dd className="mt-1 text-sm text-red-500 sm:col-span-2 sm:mt-0">{totalNonOkLinks}</dd>
									) : isComponentReady && !totalNonOkLinks ? (
										<dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
											<span className="text-gray-500">{noneText}</span>
										</dd>
									) : (
										<dd className="mt-1 sm:col-span-2 sm:mt-0">
											<Skeleton duration={2} width={120} />
										</dd>
									)}
								</div>

								<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
									<dt className="text-sm font-medium text-gray-500">{totalImagesText}</dt>
									{isComponentReady && totalImages ? (
										<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{totalImages}</dd>
									) : isComponentReady && !totalImages ? (
										<dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
											<span className="text-gray-500">{noneText}</span>
										</dd>
									) : (
										<dd className="mt-1 sm:col-span-2 sm:mt-0">
											<Skeleton duration={2} width={120} />
										</dd>
									)}
								</div>

								<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
									<dt className="text-sm font-medium text-gray-500">{totalOkImagesText}</dt>
									{isComponentReady && totalOkImages ? (
										<dd className="mt-1 text-sm text-green-500 sm:col-span-2 sm:mt-0">{totalOkImages}</dd>
									) : isComponentReady && !totalOkImages ? (
										<dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
											<span className="text-gray-500">{noneText}</span>
										</dd>
									) : (
										<dd className="mt-1 sm:col-span-2 sm:mt-0">
											<Skeleton duration={2} width={120} />
										</dd>
									)}
								</div>

								<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
									<dt className="text-sm font-medium text-gray-500">{totalNonOkImagesText}</dt>
									{isComponentReady && totalNonOkImages ? (
										<dd className="mt-1 text-sm text-red-500 sm:col-span-2 sm:mt-0">{totalNonOkImages}</dd>
									) : isComponentReady && !totalNonOkImages ? (
										<dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
											<span className="text-gray-500">{noneText}</span>
										</dd>
									) : (
										<dd className="mt-1 sm:col-span-2 sm:mt-0">
											<Skeleton duration={2} width={120} />
										</dd>
									)}
								</div>

								<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
									<dt className="text-sm font-medium text-gray-500">{totalScriptsText}</dt>
									{isComponentReady && totalScripts ? (
										<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{totalScripts}</dd>
									) : isComponentReady && !totalScripts ? (
										<dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
											<span className="text-gray-500">{noneText}</span>
										</dd>
									) : (
										<dd className="mt-1 sm:col-span-2 sm:mt-0">
											<Skeleton duration={2} width={120} />
										</dd>
									)}
								</div>

								<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
									<dt className="text-sm font-medium text-gray-500">{totalOkScriptsText}</dt>
									{isComponentReady && totalOkScripts ? (
										<dd className="mt-1 text-sm text-green-500 sm:col-span-2 sm:mt-0">{totalOkScripts}</dd>
									) : isComponentReady && !totalOkScripts ? (
										<dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
											<span className="text-gray-500">{noneText}</span>
										</dd>
									) : (
										<dd className="mt-1 sm:col-span-2 sm:mt-0">
											<Skeleton duration={2} width={120} />
										</dd>
									)}
								</div>

								<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
									<dt className="text-sm font-medium text-gray-500">{totalNonOkScriptsText}</dt>
									{isComponentReady && totalNonOkScripts ? (
										<dd className="mt-1 text-sm text-red-500 sm:col-span-2 sm:mt-0">{totalNonOkScripts}</dd>
									) : isComponentReady && !totalNonOkScripts ? (
										<dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
											<span className="text-gray-500">{noneText}</span>
										</dd>
									) : (
										<dd className="mt-1 sm:col-span-2 sm:mt-0">
											<Skeleton duration={2} width={120} />
										</dd>
									)}
								</div>

								<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
									<dt className="text-sm font-medium text-gray-500">{totalStylesheetsText}</dt>
									{isComponentReady && totalStylesheets ? (
										<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{totalStylesheets}</dd>
									) : isComponentReady && !totalStylesheets ? (
										<dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
											<span className="text-gray-500">{noneText}</span>
										</dd>
									) : (
										<dd className="mt-1 sm:col-span-2 sm:mt-0">
											<Skeleton duration={2} width={120} />
										</dd>
									)}
								</div>

								<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
									<dt className="text-sm font-medium text-gray-500">{totalOkStylesheetsText}</dt>
									{isComponentReady && totalOkStylesheets ? (
										<dd className="mt-1 text-sm text-green-500 sm:col-span-2 sm:mt-0">{totalOkStylesheets}</dd>
									) : isComponentReady && !totalOkStylesheets ? (
										<dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
											<span className="text-gray-500">{noneText}</span>
										</dd>
									) : (
										<dd className="mt-1 sm:col-span-2 sm:mt-0">
											<Skeleton duration={2} width={120} />
										</dd>
									)}
								</div>

								<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
									<dt className="text-sm font-medium text-gray-500">{totalNonOkStylesheetsText}</dt>
									{isComponentReady && totalNonOkStylesheets ? (
										<dd className="mt-1 text-sm text-red-500 sm:col-span-2 sm:mt-0">{totalNonOkStylesheets}</dd>
									) : isComponentReady && !totalNonOkStylesheets ? (
										<dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
											<span className="text-gray-500">{noneText}</span>
										</dd>
									) : (
										<dd className="mt-1 sm:col-span-2 sm:mt-0">
											<Skeleton duration={2} width={120} />
										</dd>
									)}
								</div>

								<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
									<dt className="text-sm font-medium text-gray-500">{totalSizeImagesText}</dt>
									{isComponentReady && convertedSize ? (
										<dd className="mt-1 text-sm  text-gray-900 sm:col-span-2 sm:mt-0">{convertedSize}</dd>
									) : isComponentReady && !convertedSize ? (
										<dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
											<span className="text-gray-500">{noneText}</span>
										</dd>
									) : (
										<dd className="mt-1 sm:col-span-2 sm:mt-0">
											<Skeleton duration={2} width={120} />
										</dd>
									)}
								</div>

								<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
									<dt className="text-sm font-medium text-gray-500">{totalSizeScriptsText}</dt>
									{isComponentReady && convertedTotalSizeScripts ? (
										<dd className="mt-1 text-sm  text-gray-900 sm:col-span-2 sm:mt-0">{convertedTotalSizeScripts}</dd>
									) : isComponentReady && !convertedTotalSizeScripts ? (
										<dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
											<span className="text-gray-500">{noneText}</span>
										</dd>
									) : (
										<dd className="mt-1 sm:col-span-2 sm:mt-0">
											<Skeleton duration={2} width={120} />
										</dd>
									)}
								</div>

								<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
									<dt className="text-sm font-medium text-gray-500">{totalSizeStylesheetsText}</dt>
									{isComponentReady && convertedTotalSizeStylesheets ? (
										<dd className="mt-1 text-sm  text-gray-900 sm:col-span-2 sm:mt-0">
											{convertedTotalSizeStylesheets}
										</dd>
									) : isComponentReady && !convertedTotalSizeStylesheets ? (
										<dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
											<span className="text-gray-500">{noneText}</span>
										</dd>
									) : (
										<dd className="mt-1 sm:col-span-2 sm:mt-0">
											<Skeleton duration={2} width={120} />
										</dd>
									)}
								</div>

								<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
									<dt className="text-sm font-medium text-gray-500">{totalSizeText}</dt>
									{isComponentReady && convertedTotalSize ? (
										<dd className="mt-1 text-sm  text-gray-900 sm:col-span-2 sm:mt-0">{convertedTotalSize}</dd>
									) : isComponentReady && !convertedTotalSize ? (
										<dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
											<span className="text-gray-500">{noneText}</span>
										</dd>
									) : (
										<dd className="mt-1 sm:col-span-2 sm:mt-0">
											<Skeleton duration={2} width={120} />
										</dd>
									)}
								</div>

								<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
									<dt className="text-sm font-medium text-gray-500">{totalSizeAdjustedText}</dt>
									{isComponentReady && convertedTotalSizeAdjusted ? (
										<dd className="mt-1 text-sm  text-gray-900 sm:col-span-2 sm:mt-0">{convertedTotalSizeAdjusted}</dd>
									) : isComponentReady && !convertedTotalSizeAdjusted ? (
										<dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
											<span className="text-gray-500">{noneText}</span>
										</dd>
									) : (
										<dd className="mt-1 sm:col-span-2 sm:mt-0">
											<Skeleton duration={2} width={120} />
										</dd>
									)}
								</div>

								<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
									<dt className="text-sm font-medium text-gray-500">{tlsStatusText}</dt>
									{isComponentReady && tlsStatus ? (
										<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
											{tlsStatus === "OK" ? (
												<MemoizedBadge text="OK" isSuccess />
											) : tlsStatus === "TIMEOUT" ? (
												<MemoizedBadge text="TIMEOUT" isWarning />
											) : tlsStatus === "HTTP_ERROR" ? (
												<MemoizedBadge text="HTTP ERROR" isDanger />
											) : (
												<MemoizedBadge text="OTHER ERROR" isDanger />
											)}
										</dd>
									) : isComponentReady && !tlsStatus ? (
										<dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
											<span className="text-gray-500">{noneText}</span>
										</dd>
									) : (
										<dd className="mt-1 sm:col-span-2 sm:mt-0">
											<Skeleton duration={2} width={120} />
										</dd>
									)}
								</div>

								<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
									<dt className="text-sm font-medium text-gray-500">{totalTlsImagesText}</dt>
									{isComponentReady && totalTlsImages ? (
										<dd
											className={classnames(
												"mt-1 text-sm sm:col-span-2 sm:mt-0",
												totalTlsImages > 0 ? "text-green-500" : "text-red-500"
											)}
										>
											{totalTlsImages}
										</dd>
									) : isComponentReady && !totalTlsImages ? (
										<dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
											<span className="text-gray-500">{noneText}</span>
										</dd>
									) : (
										<dd className="mt-1 sm:col-span-2 sm:mt-0">
											<Skeleton duration={2} width={120} />
										</dd>
									)}
								</div>

								<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
									<dt className="text-sm font-medium text-gray-500">{totalNonTlsImagesText}</dt>
									{isComponentReady && totalNonTlsImages ? (
										<dd
											className={classnames(
												"mt-1 text-sm sm:col-span-2 sm:mt-0",
												totalNonTlsImages > 0 ? "text-red-500" : "text-green-500"
											)}
										>
											{totalNonTlsImages}
										</dd>
									) : isComponentReady && !totalNonTlsImages ? (
										<dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
											<span className="text-gray-500">{noneText}</span>
										</dd>
									) : (
										<dd className="mt-1 sm:col-span-2 sm:mt-0">
											<Skeleton duration={2} width={120} />
										</dd>
									)}
								</div>

								<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
									<dt className="text-sm font-medium text-gray-500">{totalTlsScriptsText}</dt>
									{isComponentReady && totalTlsScripts ? (
										<dd
											className={classnames(
												"mt-1 text-sm sm:col-span-2 sm:mt-0",
												totalTlsScripts > 0 ? "text-green-500" : "text-red-500"
											)}
										>
											{totalTlsScripts}
										</dd>
									) : isComponentReady && !totalTlsScripts ? (
										<dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
											<span className="text-gray-500">{noneText}</span>
										</dd>
									) : (
										<dd className="mt-1 sm:col-span-2 sm:mt-0">
											<Skeleton duration={2} width={120} />
										</dd>
									)}
								</div>

								<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
									<dt className="text-sm font-medium text-gray-500">{totalNonTlsScriptsText}</dt>
									{isComponentReady && totalNonTlsScripts ? (
										<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
											<MemoizedSiteSuccessIcon />
										</dd>
									) : isComponentReady && !totalNonTlsScripts ? (
										<dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
											<span className="text-gray-500">{noneText}</span>
										</dd>
									) : (
										<dd className="mt-1 sm:col-span-2 sm:mt-0">
											<Skeleton duration={2} width={120} />
										</dd>
									)}
								</div>

								<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
									<dt className="text-sm font-medium text-gray-500">{totalTlsStylesheetsText}</dt>
									{isComponentReady && totalTlsStylesheets ? (
										<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{totalTlsStylesheets}</dd>
									) : isComponentReady && !totalTlsStylesheets ? (
										<dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
											<span className="text-gray-500">{noneText}</span>
										</dd>
									) : (
										<dd className="mt-1 sm:col-span-2 sm:mt-0">
											<Skeleton duration={2} width={120} />
										</dd>
									)}
								</div>

								<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
									<dt className="text-sm font-medium text-gray-500">{totalNonTlsStylesheetsText}</dt>
									{isComponentReady && totalNonTlsStylesheets ? (
										<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{totalNonTlsStylesheets}</dd>
									) : isComponentReady && !totalNonTlsStylesheets ? (
										<dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
											<span className="text-gray-500">{noneText}</span>
										</dd>
									) : (
										<dd className="mt-1 sm:col-span-2 sm:mt-0">
											<Skeleton duration={2} width={120} />
										</dd>
									)}
								</div>

								<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
									<dt className="text-sm font-medium text-gray-500">{tlsImagesText}</dt>
									{isComponentReady && tlsImages ? (
										<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
											<MemoizedSiteSuccessIcon />
										</dd>
									) : isComponentReady && !tlsImages ? (
										<dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
											<span className="text-gray-500">{noneText}</span>
										</dd>
									) : (
										<dd className="mt-1 sm:col-span-2 sm:mt-0">
											<Skeleton duration={2} width={120} />
										</dd>
									)}
								</div>

								<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
									<dt className="text-sm font-medium text-gray-500">{tlsScriptsText}</dt>
									{isComponentReady && tlsScripts ? (
										<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
											<MemoizedSiteSuccessIcon />
										</dd>
									) : isComponentReady && !tlsScripts ? (
										<dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
											<span className="text-gray-500">{noneText}</span>
										</dd>
									) : (
										<dd className="mt-1 sm:col-span-2 sm:mt-0">
											<Skeleton duration={2} width={120} />
										</dd>
									)}
								</div>

								<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
									<dt className="text-sm font-medium text-gray-500">{tlsStylesheetsText}</dt>
									{isComponentReady && tlsStylesheets ? (
										<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
											<MemoizedSiteSuccessIcon />
										</dd>
									) : isComponentReady && !tlsStylesheets ? (
										<dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
											<span className="text-gray-500">{noneText}</span>
										</dd>
									) : (
										<dd className="mt-1 sm:col-span-2 sm:mt-0">
											<Skeleton duration={2} width={120} />
										</dd>
									)}
								</div>

								<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
									<dt className="text-sm font-medium text-gray-500">{tlsTotalText}</dt>
									{isComponentReady && tlsTotal ? (
										<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
											<MemoizedSiteSuccessIcon />
										</dd>
									) : isComponentReady && !tlsTotal ? (
										<dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
											<span className="text-gray-500">{noneText}</span>
										</dd>
									) : (
										<dd className="mt-1 sm:col-span-2 sm:mt-0">
											<Skeleton duration={2} width={120} />
										</dd>
									)}
								</div>

								<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
									<dt className="text-sm font-medium text-gray-500">{tlsTotalAdjustedText}</dt>
									{isComponentReady && tlsTotalAdjusted ? (
										<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
											<MemoizedSiteSuccessIcon />
										</dd>
									) : isComponentReady && !tlsTotalAdjusted ? (
										<dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
											<span className="text-gray-500">{noneText}</span>
										</dd>
									) : (
										<dd className="mt-1 sm:col-span-2 sm:mt-0">
											<Skeleton duration={2} width={120} />
										</dd>
									)}
								</div>
							</dl>
						</div>
					</div>

					<div className="flex flex-auto flex-grow flex-col items-center justify-center px-6 pt-8 focus:outline-none sm:px-6 md:px-0">
						<div className="h-full w-full flex-1 items-center justify-center overflow-y-hidden py-4 first-line:flex">
							<div className="pb-12">
								<div>
									<h3 className="text-xl font-bold leading-6 text-gray-900">{seoInformationText}</h3>
								</div>
								<div className="mt-5">
									<dl className="sm:divide-y sm:divide-gray-200">
										<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
											<dt className="text-sm font-medium text-gray-500">{hasTitleAdjustedText}</dt>
											{isComponentReady && hasTitleAdjusted ? (
												<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
													<MemoizedSiteSuccessIcon />
												</dd>
											) : isComponentReady && !hasTitleAdjusted ? (
												<dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
													<span className="text-gray-500">{noneText}</span>
												</dd>
											) : (
												<dd className="mt-1 sm:col-span-2 sm:mt-0">
													<Skeleton duration={2} width={120} />
												</dd>
											)}
										</div>

										<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
											<dt className="text-sm font-medium text-gray-500">{hasDescriptionAdjustedText}</dt>
											{isComponentReady && hasDescriptionAdjusted ? (
												<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
													<MemoizedSiteSuccessIcon />
												</dd>
											) : isComponentReady && !hasDescriptionAdjusted ? (
												<dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
													<span className="text-gray-500">{noneText}</span>
												</dd>
											) : (
												<dd className="mt-1 sm:col-span-2 sm:mt-0">
													<Skeleton duration={2} width={120} />
												</dd>
											)}
										</div>

										<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
											<dt className="text-sm font-medium text-gray-500">{hasH1FirstAdjustedText}</dt>
											{isComponentReady && hasH1FirstAdjusted ? (
												<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
													<MemoizedSiteSuccessIcon />
												</dd>
											) : isComponentReady && !hasH1FirstAdjusted ? (
												<dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
													<span className="text-gray-500">{noneText}</span>
												</dd>
											) : (
												<dd className="mt-1 sm:col-span-2 sm:mt-0">
													<Skeleton duration={2} width={120} />
												</dd>
											)}
										</div>

										<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
											<dt className="text-sm font-medium text-gray-500">{hasH1SecondAdjustedText}</dt>
											{isComponentReady && hasH1SecondAdjusted ? (
												<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
													<MemoizedSiteSuccessIcon />
												</dd>
											) : isComponentReady && !hasH1SecondAdjusted ? (
												<dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
													<span className="text-gray-500">{noneText}</span>
												</dd>
											) : (
												<dd className="mt-1 sm:col-span-2 sm:mt-0">
													<Skeleton duration={2} width={120} />
												</dd>
											)}
										</div>

										<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
											<dt className="text-sm font-medium text-gray-500">{hasH2FirstAdjustedText}</dt>
											{isComponentReady && hasH2FirstAdjusted ? (
												<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
													<MemoizedSiteSuccessIcon />
												</dd>
											) : isComponentReady && !hasH2FirstAdjusted ? (
												<dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
													<span className="text-gray-500">{noneText}</span>
												</dd>
											) : (
												<dd className="mt-1 sm:col-span-2 sm:mt-0">
													<Skeleton duration={2} width={120} />
												</dd>
											)}
										</div>

										<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
											<dt className="text-sm font-medium text-gray-500">{hasH2SecondAdjustedText}</dt>
											{isComponentReady && hasH2SecondAdjusted ? (
												<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
													<MemoizedSiteSuccessIcon />
												</dd>
											) : isComponentReady && !hasH2SecondAdjusted ? (
												<dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
													<span className="text-gray-500">{noneText}</span>
												</dd>
											) : (
												<dd className="mt-1 sm:col-span-2 sm:mt-0">
													<Skeleton duration={2} width={120} />
												</dd>
											)}
										</div>

										<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
											<dt className="text-sm font-medium text-gray-500">{hasDuplicatedTitleAdjustedText}</dt>
											{isComponentReady && hasDuplicatedTitleAdjusted ? (
												<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
													<MemoizedSiteSuccessIcon />
												</dd>
											) : isComponentReady && !hasDuplicatedTitleAdjusted ? (
												<dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
													<span className="text-gray-500">{noneText}</span>
												</dd>
											) : (
												<dd className="mt-1 sm:col-span-2 sm:mt-0">
													<Skeleton duration={2} width={120} />
												</dd>
											)}
										</div>

										<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
											<dt className="text-sm font-medium text-gray-500">{hasDuplicatedDescriptionAdjustedText}</dt>
											{isComponentReady && hasDuplicatedDescriptionAdjusted ? (
												<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
													<MemoizedSiteSuccessIcon />
												</dd>
											) : isComponentReady && !hasDuplicatedDescriptionAdjusted ? (
												<dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
													<span className="text-gray-500">{noneText}</span>
												</dd>
											) : (
												<dd className="mt-1 sm:col-span-2 sm:mt-0">
													<Skeleton duration={2} width={120} />
												</dd>
											)}
										</div>
									</dl>
								</div>
							</div>
						</div>
					</div>

					<div className="pb-12">
						<div>
							<h3 className="text-xl font-bold leading-6 text-gray-900">{tlsInformationText}</h3>
						</div>
						<div className="mt-5">
							<dl className="sm:divide-y sm:divide-gray-200">
								<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
									<dt className="text-sm font-medium text-gray-500">{tlsNotBeforeText}</dt>
									{isComponentReady && tlsNotBefore ? (
										<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{tlsNotBefore}</dd>
									) : isComponentReady && !tlsNotBefore ? (
										<dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
											<span className="text-gray-500">{noneText}</span>
										</dd>
									) : (
										<dd className="mt-1 sm:col-span-2 sm:mt-0">
											<Skeleton duration={2} width={120} />
										</dd>
									)}
								</div>

								<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
									<dt className="text-sm font-medium text-gray-500">{tlsNotAfterText}</dt>
									{isComponentReady && tlsNotAfter ? (
										<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{tlsNotAfter}</dd>
									) : isComponentReady && !tlsNotAfter ? (
										<dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
											<span className="text-gray-500">{noneText}</span>
										</dd>
									) : (
										<dd className="mt-1 sm:col-span-2 sm:mt-0">
											<Skeleton duration={2} width={120} />
										</dd>
									)}
								</div>

								<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
									<dt className="text-sm font-medium text-gray-500">{tlsCommonNameText}</dt>
									{isComponentReady && tlsCommonName ? (
										<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{tlsCommonName}</dd>
									) : isComponentReady && !tlsCommonName ? (
										<dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
											<span className="text-gray-500">{noneText}</span>
										</dd>
									) : (
										<dd className="mt-1 sm:col-span-2 sm:mt-0">
											<Skeleton duration={2} width={120} />
										</dd>
									)}
								</div>

								<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
									<dt className="text-sm font-medium text-gray-500">{tlsOrganizationText}</dt>
									{isComponentReady && tlsOrganization ? (
										<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{tlsOrganization}</dd>
									) : isComponentReady && !tlsOrganization ? (
										<dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
											<span className="text-gray-500">{noneText}</span>
										</dd>
									) : (
										<dd className="mt-1 sm:col-span-2 sm:mt-0">
											<Skeleton duration={2} width={120} />
										</dd>
									)}
								</div>

								<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
									<dt className="text-sm font-medium text-gray-500">{tlsDnsNamesText}</dt>
									{isComponentReady && tlsDnsNames?.length > 0 ? (
										<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
											{tlsDnsNames.map((name) => (
												<span key={name} className="my-2 block text-gray-900">
													{name}
												</span>
											))}
										</dd>
									) : isComponentReady && !tlsDnsNames ? (
										<dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
											<span className="text-gray-500">{noneText}</span>
										</dd>
									) : (
										<dd className="mt-1 sm:col-span-2 sm:mt-0">
											<Skeleton duration={2} width={120} />
										</dd>
									)}
								</div>

								<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
									<dt className="text-sm font-medium text-gray-500">{tlsIssuerOrganizationText}</dt>
									{isComponentReady && tlsIssuerOrganization ? (
										<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{tlsIssuerOrganization}</dd>
									) : isComponentReady && !tlsIssuerOrganization ? (
										<dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
											<span className="text-gray-500">{noneText}</span>
										</dd>
									) : (
										<dd className="mt-1 sm:col-span-2 sm:mt-0">
											<Skeleton duration={2} width={120} />
										</dd>
									)}
								</div>

								<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
									<dt className="text-sm font-medium text-gray-500">{tlsIssuerCommonNameText}</dt>
									{isComponentReady && tlsIssuerCommonName ? (
										<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{tlsIssuerCommonName}</dd>
									) : isComponentReady && !tlsIssuerCommonName ? (
										<dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
											<span className="text-gray-500">{noneText}</span>
										</dd>
									) : (
										<dd className="mt-1 sm:col-span-2 sm:mt-0">
											<Skeleton duration={2} width={120} />
										</dd>
									)}
								</div>

								<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
									<dt className="text-sm font-medium text-gray-500">{tlsCipherSuiteText}</dt>
									{isComponentReady && tlsCipherSuite ? (
										<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{tlsCipherSuite}</dd>
									) : isComponentReady && !tlsCipherSuite ? (
										<dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
											<span className="text-gray-500">{noneText}</span>
										</dd>
									) : (
										<dd className="mt-1 sm:col-span-2 sm:mt-0">
											<Skeleton duration={2} width={120} />
										</dd>
									)}
								</div>

								<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
									<dt className="text-sm font-medium text-gray-500">{tlsVersionText}</dt>
									{isComponentReady && tlsVersion ? (
										<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{tlsVersion}</dd>
									) : isComponentReady && !tlsVersion ? (
										<dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
											<span className="text-gray-500">{noneText}</span>
										</dd>
									) : (
										<dd className="mt-1 sm:col-span-2 sm:mt-0">
											<Skeleton duration={2} width={120} />
										</dd>
									)}
								</div>

								<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
									<dt className="text-sm font-medium text-gray-500">{tlsErrorsText}</dt>
									{isComponentReady && tlsErrors ? (
										<dd className="mt-1 text-sm text-red-500 sm:col-span-2 sm:mt-0">{tlsErrors}</dd>
									) : isComponentReady && !tlsErrors ? (
										<dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
											<span className="text-gray-500">{noneText}</span>
										</dd>
									) : (
										<dd className="mt-1 sm:col-span-2 sm:mt-0">
											<Skeleton duration={2} width={120} />
										</dd>
									)}
								</div>
							</dl>
						</div>
					</div>

					<div className="pb-12">
						<div>
							<h3 className="text-xl font-bold leading-6 text-gray-900">{resolvedIssuesText}</h3>
						</div>
						<div className="mt-5">
							<dl className="sm:divide-y sm:divide-gray-200">
								<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
									<dt className="text-sm font-medium text-gray-500">{resolvedTlsText}</dt>
									{isComponentReady && resolvedTls ? (
										<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
											<MemoizedSiteSuccessIcon />
										</dd>
									) : isComponentReady && !resolvedTls ? (
										<dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
											<span className="text-gray-500">{noneText}</span>
										</dd>
									) : (
										<dd className="mt-1 sm:col-span-2 sm:mt-0">
											<Skeleton duration={2} width={120} />
										</dd>
									)}
								</div>

								<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
									<dt className="text-sm font-medium text-gray-500">{resolvedSizeText}</dt>
									{isComponentReady && resolvedSize ? (
										<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
											<MemoizedSiteSuccessIcon />
										</dd>
									) : isComponentReady && !resolvedSize ? (
										<dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
											<span className="text-gray-500">{noneText}</span>
										</dd>
									) : (
										<dd className="mt-1 sm:col-span-2 sm:mt-0">
											<Skeleton duration={2} width={120} />
										</dd>
									)}
								</div>

								<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
									<dt className="text-sm font-medium text-gray-500">{resolvedMissingTitleText}</dt>
									{isComponentReady && resolvedMissingTitle ? (
										<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
											<MemoizedSiteSuccessIcon />
										</dd>
									) : isComponentReady && !resolvedMissingTitle ? (
										<dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
											<span className="text-gray-500">{noneText}</span>
										</dd>
									) : (
										<dd className="mt-1 sm:col-span-2 sm:mt-0">
											<Skeleton duration={2} width={120} />
										</dd>
									)}
								</div>

								<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
									<dt className="text-sm font-medium text-gray-500">{resolvedMissingDescriptionText}</dt>
									{isComponentReady && resolvedMissingDescription ? (
										<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
											<MemoizedSiteSuccessIcon />
										</dd>
									) : isComponentReady && !resolvedMissingDescription ? (
										<dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
											<span className="text-gray-500">{noneText}</span>
										</dd>
									) : (
										<dd className="mt-1 sm:col-span-2 sm:mt-0">
											<Skeleton duration={2} width={120} />
										</dd>
									)}
								</div>

								<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
									<dt className="text-sm font-medium text-gray-500">{resolvedMissingH1FirstText}</dt>
									{isComponentReady && resolvedMissingH1First ? (
										<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
											<MemoizedSiteSuccessIcon />
										</dd>
									) : isComponentReady && !resolvedMissingH1First ? (
										<dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
											<span className="text-gray-500">{noneText}</span>
										</dd>
									) : (
										<dd className="mt-1 sm:col-span-2 sm:mt-0">
											<Skeleton duration={2} width={120} />
										</dd>
									)}
								</div>

								<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
									<dt className="text-sm font-medium text-gray-500">{resolvedMissingH1SecondText}</dt>
									{isComponentReady && resolvedMissingH1Second ? (
										<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
											<MemoizedSiteSuccessIcon />
										</dd>
									) : isComponentReady && !resolvedMissingH1Second ? (
										<dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
											<span className="text-gray-500">{noneText}</span>
										</dd>
									) : (
										<dd className="mt-1 sm:col-span-2 sm:mt-0">
											<Skeleton duration={2} width={120} />
										</dd>
									)}
								</div>

								<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
									<dt className="text-sm font-medium text-gray-500">{resolvedMissingH2FirstText}</dt>
									{isComponentReady && resolvedMissingH2First ? (
										<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
											<MemoizedSiteSuccessIcon />
										</dd>
									) : isComponentReady && !resolvedMissingH2First ? (
										<dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
											<span className="text-gray-500">{noneText}</span>
										</dd>
									) : (
										<dd className="mt-1 sm:col-span-2 sm:mt-0">
											<Skeleton duration={2} width={120} />
										</dd>
									)}
								</div>

								<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
									<dt className="text-sm font-medium text-gray-500">{resolvedMissingH2SecondText}</dt>
									{isComponentReady && resolvedMissingH2Second ? (
										<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
											<MemoizedSiteSuccessIcon />
										</dd>
									) : isComponentReady && !resolvedMissingH2Second ? (
										<dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
											<span className="text-gray-500">{noneText}</span>
										</dd>
									) : (
										<dd className="mt-1 sm:col-span-2 sm:mt-0">
											<Skeleton duration={2} width={120} />
										</dd>
									)}
								</div>

								<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
									<dt className="text-sm font-medium text-gray-500">{resolvedDuplicateTitleText}</dt>
									{isComponentReady && resolvedDuplicateTitle ? (
										<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
											<MemoizedSiteSuccessIcon />
										</dd>
									) : isComponentReady && !resolvedDuplicateTitle ? (
										<dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
											<span className="text-gray-500">{noneText}</span>
										</dd>
									) : (
										<dd className="mt-1 sm:col-span-2 sm:mt-0">
											<Skeleton duration={2} width={120} />
										</dd>
									)}
								</div>

								<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
									<dt className="text-sm font-medium text-gray-500">{resolvedDuplicateDescriptionText}</dt>
									{isComponentReady && resolvedDuplicateDescription ? (
										<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
											<MemoizedSiteSuccessIcon />
										</dd>
									) : isComponentReady && !resolvedDuplicateDescription ? (
										<dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
											<span className="text-gray-500">{noneText}</span>
										</dd>
									) : (
										<dd className="mt-1 sm:col-span-2 sm:mt-0">
											<Skeleton duration={2} width={120} />
										</dd>
									)}
								</div>
							</dl>
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

/**
 * Memoized custom `SitePageDetailPageLayout` component
 */
export const MemoizedSitePageDetailPageLayout = memo(SitePageDetailPageLayout);
