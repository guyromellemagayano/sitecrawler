import DeleteSiteModal from "@components/modals/DeleteSiteModal";
import SiteVerifyModal from "@components/modals/SiteVerifyModal";
import { DataTableLabels } from "@enums/DataTableLabels";
import { useSiteDeleteModalVisible, useSiteVerifyModalVisible } from "@hooks/useComponentVisible";
import { useScan } from "@hooks/useScan";
// import { useScan, useStats } from "@hooks/useSite";
import { useSites } from "@hooks/useSites";
import { useStats } from "@hooks/useStats";
import { useUser } from "@hooks/useUser";
import dayjs from "dayjs";
import Link from "next/link";
import { memo, useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import tw from "twin.macro";

const DataTable = memo(
	({ disableLocalTime, mutateSite, siteId, siteName, siteUrl, siteVerificationId, siteVerified }) => {
		const [scanCount, setScanCount] = useState(null);
		const [scanFinishedAt, setScanFinishedAt] = useState(null);
		const [scanForceHttps, setScanForceHttps] = useState(null);
		const [scanObjId, setScanObjId] = useState(null);

		// SWR hooks
		const { user, errorUser, validatingUser } = useUser();
		const { sites, errorSites, validatingSites } = useSites();

		const { siteVerifyModalRef, isSiteVerifyModalVisible, setIsSiteVerifyModalVisible } =
			useSiteVerifyModalVisible(false);
		const { siteDeleteModalRef, isSiteDeleteModalVisible, setIsSiteDeleteModalVisible } =
			useSiteDeleteModalVisible(false);

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

		const { scan } = useScan(siteId);

		useEffect(() => {
			const currentScanCount = scan?.count;
			const currentScanFinishedAt = scan?.results[0]?.finished_at ?? null;
			const currentScanForcehttps = scan?.results[0]?.force_https ?? null;
			const currentScanObjId =
				currentScanFinishedAt !== null && currentScanForcehttps !== null && currentScanCount > 1
					? scan?.results[1]?.id
					: scan?.results[0]?.id;

			setScanCount(currentScanCount);
			setScanFinishedAt(currentScanFinishedAt);
			setScanForceHttps(currentScanForcehttps);
			setScanObjId(currentScanObjId);

			return { scanFinishedAt, scanForceHttps, scanCount, scanObjId };
		}, [scan, siteId]);

		const { stats, errorStats, validatingStats } = useStats(siteId, scanObjId);

		const setLinkErrors = () => {
			let valLength = stats?.num_non_ok_links;

			return valLength;
		};

		const setPageErrors = () => {
			let valLength = stats?.num_pages_big + stats?.num_pages_tls_non_ok;

			return valLength;
		};

		const setImageErrors = () => {
			let valLength = stats?.num_non_ok_images + stats?.num_images_with_missing_alts + stats?.num_images_tls_non_ok;

			return valLength;
		};

		const setSeoErrors = () => {
			let valLength =
				stats?.num_pages_without_title +
				stats?.num_pages_without_description +
				stats?.num_pages_without_h1_first +
				stats?.num_pages_without_h2_first;

			return valLength;
		};

		const setTotalIssues = () => {
			let valLength = 0;

			stats
				? (() => {
						valLength = setLinkErrors() + setPageErrors() + setImageErrors() + setSeoErrors();
				  })()
				: null;

			return valLength;
		};

		return (
			<tr>
				<td tw="flex-none px-6 py-4 whitespace-nowrap">
					<SiteVerifyModal
						mutateSite={mutateSite}
						setShowModal={setIsSiteVerifyModalVisible}
						showModal={isSiteVerifyModalVisible}
						siteId={siteId}
						siteName={siteName}
						siteUrl={siteUrl}
						siteVerificationId={siteVerificationId}
						ref={siteVerifyModalRef}
					/>

					<DeleteSiteModal
						mutateSite={mutateSite}
						setShowModal={setIsSiteDeleteModalVisible}
						showModal={isSiteDeleteModalVisible}
						ref={siteDeleteModalRef}
						siteId={siteId}
					/>

					<span tw="flex flex-col items-start">
						<span>
							{!validatingSites ? (
								!siteVerified ? (
									<>
										<span
											aria-label="Not Verified"
											tw="relative -left-3 flex-shrink-0 inline-block h-2 w-2 rounded-full leading-5 bg-red-400"
										></span>
										<div tw="inline-flex flex-col justify-start items-start">
											<span tw="flex items-center justify-start text-sm leading-6 font-semibold text-gray-400">
												<p className="truncate-link">{siteName}</p>
											</span>
											<span tw="flex justify-start text-sm leading-5 text-gray-500">
												{scanCount > 0 ? (
													<Link href="/site/[siteId]/overview" as={`/site/${siteId}/overview`} passHref>
														<a
															type="button"
															tw="cursor-pointer flex items-center justify-start text-sm focus:outline-none leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150"
														>
															{DataTableLabels[21].label}
														</a>
													</Link>
												) : null}

												<button
													type="button"
													css={[
														tw`cursor-pointer flex items-center justify-start text-sm focus:outline-none leading-6 font-semibold text-yellow-600 hover:text-yellow-500 transition ease-in-out duration-150`,
														scanCount > 0 && tw`ml-3`
													]}
													onClick={() => setIsSiteVerifyModalVisible(!isSiteVerifyModalVisible)}
												>
													{DataTableLabels[0].label}
												</button>
												<button
													type="button"
													tw="cursor-pointer ml-3 flex items-center justify-start text-sm focus:outline-none leading-6 font-semibold text-red-600 hover:text-red-500 transition ease-in-out duration-150"
													onClick={() => setIsSiteDeleteModalVisible(!isSiteDeleteModalVisible)}
												>
													{DataTableLabels[1].label}
												</button>
											</span>
										</div>
									</>
								) : (
									<>
										<span
											aria-label="Verified"
											css={[
												tw`relative -left-3 flex-shrink-0 inline-block h-2 w-2 rounded-full`,
												scanFinishedAt == null && scanForceHttps == null ? tw`bg-yellow-400` : tw`bg-green-400`
											]}
										></span>
										<div tw="inline-flex flex-col justify-start items-start">
											{stats?.num_links > 0 || stats?.num_pages > 0 || stats?.num_images > 0 ? (
												<Link href="/site/[siteId]/overview" as={`/site/${siteId}/overview`} passHref>
													<a
														className="truncate-link"
														tw="text-sm leading-6 font-semibold text-indigo-600 hover:text-indigo-500"
														title={siteName}
													>
														{siteName}
													</a>
												</Link>
											) : (
												<span tw="flex items-center justify-start text-sm leading-6 font-semibold text-gray-400">
													<p className="truncate-link">{siteName}</p>
												</span>
											)}

											<span tw="flex justify-start text-sm leading-5">
												<a
													href={siteUrl}
													tw="cursor-pointer flex items-center justify-start text-sm focus:outline-none leading-6 font-semibold text-gray-600 hover:text-gray-500 transition ease-in-out duration-150"
													title={DataTableLabels[3].label}
													target="_blank"
												>
													{DataTableLabels[3].label}
												</a>
											</span>
										</div>
									</>
								)
							) : (
								<>
									<span tw="flex flex-row items-center py-2 space-x-3">
										<Skeleton
											circle={true}
											duration={2}
											width={9}
											height={9}
											className="relative -left-3 flex-shrink-0 inline-block"
										/>
										<Skeleton
											duration={2}
											width={150}
											className="relative -left-3 inline-flex flex-col justify-start items-start"
										/>
									</span>
									<span tw="ml-2 flex flex-row justify-start text-sm leading-5 text-gray-500 space-x-3">
										<Skeleton duration={2} width={70} />
										<Skeleton duration={2} width={73} />
									</span>
								</>
							)}
						</span>
					</span>
				</td>
				<td tw="px-6 py-4 whitespace-nowrap text-sm text-gray-500 leading-5">
					{!validatingSites ? (
						scanCount > 0 ? (
							<span tw="space-x-2">
								<span tw="text-sm leading-5 text-gray-500">
									{!disableLocalTime
										? dayjs(
												scanFinishedAt == null && scanForceHttps == null
													? scan?.results[1]?.finished_at
													: scan?.results[0]?.finished_at
										  ).calendar(null, calendarStrings)
										: dayjs
												.utc(
													scanFinishedAt == null && scanForceHttps == null
														? scan?.results[1]?.finished_at
														: scan?.results[0]?.finished_at
												)
												.calendar(null, calendarStrings)}
								</span>
								<span tw="text-sm leading-5 font-medium text-gray-500">
									({!disableLocalTime ? dayjs.tz.guess() : "UTC"})
								</span>
							</span>
						) : (
							<span tw="space-x-2">
								<span tw="text-sm leading-5 text-gray-500">{DataTableLabels[19].label}</span>
							</span>
						)
					) : (
						<Skeleton duration={2} width={176.7} />
					)}
				</td>
				<td tw="px-6 py-4 whitespace-nowrap text-sm text-gray-500 leading-5 font-semibold">
					{stats ? (
						<span css={[setTotalIssues() > 0 ? tw`text-red-500` : tw`text-green-500`]}>{setTotalIssues()}</span>
					) : (
						<Skeleton duration={2} width={45} />
					)}
				</td>
				<td tw="px-6 py-4 whitespace-nowrap text-sm text-gray-500 leading-5 font-semibold">
					{stats ? (
						stats?.num_links > 0 ? (
							<Link href="/site/[siteId]/links" as={`/site/${siteId}/links`} passHref>
								<a tw="cursor-pointer text-sm leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150">
									{stats?.num_links}
								</a>
							</Link>
						) : (
							stats?.num_links
						)
					) : (
						<Skeleton duration={2} width={45} />
					)}
				</td>
				<td tw="px-6 py-4 whitespace-nowrap text-sm text-gray-500 leading-5 font-semibold">
					{stats ? (
						stats?.num_pages > 0 ? (
							<Link href="/site/[siteId]/pages" as={`/site/${siteId}/pages`} passHref>
								<a tw="cursor-pointer text-sm leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150">
									{stats?.num_pages}
								</a>
							</Link>
						) : (
							stats?.num_pages
						)
					) : (
						<Skeleton duration={2} width={45} />
					)}
				</td>
				<td tw="px-6 py-4 whitespace-nowrap text-sm text-gray-500 leading-5 font-semibold">
					{stats ? (
						stats?.num_images > 0 ? (
							<Link href="/site/[siteId]/images" as={`/site/${siteId}/images`} passHref>
								<a tw="cursor-pointer text-sm leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150">
									{stats?.num_images}
								</a>
							</Link>
						) : (
							stats?.num_images
						)
					) : (
						<Skeleton duration={2} width={45} />
					)}
				</td>
			</tr>
		);
	}
);

export default DataTable;
