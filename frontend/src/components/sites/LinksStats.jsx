// React
import { useState, useEffect } from "react";

// NextJS
import { useRouter } from "next/router";
import Link from "next/link";

// External
import { withResizeDetector } from "react-resize-detector";
import loadable from "@loadable/component";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";
import tw, { styled } from "twin.macro";

// JSON
import LinksStatsLabel from "public/labels/components/sites/LinksStats.json";

// Enums
import { linksChartContents } from "src/enum/chartContents";

// Hooks
import { useScan, useStats, useLinks } from "src/hooks/useSite";

// Components
const Chart = loadable(() => import("react-apexcharts"));
const LinksSvg = loadable(() => import("src/components/svg/outline/LinksSvg"));

const SitesLinksStatsDiv = styled.div`
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

const SitesLinksStats = ({ width, sid, user }) => {
	const [componentReady, setComponentReady] = useState(false);
	const [linksData, setLinksData] = useState([]);
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

	const { links: links, linksError: linksError } = useLinks({
		querySid: sid,
		scanObjId: scanObjId,
	});

	useEffect(() => {
		if (stats && stats !== undefined && Object.keys(stats).length > 0) {
			setStatsData(stats);
		}

		if (links && links !== undefined && Object.keys(links).length > 0) {
			setLinksData(links);
		}

		if (statsError || linksError) {
			// TODO: add generic alert here
			console.log(
				"ERROR: " + statsError.message !== "" && statsError.message !== undefined
					? statsError.message
					: linksError.message !== "" && linksError.message !== undefined
					? linksError.message
					: LinksStatsLabel[2].label
			);
		}
	}, [stats, links]);

	useEffect(() => {
		if (
			user &&
			statsData &&
			statsData !== undefined &&
			Object.keys(statsData).length > 0 &&
			linksData &&
			linksData !== undefined &&
			Object.keys(linksData).length > 0
		) {
			setTimeout(() => {
				setComponentReady(true);
			}, 500);
		}
	}, [user, statsData, linksData]);

	// const setBrokenLinks = type => {
	// 	let valLength = 0

	// 	if (links) {
	// 		links.results.map((val, key) => {
	// 			if (val.status === 'HTTP_ERROR' || val.status === 'TIMEOUT' || val.status === 'OTHER_ERROR') {
	// 				if (val.type === type) {
	// 					valLength++
	// 				}
	// 			}
	// 		})
	// 	}

	// 	return valLength
	// }

	const legendClickHandler = (label) => {
		let path = `/site/${sid}/links`;

		linksChartContents.forEach((item, index) => {
			if (label === item.label && item.filter !== "")
				path += path.includes("?") ? `&${item.filter}` : `?${item.filter}`;
		});

		router.push("/site/[siteId]/links", path);
	};

	const chartSeries = [
		// setBrokenLinks('PAGE'),
		// setBrokenLinks('EXTERNAL'),
		statsData && statsData.num_non_ok_links !== undefined ? statsData.num_non_ok_links : 0,
		statsData && statsData.num_ok_links !== undefined ? statsData.num_ok_links : 0,
	];

	const chartOptions = {
		chart: {
			id: "linkStatus",
			type: "donut",
			events: {
				legendClick: function (chartContext, seriesIndex, config) {
					legendClickHandler(config.config.labels[seriesIndex]);
				},
			},
		},
		labels: linksChartContents.map((item) => item.label),
		colors: linksChartContents.map((item) => item.color),
		fill: {
			colors: linksChartContents.map((item) => item.color),
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
							label: "Link Errors",
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
		<SitesLinksStatsDiv>
			<div tw="bg-white overflow-hidden ring-1 ring-black ring-opacity-5 rounded-lg h-full">
				<div tw="flex justify-between py-8 px-5">
					<div tw="flex items-center">
						<LinksSvg className={tw`w-5 h-5 text-gray-900 mr-2`} />
						<h2 tw="text-lg font-bold leading-7 text-gray-900">{LinksStatsLabel[0].label}</h2>
					</div>
					<div>
						<Link href="/site/[siteId]/links" as={`/site/${sid}/links`} passHref>
							<a tw="text-sm leading-5 font-medium text-gray-500 hover:underline">{LinksStatsLabel[1].label}</a>
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
		</SitesLinksStatsDiv>
	);
};

SitesLinksStats.propTypes = {};

export default withResizeDetector(SitesLinksStats);
