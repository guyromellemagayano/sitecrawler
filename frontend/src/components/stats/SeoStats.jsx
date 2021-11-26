// React
// Components
import SeoStatsSkeleton from "@components/skeletons/SeoStatsSkeleton";
import { SeoChartContents } from "@enums/ChartContents";
// Enums
import { LgScreenBreakpoint } from "@enums/GlobalValues";
import { SeoStatsLabels } from "@enums/SeoStatsLabels";
import { SearchIcon } from "@heroicons/react/solid";
// NextJS
import dynamic from "next/dynamic";
import Link from "next/link";
// NextJS
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import Skeleton from "react-loading-skeleton";
import { withResizeDetector } from "react-resize-detector";
// External
import "twin.macro";

// Dynamic
const Chart = dynamic(() => import("react-apexcharts"), { ssr: true });

const SeoStats = ({ componentReady, sid, stats, width }) => {
	const router = useRouter();

	const legendClickHandler = (label) => {
		let path = `/site/${sid}/seo`;

		SeoChartContents.forEach((item, index) => {
			if (label === item.label && item.filter !== "")
				path += path.includes("?") ? `&${item.filter}` : `?${item.filter}`;
		});

		router.push("/site/[siteId]/seo", path, { shallow: true });
	};

	const chartSeries = [
		stats?.num_pages_without_title ? stats.num_pages_without_title : 0,
		stats?.num_pages_without_description ? stats.num_pages_without_description : 0,
		stats?.num_pages_without_h1_first ? stats.num_pages_without_h1_first : 0,
		stats?.num_pages_without_h2_first ? stats.num_pages_without_h2_first : 0,
		stats?.num_pages_seo_ok ? stats.num_pages_seo_ok : 0
	];

	const chartOptions = {
		chart: {
			id: "seoStats",
			type: "donut",
			events: {
				legendClick: function (chartContext, seriesIndex, config) {
					legendClickHandler(config.config.labels[seriesIndex]);
				}
			}
		},
		labels: SeoChartContents.map((item) => item.label),
		colors: SeoChartContents.map((item) => item.color),
		fill: {
			colors: SeoChartContents.map((item) => item.color)
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
							label: "SEO Errors",
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
		<div tw="overflow-hidden rounded-lg h-full border">
			<div tw="flex justify-between py-8 px-5">
				<div tw="flex items-center">
					{componentReady ? (
						<SearchIcon tw="w-5 h-5 text-gray-900 mr-2" />
					) : (
						<span tw="w-6 h-6 mr-2">
							<Skeleton duration={2} width={15} height={15} />
						</span>
					)}
					<h2 tw="text-lg font-bold leading-7 text-gray-900">
						{componentReady ? SeoStatsLabels[0].label : <Skeleton duration={2} width={100} height={15} />}
					</h2>
				</div>
				<div>
					{componentReady ? (
						<Link href="/site/[siteId]/seo" as={`/site/${sid}/seo`} passHref>
							<a tw="text-sm leading-5 font-medium text-gray-500 hover:underline">{SeoStatsLabels[1].label}</a>
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
						width={LgScreenBreakpoint > width ? "400" : "600"}
						height={LgScreenBreakpoint > width ? "530" : "530"}
					/>
				) : (
					<SeoStatsSkeleton />
				)}
			</div>
		</div>
	);
};

SeoStats.propTypes = {
	componentReady: PropTypes.bool,
	sid: PropTypes.number,
	stats: PropTypes.object,
	user: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
	width: PropTypes.number
};

SeoStats.defaultProps = {
	componentReady: false,
	sid: null,
	stats: null,
	user: null,
	width: null
};

export default withResizeDetector(SeoStats);
