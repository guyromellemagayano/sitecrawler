// React
import * as React from "react";

// NextJS
import { useRouter } from "next/router";
import Link from "next/link";

// External
import { PhotographIcon } from "@heroicons/react/solid";
import { styled } from "twin.macro";
import { withResizeDetector } from "react-resize-detector";
import loadable from "@loadable/component";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";

// JSON
import ImagesStatsLabel from "public/labels/components/sites/ImagesStats.json";

// Enums
import { imagesChartContents } from "src/enums/chartContents";

// Components
const Chart = loadable(() => import("react-apexcharts"));

const SitesImagesStatsDiv = styled.div`
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
		outline: none;
		-webkit-tap-highlight-color: transparent;
		cursor: pointer;
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

const SitesImagesStats = ({ width, sid, stats, scanResult }) => {
	const [componentReady, setComponentReady] = React.useState(false);

	let lgScreenBreakpoint = 1024;

	const router = useRouter();

	React.useEffect(() => {
		stats
			? (async () => {
					setComponentReady(false);

					setTimeout(() => {
						setComponentReady(true);
					}, 500);
			  })()
			: null;
	}, [stats]);

	const legendClickHandler = (label) => {
		let path = `/site/${sid}/images`;

		imagesChartContents.forEach((item) => {
			if (label === item.label && item.filter !== "")
				path += path.includes("?") ? `&${item.filter}` : `?${item.filter}`;
		});

		router.push("/site/[siteId]/images", path, { shallow: true });
	};

	const chartSeries = [
		stats?.num_non_ok_images ? stats.num_non_ok_images : 0,
		stats?.num_images_tls_non_ok ? stats.num_images_tls_non_ok : 0,
		stats?.num_images_with_missing_alts ? stats.num_images_with_missing_alts : 0,
		stats?.num_images_fully_ok ? stats.num_images_fully_ok : 0
	];

	const chartOptions = {
		chart: {
			id: "linkStatus",
			type: "donut",
			events: {
				legendClick: function (chartContext, seriesIndex, config) {
					legendClickHandler(config.config.labels[seriesIndex]);
				}
			}
		},
		labels: imagesChartContents.map((item) => item.label),
		colors: imagesChartContents.map((item) => item.color),
		fill: {
			colors: imagesChartContents.map((item) => item.color)
		},
		stroke: {
			width: 0
		},
		dataLabels: {
			enabled: true,
			formatter: function (val, opts) {
				return opts.w.globals.series[opts.seriesIndex];
			}
		},
		legend: {
			show: true,
			fontSize: "14px",
			position: "bottom",
			horizontalAlign: "center",
			height: 210,
			itemMargin: {
				horizontal: 15,
				vertical: 10
			},
			formatter: function (seriesName, opts) {
				return [
					`<span className='legend-text'>${seriesName}</span>`,
					"   ",
					`<span className='legend-val'>${opts.w.globals.series[opts.seriesIndex]}</span>`
				];
			}
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
							label: "Image Errors",
							fontSize: "15px",
							color: "#2A324B",
							formatter: function (val) {
								return val.globals.seriesTotals.slice(0, -1).reduce((a, b) => {
									return a + b;
								}, 0);
							}
						}
					}
				}
			}
		},
		responsive: [
			{
				breakpoint: 320,
				options: {
					chart: {
						width: 420,
						height: "auto"
					},
					legend: {
						position: "bottom",
						width: 315,
						height: "auto",
						itemMargin: {
							horizontal: 25,
							vertical: 10
						}
					}
				}
			}
		]
	};

	return (
		<SitesImagesStatsDiv>
			<div tw="bg-white overflow-hidden rounded-lg h-full border">
				<div tw="flex justify-between py-8 px-5">
					<div tw="flex items-center">
						{componentReady ? (
							<PhotographIcon tw="w-5 h-5 text-gray-900 mr-2" />
						) : (
							<span tw="w-6 h-6 mr-2">
								<Skeleton duration={2} width={15} height={15} />
							</span>
						)}
						<h2 tw="text-lg font-bold leading-7 text-gray-900">
							{componentReady ? ImagesStatsLabel[0].label : <Skeleton duration={2} width={100} height={15} />}
						</h2>
					</div>
					<div>
						{componentReady ? (
							<Link href="/site/[siteId]/images" as={`/site/${sid}/images`} replace>
								<a tw="text-sm leading-5 font-medium text-gray-500 hover:underline">{ImagesStatsLabel[1].label}</a>
							</Link>
						) : (
							<span tw="leading-5">
								<Skeleton duration={2} width={75} height={15} />
							</span>
						)}
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
						<div tw="flex flex-col items-start h-530">
							<Skeleton circle={true} duration={2} width={208.23} height={208.23} className="mt-6 block" />
							<div tw="flex flex-col space-y-3 mt-8">
								{[...Array(4)].map((value, key) => (
									<span key={key} tw="space-x-3">
										<Skeleton circle={true} width={20} height={20} />
										<Skeleton width={150} height={20} />
										<Skeleton width={20} height={20} />
									</span>
								))}
							</div>
						</div>
					)}
				</div>
			</div>
		</SitesImagesStatsDiv>
	);
};

SitesImagesStats.propTypes = {};

export default withResizeDetector(SitesImagesStats);
