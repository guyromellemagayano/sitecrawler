// React
import { useState, useEffect } from "react";

// External
import "twin.macro";
import { DocumentIcon, LinkIcon, PhotographIcon, InformationCircleIcon } from "@heroicons/react/outline";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";

// JSON
import StatsLabel from "public/labels/components/sites/Stats.json";

const SitesStats = ({ crawlableHandler, user, stats, previousScanDataActive, setPreviousScanDataActive }) => {
	const [componentReady, setComponentReady] = useState(false);

	useEffect(() => {
		if (
			user &&
			user !== undefined &&
			Object.keys(user).length > 0 &&
			stats &&
			stats !== undefined &&
			Object.keys(stats).length > 0
		) {
			setTimeout(() => {
				setComponentReady(true);
			}, 500);
		}
	}, [user, stats]);

	useEffect(() => {
		if (stats && stats !== undefined && Object.keys(stats).length > 0) {
			if (stats.started_at && stats.finished_at && !previousScanDataActive) {
				crawlableHandler(true);
				setPreviousScanDataActive(true);
			} else if (stats.started_at && stats.finished_at == null) {
				crawlableHandler(false);
			} else crawlableHandler(true);
		}
	}, [stats]);

	const setSeoErrors = () => {
		let valLength = 0;

		if (stats && stats !== undefined && Object.keys(stats).length > 0) {
			if (
				(stats.num_pages_without_title !== 0 && stats.num_pages_without_title !== undefined) ||
				(stats.num_pages_without_description !== 0 && stats.num_pages_without_description !== undefined) ||
				(stats.num_pages_without_h1_first !== 0 && stats.num_pages_without_h1_first !== undefined) ||
				(stats.num_pages_without_h2_first !== 0 && stats.num_pages_without_h2_first !== undefined)
			) {
				valLength =
					(stats ? stats.num_pages_without_title : 0) +
					(stats ? stats.num_pages_without_description : 0) +
					(stats ? stats.num_pages_without_h1_first : 0) +
					(stats ? stats.num_pages_without_h2_first : 0);
			}
		}

		return valLength;
	};

	const setPageErrors = () => {
		let valLength = 0;

		if (stats && stats !== undefined && Object.keys(stats).length > 0) {
			if (
				(stats.num_pages_big !== 0 && stats.num_pages_big !== undefined) ||
				(stats.num_pages_tls_non_ok !== 0 && stats.num_pages_tls_non_ok !== undefined)
			) {
				valLength = (stats ? stats.num_pages_big : 0) + (stats ? stats.num_pages_tls_non_ok : 0);
			}
		}

		return valLength;
	};

	const setImageErrors = () => {
		let valLength = 0;

		if (stats && stats !== undefined && Object.keys(stats).length > 0) {
			if (stats.num_non_ok_images !== 0 && stats.num_non_ok_images !== undefined) {
				valLength = stats ? stats.num_non_ok_images : 0;
			}
		}

		return valLength;
	};

	const PageTabs = [
		{
			title: "Total Issues",
			count:
				stats &&
				stats !== undefined &&
				Object.keys(stats).length > 0 &&
				stats.num_non_ok_links + setSeoErrors() + setPageErrors() + setImageErrors()
		},
		{
			title: "Total Pages",
			count: stats && stats !== undefined && Object.keys(stats).length > 0 && stats.num_pages
		},
		{
			title: "Total Links",
			count: stats && stats !== undefined && Object.keys(stats).length > 0 && stats.num_links
		},
		{
			title: "Total Images",
			count: stats && stats !== undefined && Object.keys(stats).length > 0 && stats.num_images
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
												<DocumentIcon tw="mr-3 h-6 w-6 text-gray-500" />
											) : (
												<span tw="flex -mt-1">
													<Skeleton duration={2} width={20} height={20} />
												</span>
											)
										) : val.title === "Total Links" ? (
											componentReady ? (
												<LinkIcon tw="mr-3 h-6 w-6 text-gray-500" />
											) : (
												<span tw="flex -mt-1">
													<Skeleton duration={2} width={20} height={20} />
												</span>
											)
										) : val.title === "Total Images" ? (
											componentReady ? (
												<PhotographIcon tw="mr-3 h-6 w-6 text-gray-500" />
											) : (
												<span tw="flex -mt-1">
													<Skeleton duration={2} width={20} height={20} />
												</span>
											)
										) : componentReady ? (
											<InformationCircleIcon tw="mr-3 h-6 w-6 text-gray-500" />
										) : (
											<span tw="flex -mt-1">
												<Skeleton duration={2} width={20} height={20} />
											</span>
										)}
									</dt>
								</dl>
								<dl>
									<dt tw="text-sm lg:text-sm leading-5 font-medium text-gray-500 truncate">{val.title}</dt>

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
