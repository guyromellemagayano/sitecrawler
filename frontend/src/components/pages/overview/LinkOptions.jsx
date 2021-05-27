// React
import * as React from "react";

// NextJS
import { useRouter } from "next/router";

// External
import { SearchIcon } from "@heroicons/react/solid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import loadable from "@loadable/component";
import tw from "twin.macro";

// JSON
import LinkOptionsLabel from "public/labels/components/sites/LinkOptions.json";

// Hooks
import { useScan, useStats } from "src/hooks/useSite";

// Components
const UpgradeErrorModal = loadable(() => import("src/components/modals/UpgradeErrorModal"));

const LinkOptions = ({ sid, user, searchKey, onSearchEvent, onCrawl, crawlable, crawlFinished, crawlableHandler }) => {
	const [componentReady, setComponentReady] = React.useState(false);
	const [scanObjId, setScanObjId] = React.useState(0);
	const [showErrorModal, setShowErrorModal] = React.useState(false);

	let previousScanResults = [];
	let currentScanResults = [];

	const { asPath } = useRouter();

	const { scan: scan } = useScan({
		querySid: sid
	});

	React.useEffect(() => {
		if (scan && scan !== undefined && Object.keys(scan).length > 0) {
			if (scan.results && scan.results !== undefined && Object.keys(scan.results).length > 0) {
				currentScanResults = scan.results.find((e) => e.finished_at === null);
				previousScanResults = scan.results.find((e) => e.finished_at !== null);

				if (currentScanResults !== [] || currentScanResults !== undefined) {
					if (!crawlFinished) {
						if (previousScanResults !== undefined) {
							setScanObjId(previousScanResults.id);
						} else {
							setScanObjId(currentScanResults.id);
						}
					} else {
						if (previousScanResults !== undefined) {
							setScanObjId(previousScanResults.id);
						} else {
							setScanObjId(currentScanResults.id);
						}
					}
				}
			}
		}
	}, [crawlFinished, scan, scanObjId]);

	const { stats: stats } = useStats({
		querySid: sid,
		scanObjId: scanObjId && scanObjId !== undefined && scanObjId !== 0 && scanObjId
	});

	React.useEffect(() => {
		if (
			user &&
			user !== undefined &&
			user !== [] &&
			Object.keys(user).length > 0 &&
			stats &&
			stats !== undefined &&
			stats !== [] &&
			Object.keys(stats).length > 0
		) {
			setTimeout(() => {
				setComponentReady(true);
			}, [500]);
		}
	}, [user, stats]);

	React.useEffect(() => {
		if (stats && stats !== undefined && Object.keys(stats).length > 0) {
			if (stats.finished_at) crawlableHandler(true);
			else if (stats.started_at && stats.finished_at == null) crawlableHandler(false);
		}
	}, [stats]);

	const handleOnCrawlPermissions = (e) => {
		e.preventDefault();

		setShowErrorModal(!showErrorModal);
	};

	return componentReady ? (
		<>
			<UpgradeErrorModal
				show={showErrorModal}
				setShowErrorModal={setShowErrorModal}
				component="LinkOptions"
				label={LinkOptionsLabel}
			/>

			<div tw="flex flex-col w-0 flex-1 overflow-hidden z-10">
				<div tw="relative z-10 flex-shrink-0 flex bg-white border-b border-gray-200">
					<div tw="flex-1 p-4 flex justify-end">
						{user.permissions &&
						user.permissions !== undefined &&
						user.permissions.includes("can_see_images") &&
						user.permissions.includes("can_see_pages") &&
						user.permissions.includes("can_see_scripts") &&
						user.permissions.includes("can_see_stylesheets") &&
						user.permissions.includes("can_start_scan") ? (
							<div tw="flex-1 flex">
								<div tw="w-full flex lg:ml-0">
									<label htmlFor="searchSites" tw="sr-only">
										{LinkOptionsLabel[1].label}
									</label>
									<div tw="relative w-full text-gray-400 focus-within:text-gray-600">
										<div tw="absolute inset-y-0 left-0 flex items-center pointer-events-none">
											<SearchIcon tw="h-5 w-5 text-gray-400" />
										</div>
										<input
											type="search"
											name="search-links"
											id="searchlinks"
											tw="block w-full h-full pl-8 pr-3 py-2 border-transparent text-gray-900 placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-0 focus:border-transparent sm:text-sm"
											placeholder={
												asPath.includes("pages")
													? LinkOptionsLabel[0].label
													: asPath.includes("links")
													? LinkOptionsLabel[1].label
													: asPath.includes("images")
													? LinkOptionsLabel[2].label
													: LinkOptionsLabel[3].label
											}
											onKeyUp={onSearchEvent}
											defaultValue={searchKey}
											autoFocus
										/>
									</div>
								</div>
							</div>
						) : null}

						<div tw="ml-4 flex items-center lg:ml-6">
							{componentReady ? (
								user && user !== undefined && Object.keys(user).length > 0 ? (
									<>
										<button
											type="button"
											disabled={user.permissions.includes("can_start_scan") && !crawlable}
											onClick={user && user.permissions.includes("can_start_scan") ? onCrawl : handleOnCrawlPermissions}
											css={[
												tw`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white focus:outline-none`,
												user.permissions.includes("can_start_scan") ? tw`bg-green-600` : tw`bg-yellow-600`,
												user.permissions.includes("can_start_scan")
													? !crawlFinished
														? tw`opacity-50 cursor-not-allowed`
														: tw`hover:bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-500`
													: !crawlFinished
													? tw`opacity-50 cursor-not-allowed`
													: tw`hover:bg-yellow-700 focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500`
											]}
										>
											<span tw="flex items-center space-x-2">
												{user.permissions &&
												user.permissions !== undefined &&
												user.permissions.includes("can_see_images") &&
												user.permissions.includes("can_see_pages") &&
												user.permissions.includes("can_see_scripts") &&
												user.permissions.includes("can_see_stylesheets") &&
												user.permissions.includes("can_start_scan") ? null : (
													<FontAwesomeIcon icon={["fas", "crown"]} tw="w-4 h-4 text-white" />
												)}
												<span>
													{crawlFinished
														? LinkOptionsLabel[4].label
														: scan.count == 1
														? LinkOptionsLabel[8].label
														: LinkOptionsLabel[5].label}
												</span>
											</span>
										</button>
									</>
								) : null
							) : null}
						</div>
					</div>
				</div>
			</div>
		</>
	) : null;
};

export default LinkOptions;
