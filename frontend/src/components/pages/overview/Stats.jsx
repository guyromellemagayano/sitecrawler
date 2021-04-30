// React
import { useState, useEffect } from "react";

// External
import "twin.macro";
import { PageIcon, LinksIcon, ImageIcon, InformationCircleIcon } from "@heroicons/react/outline";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";

// JSON
import StatsLabel from "public/labels/components/sites/Stats.json";

// Hooks
import { useScan, useStats } from "src/hooks/useSite";

const SitesStats = ({ crawlableHandler, sid, user }) => {
	const [componentReady, setComponentReady] = useState(false);
	const [scanData, setScanData] = useState([]);
	const [scanObjId, setScanObjId] = useState(0);
	const [statsData, setStatsData] = useState([]);

	const { scan: scan } = useScan({
		querySid: sid
	});

	useEffect(() => {
		if (scan && scan !== undefined && Object.keys(scan).length > 0) {
			setScanData(scan);

			if (scanData.results && scanData.results !== undefined && Object.keys(scanData.results).length > 0) {
				setScanObjId(
					scanData.results
						.map((e) => {
							return e.id;
						})
						.sort()
						.reverse()[0]
				);
			}
		}
	});

	const { stats: stats } = useStats({
		querySid: sid,
		scanObjId: scanObjId
	});

	useEffect(() => {
		if (statsData && stats !== undefined && Object.keys(stats).length > 0) {
			setStatsData(stats);
		}
	}, [stats]);

	useEffect(() => {
		if (user && statsData) {
			setTimeout(() => {
				setComponentReady(true);
			}, 500);
		}
	}, [user, statsData]);

	useEffect(() => {
		if (statsData && statsData !== undefined && Object.keys(statsData).length > 0) {
			if (statsData.finished_at) crawlableHandler(true);
			else if (statsData.started_at && statsData.finished_at == null) crawlableHandler(false);
		}
	}, [statsData]);

	const setSeoErrors = () => {
		let valLength = 0;

		if (statsData) {
			if (
				(statsData.num_pages_without_title !== 0 && statsData.num_pages_without_title !== undefined) ||
				(statsData.num_pages_without_description !== 0 && statsData.num_pages_without_description !== undefined) ||
				(statsData.num_pages_without_h1_first !== 0 && statsData.num_pages_without_h1_first !== undefined) ||
				(statsData.num_pages_without_h2_first !== 0 && statsData.num_pages_without_h2_first !== undefined)
			) {
				valLength =
					(statsData ? statsData.num_pages_without_title : 0) +
					(statsData ? statsData.num_pages_without_description : 0) +
					(statsData ? statsData.num_pages_without_h1_first : 0) +
					(statsData ? statsData.num_pages_without_h2_first : 0);
			}
		}

		return valLength;
	};

	const setPageErrors = () => {
		let valLength = 0;

		if (statsData) {
			if (
				(statsData.num_pages_big !== 0 && statsData.num_pages_big !== undefined) ||
				(statsData.num_pages_tls_non_ok !== 0 && statsData.num_pages_tls_non_ok !== undefined)
			) {
				valLength = (statsData ? statsData.num_pages_big : 0) + (statsData ? statsData.num_pages_tls_non_ok : 0);
			}
		}

		return valLength;
	};

	const setImageErrors = () => {
		let valLength = 0;

		if (statsData) {
			if (statsData.num_non_ok_images !== 0 && statsData.num_non_ok_images !== undefined) {
				valLength = statsData ? statsData.num_non_ok_images : 0;
			}
		}

		return valLength;
	};

	const PageTabs = [
		{
			title: "Total Issues",
			count:
				statsData &&
				statsData !== undefined &&
				Object.keys(statsData).length > 0 &&
				statsData.num_non_ok_links + setSeoErrors() + setPageErrors() + setImageErrors()
		},
		{
			title: "Total Pages",
			count: statsData && statsData !== undefined && Object.keys(statsData).length > 0 && statsData.num_pages
		},
		{
			title: "Total Links",
			count: statsData && statsData !== undefined && Object.keys(statsData).length > 0 && statsData.num_links
		},
		{
			title: "Total Images",
			count: statsData && statsData !== undefined && Object.keys(statsData).length > 0 && statsData.num_images
		}
	];

	return (
		<div tw="px-6 py-5 sm:p-6 bg-white overflow-hidden rounded-lg border">
			<h2 tw="text-lg font-bold leading-7 text-gray-900">
				{componentReady ? StatsLabel[0].label : <Skeleton duration={2} width={120} height={20} />}
			</h2>
			<div tw="grid grid-cols-2 h-full overflow-hidden py-6">
				{PageTabs.map((val, key) => {
					return (
						<div key={key} tw="flex items-center justify-start space-y-px space-x-px">
							<div tw="flex items-start justify-center">
								<dl tw="mr-2">
									<dt>
										{val.title === "Total Pages" ? (
											componentReady ? (
												<PageIcon tw="mr-3 mr-1 h-9 h-7 w-8 h-6 text-gray-500" />
											) : (
												<span tw="flex -mt-1">
													<Skeleton duration={2} width={20} height={20} />
												</span>
											)
										) : val.title === "Total Links" ? (
											componentReady ? (
												<LinksIcon tw="mr-3 mr-1 h-9 h-7 w-8 h-6 text-gray-500" />
											) : (
												<span tw="flex -mt-1">
													<Skeleton duration={2} width={20} height={20} />
												</span>
											)
										) : val.title === "Total Images" ? (
											componentReady ? (
												<ImageIcon tw="mr-3 mr-1 h-9 h-7 w-8 h-6 text-gray-500" />
											) : (
												<span tw="flex -mt-1">
													<Skeleton duration={2} width={20} height={20} />
												</span>
											)
										) : componentReady ? (
											<InformationCircleIcon tw="mr-3 mr-1 h-9 h-7 w-8 h-6 text-gray-500" />
										) : (
											<span tw="flex -mt-1">
												<Skeleton duration={2} width={20} height={20} />
											</span>
										)}
									</dt>
								</dl>
								<dl>
									<dt tw="text-sm text-xs lg:text-sm leading-5 font-medium text-gray-500 truncate">{val.title}</dt>

									{val.title === "Total Issues" ? (
										<dd tw="mt-1 text-3xl leading-9 font-semibold text-red-700">
											{componentReady ? val.count : <Skeleton duration={2} width={50} height={50} />}
										</dd>
									) : (
										<dd tw="mt-1 text-3xl leading-9 font-semibold text-gray-900">
											{componentReady ? val.count : <Skeleton duration={2} width={50} height={50} />}
										</dd>
									)}
								</dl>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};

SitesStats.propTypes = {};

export default SitesStats;
