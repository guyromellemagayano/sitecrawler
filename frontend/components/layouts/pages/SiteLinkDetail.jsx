import { MemoizedBadge } from "@components/badges";
import { MemoizedSiteSuccessIcon } from "@components/icons/SiteSuccessIcon";
import { MemoizedPageOption } from "@components/options/PageOption";
import { DashboardSitesLink, SitePagesSlug } from "@constants/PageLinks";
import { DocumentTextIcon } from "@heroicons/react/outline";
import { SiteCrawlerAppContext } from "@pages/_app";
import bytes from "bytes";
import dayjs from "dayjs";
import useTranslation from "next-translate/useTranslation";
import Link from "next/link";
import { memo, useContext } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

/**
 * Custom function to render the `SiteLinkDetailPageLayout` component
 */
const SiteLinkDetailPageLayout = () => {
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
	const linkInformationText = t("sites:linkDetail.linkInformation");
	const occurrencesText = t("sites:linkDetail.occurrences");
	const typeText = t("sites:linkDetail.type");
	const urlText = t("sites:linkDetail.url");
	const statusText = t("sites:linkDetail.status");
	const statusAdjustedText = t("sites:linkDetail.statusAdjusted");
	const httpStatusText = t("sites:linkDetail.httpStatus");
	const responseTimeText = t("sites:linkDetail.responseTime");
	const errorText = t("sites:linkDetail.error");
	const sizeText = t("sites:linkDetail.size");
	const tlsStatusText = t("sites:linkDetail.tlsStatus");
	const tlsStatusAdjustedText = t("sites:linkDetail.tlsStatusAdjusted");
	const resolvedStatusText = t("sites:linkDetail.resolvedStatus");
	const resolvedTlsText = t("sites:linkDetail.resolvedTls");
	const pageLocationsText = t("sites:linkDetail.pageLocations");
	const visitExternalSiteText = t("sites:visitExternalSite");
	const goToSiteOverviewText = t("sites:goToSiteOverview");

	// Custom context
	const { isComponentReady, linkId, user, querySiteId } = useContext(SiteCrawlerAppContext);

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
	const createdAtTimestamp = linkId?.data?.created_at ?? null;
	const createdAt = createdAtTimestamp
		? !disableLocalTime
			? dayjs(createdAtTimestamp).calendar(null, calendarStrings)
			: dayjs.utc(createdAtTimestamp).calendar(null, calendarStrings)
		: null;
	const type = linkId?.data?.type ?? null;
	const status = linkId?.data?.status ?? null;
	const statusAdjusted = linkId?.data?.status_adjusted ?? null;
	const httpStatus = linkId?.data?.http_status ?? null;
	const responseTime = linkId?.data?.response_time ?? null;
	const error = linkId?.data?.error ?? null;
	const size = linkId?.data?.size ?? null;
	const convertedSize = bytes(size ?? 0, {
		thousandsSeparator: " ",
		unitSeparator: " "
	});
	const tlsStatus = linkId?.data?.tls_status ?? null;
	const tlsStatusAdjusted = linkId?.data?.tls_status_adjusted ?? null;
	const resolvedStatus = linkId?.data?.resolved_status ?? null;
	const resolvedTls = linkId?.data?.resolved_tls ?? null;
	const tls = linkId?.data?.tls ?? null;
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
	const occurrences = linkId?.data?.pages?.length ?? 0;
	const pages = linkId?.data?.pages ?? null;

	return (
		<>
			<MemoizedPageOption isLinks />

			<div className="flex flex-auto flex-grow flex-col items-center justify-center px-6 pt-8 focus:outline-none sm:px-6 md:px-0">
				<div className="h-full w-full flex-1 items-center justify-center overflow-y-hidden py-4 first-line:flex">
					<div className="pb-12">
						<div>
							<h3 className="text-xl font-bold leading-6 text-gray-900">{linkInformationText}</h3>
						</div>
						<div className="mt-5">
							<dl className="sm:divide-y sm:divide-gray-200">
								<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
									<dt className="text-sm font-medium text-gray-500">{createdAtText}</dt>
									{isComponentReady && createdAt ? (
										<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{createdAt}</dd>
									) : isComponentReady && !createdAt ? (
										<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
											<span className="text-gray-500">{noneText}</span>
										</dd>
									) : (
										<dd className="mt-1 sm:col-span-2 sm:mt-0">
											<Skeleton duration={2} width={120} />
										</dd>
									)}
								</div>

								<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
									<dt className="text-sm font-medium text-gray-500">{typeText}</dt>
									{isComponentReady && type ? (
										<dd className="mt-1 text-sm font-semibold text-gray-900 sm:col-span-2 sm:mt-0">{type}</dd>
									) : isComponentReady && !type ? (
										<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
											<span className="text-gray-500">{noneText}</span>
										</dd>
									) : (
										<dd className="mt-1 sm:col-span-2 sm:mt-0">
											<Skeleton duration={2} width={120} />
										</dd>
									)}
								</div>

								<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
									<dt className="text-sm font-medium text-gray-500">{statusText}</dt>
									{isComponentReady && status ? (
										<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
											{status === "OK" ? (
												<MemoizedBadge text="OK" isSuccess />
											) : status === "TIMEOUT" ? (
												<MemoizedBadge text="TIMEOUT" isWarning />
											) : status === "HTTP_ERROR" ? (
												<MemoizedBadge text="HTTP ERROR" isDanger />
											) : (
												<MemoizedBadge text="OTHER ERROR" isDanger />
											)}
										</dd>
									) : isComponentReady && !status ? (
										<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
											<span className="text-gray-500">{noneText}</span>
										</dd>
									) : (
										<dd className="mt-1 sm:col-span-2 sm:mt-0">
											<Skeleton duration={2} width={120} />
										</dd>
									)}
								</div>

								{statusAdjusted === "HTTP_ERROR" ? (
									<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
										<dt className="text-sm font-medium text-gray-500">{statusAdjustedText}</dt>
										{isComponentReady && statusAdjusted ? (
											<dd className="text-l-span-2 mt-1 text-sm sm:mt-0">
												{statusAdjusted === "OK" ? (
													<MemoizedBadge text="OK" isSuccess />
												) : statusAdjusted === "TIMEOUT" ? (
													<MemoizedBadge text="TIMEOUT" isWarning />
												) : statusAdjusted === "HTTP_ERROR" ? (
													<MemoizedBadge text="HTTP ERROR" isDanger />
												) : (
													<MemoizedBadge text="OTHER ERROR" isDanger />
												)}
											</dd>
										) : isComponentReady && !statusAdjusted ? (
											<dd className="text-grayan-2 mt-1 text-sm sm:mt-0">
												<span className="text-gray-500">{noneText}</span>
											</dd>
										) : (
											<dd className="mt-1 sm:col-span-2 sm:mt-0">
												<Skeleton duration={2} width={120} />
											</dd>
										)}
									</div>
								) : null}

								<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
									<dt className="text-sm font-medium text-gray-500">{httpStatusText}</dt>
									{isComponentReady && httpStatus ? (
										<dd className="mt-1 text-sm font-semibold text-gray-900 sm:col-span-2 sm:mt-0">
											{Math.round(httpStatus / 100) === 2 ? (
												<span className="text-green-500">{httpStatus}</span>
											) : Math.round(httpStatus / 100) === 4 || Math.round(httpStatus / 100) === 5 ? (
												<span className="text-red-500">{httpStatus}</span>
											) : Math.round(httpStatus / 100) === 3 ? (
												<span className="text-yellow-500">{httpStatus}</span>
											) : (
												<span className="text-gray-500">{httpStatus}</span>
											)}
										</dd>
									) : isComponentReady && !httpStatus ? (
										<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
											<span className="text-gray-500">{noneText}</span>
										</dd>
									) : (
										<dd className="mt-1 sm:col-span-2 sm:mt-0">
											<Skeleton duration={2} width={120} />
										</dd>
									)}
								</div>

								<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
									<dt className="text-sm font-medium text-gray-500">{responseTimeText}</dt>
									{isComponentReady && responseTime ? (
										<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{responseTime + "ms"}</dd>
									) : isComponentReady && !responseTime ? (
										<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
											<span className="text-gray-500">{noneText}</span>
										</dd>
									) : (
										<dd className="mt-1 sm:col-span-2 sm:mt-0">
											<Skeleton duration={2} width={120} />
										</dd>
									)}
								</div>

								{statusAdjusted === "HTTP_ERROR" || statusAdjusted === "HTTP_ERROR" ? (
									<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
										<dt className="text-sm font-medium text-gray-500">{errorText}</dt>
										{isComponentReady && error ? (
											<dd className="mt-1 text-sm font-semibold text-red-500 sm:col-span-2 sm:mt-0">{error}</dd>
										) : isComponentReady && !error ? (
											<dd className="mt-1 text-sm sm:col-span-2 sm:mt-0">
												<span className="text-gray-500">{noneText}</span>
											</dd>
										) : (
											<dd className="mt-1 sm:col-span-2 sm:mt-0">
												<Skeleton duration={2} width={120} />
											</dd>
										)}
									</div>
								) : null}

								<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
									<dt className="text-sm font-medium text-gray-500">{sizeText}</dt>
									{isComponentReady && size ? (
										<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{convertedSize}</dd>
									) : isComponentReady && !size ? (
										<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
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
											<MemoizedSiteSuccessIcon />
										</dd>
									) : isComponentReady && !tlsStatus ? (
										<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
											<span className="text-gray-500">{noneText}</span>
										</dd>
									) : (
										<dd className="mt-1 sm:col-span-2 sm:mt-0">
											<Skeleton duration={2} width={120} />
										</dd>
									)}
								</div>

								<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
									<dt className="text-sm font-medium text-gray-500">{tlsStatusAdjustedText}</dt>
									{isComponentReady && tlsStatusAdjusted ? (
										<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
											<MemoizedSiteSuccessIcon />
										</dd>
									) : isComponentReady && !tlsStatusAdjusted ? (
										<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
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
									<dt className="text-sm font-medium text-gray-500">{resolvedStatusText}</dt>
									{isComponentReady && resolvedStatus ? (
										<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
											<MemoizedSiteSuccessIcon />
										</dd>
									) : isComponentReady && !resolvedStatus ? (
										<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
											<span className="text-gray-500">{noneText}</span>
										</dd>
									) : (
										<dd className="mt-1 sm:col-span-2 sm:mt-0">
											<Skeleton duration={2} width={120} />
										</dd>
									)}
								</div>

								<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
									<dt className="text-sm font-medium text-gray-500">{resolvedTlsText}</dt>
									{isComponentReady && resolvedTls ? (
										<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
											<MemoizedSiteSuccessIcon />
										</dd>
									) : isComponentReady && !resolvedTls ? (
										<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
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
										<dd className="mt-1 text-sm font-semibold text-red-900 sm:col-span-2 sm:mt-0">{tlsErrors}</dd>
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
							<h3 className="text-xl font-bold leading-6 text-gray-900">{pageLocationsText}</h3>
						</div>
						<div className="mt-5">
							<dl className="sm:divide-y sm:divide-gray-200">
								<div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5">
									<dt className="text-sm font-medium text-gray-500">{occurrencesText}</dt>
									{isComponentReady && occurrences ? (
										<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">{occurrences}</dd>
									) : isComponentReady && !occurrences ? (
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
									<dt className="text-sm font-medium text-gray-500">{urlText}</dt>
									<dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
										{pages && pages?.length > 0 ? (
											<ul className="divide-y divide-gray-200 rounded-md border border-gray-200">
												{pages.map((page) => (
													<li key={page.id} className="flex items-center justify-between py-3 pl-3 pr-4 text-sm">
														<div className="flex w-0 flex-1 items-center">
															<DocumentTextIcon className="h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
															<span className="ml-2 w-0 flex-1 truncate">{page.url}</span>
														</div>
														<div className="ml-4 flex flex-shrink-0 space-x-4">
															<Link href={DashboardSitesLink + querySiteId + SitePagesSlug + page.id} passHref>
																<a className="font-medium text-indigo-600 hover:text-indigo-500">
																	{goToSiteOverviewText}
																</a>
															</Link>
															<span className="text-gray-300" aria-hidden="true">
																|
															</span>
															<a
																href={page.url}
																target="_blank"
																className="font-medium text-gray-600 hover:text-gray-500"
																rel="noreferrer"
															>
																{visitExternalSiteText}
															</a>
														</div>
													</li>
												))}
											</ul>
										) : (
											<span className="text-gray-500">{noneText}</span>
										)}
									</dd>
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
 * Memoized custom `SiteLinkDetailPageLayout` component
 */
export const MemoizedSiteLinkDetailPageLayout = memo(SiteLinkDetailPageLayout);
