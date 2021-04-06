// React
import { useState, useEffect } from "react";

// NextJS
import Link from "next/link";
import { useRouter } from "next/router";

// External
import { withResizeDetector } from "react-resize-detector";
import loadable from "@loadable/component";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";
import tw, { styled } from "twin.macro";

// JSON
import PagesStatsLabel from "public/labels/components/sites/PagesStats.json";

// Enums
import { pagesChartContents } from "src/enum/chartContents";

// Hooks
import { useScan, useStats, useNoPageIssues } from "src/hooks/useSite";

// Components
const Chart = loadable(() => import("react-apexcharts"));
const PageSvg = loadable(() => import("src/components/svg/outline/PageSvg"));

const SitesPagesStatsDiv = styled.div`
	.status-indicator {
		display: block;
		flex: 0 0 0.85rem;
		max-width: 0.85rem;
		height: 0.85rem;
		border-radius: 50%;

		&.error {
			&-1 {
				background-color: #19b080;
			}
			&-2 {
				background-color: #ef2917;
			}
			&-3 {
				background-color: #ed5244;
			}
			&-4 {
				background-color: #bb4338;
			}
			&-5 {
				background-color: #2d99ff;
			}
		}
	}
	.apexcharts-legend {
		display: block;
		margin-left: auto !important;
		margin-right: auto !important;
		max-width: 16rem;
	}
	.apexcharts-legend-series {
		display: flex;
		align-items: center;
		border-bottom: 1px solid #e7efef;
		padding-bottom: 10px;
	}
	.apexcharts-legend-series:last-child {
		border: none;
	}
	.apexcharts-legend-text {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
	}
	.apexcharts-legend-marker {
		margin-right: 10px;
	}
	.legend-val {
		color: #1d2626;
		font-weight: 600;
	}
	.legend-text {
		margin-right: 10px;
	}
	.skeleton-wrapper {
		margin-bottom: 20px;
	}
`;

const SitesPagesStats = ({ width, sid, user }) => {
	const [componentReady, setComponentReady] = useState(false);
	const [noPageIssuesData, setNoPageIssuesData] = useState([]);
	const [scanData, setScanData] = useState([]);
	const [scanObjId, setScanObjId] = useState(0);
	const [statsData, setStatsData] = useState([]);

	const lgScreenBreakpoint = 1024;

	const router = useRouter();

	const { scan: scan, scanError: scanError } = useScan({
		querySid: sid,
		refreshInterval: 1000,
	});

	useEffect(() => {
		if (scan && scan !== undefined && Object.keys(scan).length > 0) {
			setScanData(scan);

			if (scanData.results && scanData.results !== undefined && Object.keys(scanData.results).length > 0) {
				setScanObjId(scanData.results[scanData.results.length - 1].id);
			}
		}

		if (scanError && scanError.message !== "" && scanError.message !== undefined) {
			// TODO: add generic alert here
			console.log("ERROR: " + scanError.message);
		}
	});

	const { stats: stats, statsError: statsError } = useStats({
		querySid: sid,
		scanObjId: scanObjId,
	});

	const { noPageIssues: noPageIssues, noPageIssuesError: noPageIssuesError } = useNoPageIssues({
		querySid: sid,
		scanObjId: scanObjId,
	});

	useEffect(() => {
		if (stats && stats !== undefined && Object.keys(stats).length > 0) {
			setStatsData(stats);
		}

		if (noPageIssues && noPageIssues !== undefined && Object.keys(noPageIssues).length > 0) {
			setNoPageIssuesData(noPageIssues);
		}

		if (statsError || noPageIssuesError) {
			// TODO: add generic alert here
			console.log(
				"ERROR: " + statsError.message !== "" && statsError.message !== undefined
					? statsError.message
					: noPageIssuesError.message !== "" && noPageIssuesError.message !== undefined
					? noPageIssuesError.message
					: PagesStatsLabel[2].label
			);
		}
	}, [stats, noPageIssues]);

	useEffect(() => {
		if (
			user &&
			statsData &&
			statsData !== undefined &&
			Object.keys(statsData).length > 0 &&
			noPageIssuesData &&
			noPageIssuesData !== undefined &&
			Object.keys(noPageIssuesData).length > 0
		) {
			setTimeout(() => {
				setComponentReady(true);
			}, 500);
		}
	}, [user, statsData, noPageIssuesData]);

	const legendClickHandler = (label) => {
		let path = `/site/${sid}/pages`;

		pagesChartContents.forEach((item, index) => {
			// console.log(item)
			if (label === item.label && item.filter !== "")
				path += path.includes("?") ? `&${item.filter}` : `?${item.filter}`;
		});

		router.push("/site/[siteId]/pages", path);
	};

	const chartSeries = [
		statsData && statsData.num_pages_big !== undefined ? statsData.num_pages_big : 0,
		statsData && statsData.num_pages_tls_non_ok !== undefined ? statsData.num_pages_tls_non_ok : 0,
		noPageIssuesData && noPageIssuesData.count !== undefined ? noPageIssuesData.count : 0,
	];

	const chartOptions = {
		chart: {
			id: "pageStats",
			type: "donut",
			events: {
				legendClick: function (chartContext, seriesIndex, config) {
					legendClickHandler(config.config.labels[seriesIndex]);
				},
			},
		},
		// labels: ['No Issues', 'Large Page Size', 'Broken Security', 'Not on Google'],
		// colors: ['#19B080', '#EF2917', '#ED5244', '#BB4338'],
		// fill: {
		//   colors: ['#19B080', '#EF2917', '#ED5244', '#BB4338']
		// },
		labels: pagesChartContents.map((item) => item.label),
		colors: pagesChartContents.map((item) => item.color),
		fill: {
			colors: pagesChartContents.map((item) => item.color),
		},
		stroke: {
			width: 0,
		},
		dataLabels: {
			enabled: true,
			formatter: function (val, opts) {
				return opts.w.config.series[opts.seriesIndex];
			},
		},
		legend: {
			show: true,
			fontSize: "14px",
			position: "bottom",
			horizontalAlign: "center",
			height: 210,
			itemMargin: {
				horizontal: 15,
				vertical: 10,
			},
			formatter: function (seriesName, opts) {
				return [
					`<span className='legend-text'>${seriesName}</span>`,
					"   ",
					`<span className='legend-val'>${opts.w.globals.series[opts.seriesIndex]}</span>`,
				];
			},
		},
		plotOptions: {
			pie: {
				customScale: 0.8,
				donut: {
					labels: {
						show: true,
						total: {
							show: true,
							showAlways: true,
							label: "Page Errors",
							fontSize: "15px",
							color: "#2A324B",
							formatter: function (val) {
								let num_errs = 0;
								for (let i = 0; i < val.config.series.slice(0, -1).length; i++) {
									num_errs += val.config.series[i];
								}

								return num_errs;
							},
						},
					},
				},
			},
		},
		responsive: [
			{
				breakpoint: 320,
				options: {
					chart: {
						width: 420,
						height: "auto",
					},
					legend: {
						position: "bottom",
						width: 315,
						height: "auto",
						itemMargin: {
							horizontal: 25,
							vertical: 10,
						},
					},
				},
			},
		],
	};

	return (
		<SitesPagesStatsDiv>
			<div tw="bg-white overflow-hidden ring-1 ring-black ring-opacity-5 rounded-lg h-full">
				<div tw="flex justify-between py-8 px-5">
					<div tw="flex items-center">
						<PageSvg className={tw`w-5 h-5 text-gray-900 mr-2`} />
						<h2 tw="text-lg font-bold leading-7 text-gray-900">{PagesStatsLabel[0].label}</h2>
					</div>
					<div>
						<Link href="/site/[siteId]/pages" as={`/site/${sid}/pages`} passHref>
							<a tw="text-sm leading-5 font-medium text-gray-500 hover:underline">{PagesStatsLabel[1].label}</a>
						</Link>
					</div>
				</div>
				<div tw="flex justify-center mx-auto max-w-sm">
					{componentReady ? (
						<Chart
							options={chartOptions}
							series={chartSeries}
							type="donut"
							width={lgScreenBreakpoint > width ? "400" : "600"}
							height={lgScreenBreakpoint > width ? "530" : "530"}
						/>
					) : (
						// FIXME: update skeleton for chart
						<h1>Loading...</h1>
					)}
				</div>
			</div>
		</SitesPagesStatsDiv>
	);
};

SitesPagesStats.propTypes = {};

export default withResizeDetector(SitesPagesStats);
