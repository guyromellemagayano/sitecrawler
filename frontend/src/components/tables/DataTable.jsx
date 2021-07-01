// React
import * as React from "react";

// NextJS
import Link from "next/link";

// External
import loadable from "@loadable/component";
import Moment from "react-moment";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";
import tw from "twin.macro";

// JSON
import DataTableLabel from "public/labels/components/sites/DataTable.json";

// Hooks
import { useScan, useStats } from "src/hooks/useSite";

// Loadable
const SiteVerifyModal = loadable(() => import("src/components/modals/SiteVerifyModal"), {
	resolveComponent: (components) => components.SiteVerifyModal
});
const DeleteSiteModal = loadable(() => import("src/components/modals/DeleteSiteModal"));

const DataTable = ({ siteId, siteName, siteUrl, siteVerified, siteVerificationId, disableLocalTime, mutateSite }) => {
	const [componentReady, setComponentReady] = React.useState(false);
	const [scanCount, setScanCount] = React.useState(null);
	const [scanFinishedAt, setScanFinishedAt] = React.useState(null);
	const [scanForceHttps, setScanForceHttps] = React.useState(null);
	const [scanObjId, setScanObjId] = React.useState(null);
	const [showDeleteSiteModal, setShowDeleteSiteModal] = React.useState(false);
	const [showVerifySiteModal, setShowVerifySiteModal] = React.useState(false);

	const calendarStrings = {
		lastDay: "[Yesterday], dddd",
		sameDay: "[Today], dddd",
		lastWeek: "MMMM DD, YYYY",
		sameElse: "MMMM DD, YYYY"
	};

	const { scan } = useScan({
		querySid: siteId
	});

	React.useEffect(() => {
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

	const { stats } = useStats({
		querySid: siteId,
		scanObjId: scanObjId
	});

	React.useEffect(() => {
		setTimeout(() => {
			setComponentReady(true);
		}, 500);

		return setComponentReady(false);
	}, []);

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
		<>
			<SiteVerifyModal
				siteId={siteId}
				siteUrl={siteUrl}
				siteName={siteName}
				siteVerificationId={siteVerificationId}
				show={showVerifySiteModal}
				setShowModal={setShowVerifySiteModal}
				mutateSite={mutateSite}
			/>
			<DeleteSiteModal
				siteId={siteId}
				mutateSite={mutateSite}
				show={showDeleteSiteModal}
				setShowModal={setShowDeleteSiteModal}
			/>

			<tr>
				<td tw="flex-none px-6 py-4 whitespace-nowrap">
					<span tw="flex flex-col items-start">
						<span>
							{componentReady ? (
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
															{DataTableLabel[21].label}
														</a>
													</Link>
												) : null}

												<button
													type="button"
													css={[
														tw`cursor-pointer flex items-center justify-start text-sm focus:outline-none leading-6 font-semibold text-yellow-600 hover:text-yellow-500 transition ease-in-out duration-150`,
														scanCount > 0 && tw`ml-3`
													]}
													onClick={() => setShowVerifySiteModal(!showVerifySiteModal)}
												>
													{DataTableLabel[0].label}
												</button>
												<button
													type="button"
													tw="cursor-pointer ml-3 flex items-center justify-start text-sm focus:outline-none leading-6 font-semibold text-red-600 hover:text-red-500 transition ease-in-out duration-150"
													onClick={(e) => setShowDeleteSiteModal(!showDeleteSiteModal)}
												>
													{DataTableLabel[1].label}
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
													title={DataTableLabel[3].label}
													target="_blank"
												>
													{DataTableLabel[3].label}
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
					{componentReady ? (
						scanCount > 0 ? (
							<span tw="space-x-2">
								<span tw="text-sm leading-5 text-gray-500">
									{!disableLocalTime ? (
										<Moment
											calendar={calendarStrings}
											date={
												scanFinishedAt == null && scanForceHttps == null && scanCount > 1
													? scan?.results[1]?.finished_at
													: scan?.results[0]?.finished_at
											}
											local
										/>
									) : (
										<Moment
											calendar={calendarStrings}
											date={
												scanFinishedAt == null && scanForceHttps == null && scanCount > 1
													? scan?.results[1]?.finished_at
													: scan?.results[0]?.finished_at
											}
											utc
										/>
									)}
								</span>
								<span tw="text-sm leading-5 text-gray-500">
									{!disableLocalTime ? (
										<Moment
											date={
												scanFinishedAt == null && scanForceHttps == null && scanCount > 1
													? scan?.results[1]?.finished_at
													: scan?.results[0]?.finished_at
											}
											format="hh:mm:ss A"
											local
										/>
									) : (
										<Moment
											date={
												scanFinishedAt == null && scanForceHttps == null && scanCount > 1
													? scan?.results[1]?.finished_at
													: scan?.results[0]?.finished_at
											}
											format="hh:mm:ss A"
											utc
										/>
									)}
								</span>
								{disableLocalTime && <span tw="text-sm leading-5 font-medium text-gray-500">(UTC)</span>}
							</span>
						) : (
							<span tw="space-x-2">
								<span tw="text-sm leading-5 text-gray-500">{DataTableLabel[19].label}</span>
							</span>
						)
					) : (
						<Skeleton duration={2} width={176.7} />
					)}
				</td>
				<td tw="px-6 py-4 whitespace-nowrap text-sm text-gray-500 leading-5 font-semibold">
					{stats ? (
						<Link href="/site/[siteId]/overview" as={`/site/${siteId}/overview`} passHref>
							<a css={[tw`cursor-pointer`, setTotalIssues() > 0 ? tw`text-red-500` : tw`text-green-500`]}>
								{setTotalIssues()}
							</a>
						</Link>
					) : (
						<Skeleton duration={2} width={45} />
					)}
				</td>
				<td tw="px-6 py-4 whitespace-nowrap text-sm text-gray-500 leading-5 font-semibold">
					{stats ? (
						<Link href="/site/[siteId]/links" as={`/site/${siteId}/links`} passHref>
							<a tw="cursor-pointer text-sm leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150">
								{stats?.num_links}
							</a>
						</Link>
					) : (
						<Skeleton duration={2} width={45} />
					)}
				</td>
				<td tw="px-6 py-4 whitespace-nowrap text-sm text-gray-500 leading-5 font-semibold">
					{stats ? (
						<Link href="/site/[siteId]/pages" as={`/site/${siteId}/pages`} passHref>
							<a tw="cursor-pointer text-sm leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150">
								{stats?.num_pages}
							</a>
						</Link>
					) : (
						<Skeleton duration={2} width={45} />
					)}
				</td>
				<td tw="px-6 py-4 whitespace-nowrap text-sm text-gray-500 leading-5 font-semibold">
					{stats ? (
						<Link href="/site/[siteId]/images" as={`/site/${siteId}/images`} passHref>
							<a tw="cursor-pointer text-sm leading-6 font-semibold text-indigo-600 hover:text-indigo-500 transition ease-in-out duration-150">
								{stats?.num_images}
							</a>
						</Link>
					) : (
						<Skeleton duration={2} width={45} />
					)}
				</td>
			</tr>
		</>
	);
};

DataTable.propTypes = {};

export default DataTable;
