// React
import * as React from "react";

// NextJS
import { useRouter } from "next/router";
import Link from "next/link";

// External
import "twin.macro";
import { LinkIcon } from "@heroicons/react/outline";
import { withResizeDetector } from "react-resize-detector";
import loadable from "@loadable/component";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";

// JSON
import LinksStatsLabel from "public/labels/components/sites/LinksStats.json";

// Enums
import { linksChartContents } from "src/enums/chartContents";

// Components
const Chart = loadable(() => import("react-apexcharts"));

const SitesLinksStats = ({ width, sid, stats, scanResult }) => {
	const [componentReady, setComponentReady] = React.useState(false);

	let lgScreenBreakpoint = 1024;

	const router = useRouter();

	React.useEffect(() => {
		stats
			? (() => {
					setComponentReady(false);

					setTimeout(() => {
						setComponentReady(true);
					}, 500);
			  })()
			: null;
	}, [stats]);

	const legendClickHandler = (label) => {
		let path = `/site/${sid}/links`;

		linksChartContents.forEach((item) => {
			if (label === item.label && item.filter !== "")
				path += path.includes("?") ? `&${item.filter}` : `?${item.filter}`;
		});

		router.push("/site/[siteId]/links", path, { shallow: true });
	};

	const chartSeries = [
		stats?.num_non_ok_links ? stats.num_non_ok_links : 0,
		stats?.num_ok_links ? stats.num_ok_links : 0
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
		labels: linksChartContents.map((item) => item.label),
		colors: linksChartContents.map((item) => item.color),
		fill: {
			colors: linksChartContents.map((item) => item.color)
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
							label: "Link Errors",
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
		<div>
			<div tw="bg-white overflow-hidden rounded-lg h-full border">
				<div tw="flex justify-between py-8 px-5">
					<div tw="flex items-center">
						{componentReady ? (
							<LinkIcon tw="w-5 h-5 text-gray-900 mr-2" />
						) : (
							<span tw="w-6 h-6 mr-2">
								<Skeleton duration={2} width={15} height={15} />
							</span>
						)}
						<h2 tw="text-lg font-bold leading-7 text-gray-900">
							{componentReady ? LinksStatsLabel[0].label : <Skeleton duration={2} width={100} height={15} />}
						</h2>
					</div>
					<div>
						{componentReady ? (
							<Link href="/site/[siteId]/links" as={`/site/${sid}/links`} passHref>
								<a tw="text-sm leading-5 font-medium text-gray-500 hover:underline">{LinksStatsLabel[1].label}</a>
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
						<div tw="flex flex-col items-start" className="h-530">
							<Skeleton circle={true} duration={2} width={208.23} height={208.23} className="mt-6 block" />
							<div tw="flex flex-col space-y-3 mt-8">
								{[...Array(2)].map((value, key) => (
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
		</div>
	);
};

SitesLinksStats.propTypes = {};

export default withResizeDetector(SitesLinksStats);
