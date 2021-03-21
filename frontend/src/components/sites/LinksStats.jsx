const Chart = loadable(() => import('react-apexcharts'));
import { linksChartContents } from 'enum/chartContents';
// FIXME: Remove react-responsive package in favor of react-resize-detector
import { useMediaQuery } from 'react-responsive';
import Cookies from 'js-cookie';
import fetch from 'node-fetch';
import Link from 'next/link';
import LinksStatsLabel from 'public/labels/components/sites/LinksStats.json';
import loadable from '@loadable/component';
import PropTypes from 'prop-types';
import Router from 'next/router';
import Skeleton from 'react-loading-skeleton';
import tw from 'twin.macro';
import useSWR from 'swr';
import Layout from 'components/Layout';

const fetcher = async (url) => {
	const res = await fetch(url, {
		method: 'GET',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json',
			'X-CSRFToken': Cookies.get('csrftoken')
		}
	});

	const data = await res.json();

	if (res.status !== 200) {
		throw new Error(data.message);
	}

	return data;
};

const SitesLinksStatsDiv = styled.div`
	height: 100%;
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
		@media only screen and (max-width: 640px) {
			margin-left: auto !important;
			margin-right: auto !important;
		}
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
	.space {
		width: 20px;
	}
	.skeleton-wrapper {
		margin-bottom: 20px;
	}
`;

const SitesLinksStats = (props) => {
	const isMobileOrDesktop = useMediaQuery({
		query: '(min-device-width: 1300px)'
	});

	const { data: scan, error: scanError } = useSWR(
		() =>
			props.url.siteId
				? `/api/site/${props.url.siteId}/scan/?ordering=-finished_at`
				: null,
		fetcher
	);

	let scanObjId = '';

	if (scan) {
		let scanObj = [];

		scan.results.map((val) => {
			scanObj.push(val);
			return scanObj;
		});

		scanObj.map((val, index) => {
			if (index == 0) scanObjId = val.id;

			return scanObjId;
		});
	}

	const { data: stats, error: statsError } = useSWR(
		() =>
			props.url.siteId && scanObjId
				? `/api/site/${props.url.siteId}/scan/${scanObjId}/`
				: null,
		fetcher
	);

	const { data: links, error: linksError } = useSWR(
		() =>
			props.url.siteId && scanObjId
				? `/api/site/${props.url.siteId}/scan/${scanObjId}/link/`
				: null,
		fetcher
	);

	{
		statsError && <Layout>{statsError.message}</Layout>;
	}
	{
		scanError && <Layout>{scanError.message}</Layout>;
	}
	{
		linksError && <Layout>{linksError.message}</Layout>;
	}

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
		let path = `/dashboard/site/${props.url.siteId}/links`;

		linksChartContents.forEach((item, index) => {
			if (label === item.label && item.filter !== '')
				path += path.includes('?') ? `&${item.filter}` : `?${item.filter}`;
		});

		Router.push('/dashboard/site/[siteId]/links', path);
	};

	const chartSeries = [
		// setBrokenLinks('PAGE'),
		// setBrokenLinks('EXTERNAL'),
		stats && stats.num_non_ok_links !== undefined
			? stats && stats.num_non_ok_links
			: 0,
		stats && stats.num_ok_links !== undefined ? stats && stats.num_ok_links : 0
	];

	const chartOptions = {
		chart: {
			id: 'linkStatus',
			type: 'donut',
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
				return opts.w.config.series[opts.seriesIndex];
			}
		},
		legend: {
			show: true,
			fontSize: '14px',
			position: 'right',
			floating: false,
			width: 300,
			horizontalAlign: 'center',
			itemMargin: {
				horizontal: 5,
				vertical: 5
			},
			formatter: function (seriesName, opts) {
				return [
					`<span className='legend-text'>${seriesName}</span>`,
					'   ',
					`<span className='legend-val'>${
						opts.w.globals.series[opts.seriesIndex]
					}</span>`
				];
			}
		},
		plotOptions: {
			pie: {
				donut: {
					labels: {
						show: true,
						total: {
							show: true,
							showAlways: true,
							label: 'Link Errors',
							fontSize: '15px',
							color: '#2A324B',
							formatter: function (val) {
								let num_errs = 0;
								for (
									let i = 0;
									i < val.config.series.slice(0, -1).length;
									i++
								) {
									num_errs += val.config.series[i];
								}

								return num_errs;
							}
						}
					}
				}
			}
		},
		responsive: [
			{
				breakpoint: 1600,
				options: {
					chart: {
						width: 315,
						height: 415
					},
					legend: {
						position: 'bottom',
						height: 'auto',
						itemMargin: {
							horizontal: 15,
							vertical: 10
						}
					}
				}
			}
		]
	};

	return (
		<SitesLinksStatsDiv>
			<div
				className={`bg-white overflow-hidden ring-1 ring-black ring-opacity-5 rounded-lg h-full`}
			>
				<div className={`flex justify-between py-8 px-5`}>
					<div className={`flex items-center`}>
						<svg
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'
							className={`search w-5 h-5 text-gray-900 mr-2`}
						>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								strokeWidth='2'
								d='M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1'
							></path>
						</svg>
						<h2 className={`text-lg font-bold leading-7 text-gray-900`}>
							{LinksStatsLabel[0].label}
						</h2>
					</div>
					<div>
						<Link
							href={`/dashboard/site/[siteId]/links`}
							as={`/dashboard/site/${props.url.siteId}/links`}
						>
							<a
								className={`text-sm leading-5 font-medium text-gray-500 hover:underline`}
							>
								{LinksStatsLabel[1].label}
							</a>
						</Link>
					</div>
				</div>
				<div className={`flex justify-center`}>
					{stats == undefined && scan == undefined && links == undefined ? (
						<div className={`skeleton-wrapper`}>
							<Skeleton circle={true} duration={2} width={240} height={240} />
							<span className={`space`}></span>
							<Skeleton duration={2} width={240} height={240} />
						</div>
					) : (
						<Chart
							options={chartOptions}
							series={chartSeries}
							type='donut'
							width={`${isMobileOrDesktop ? '600' : '300'}`}
							height={`${isMobileOrDesktop ? '260' : '530'}`}
						/>
					)}
				</div>
			</div>
		</SitesLinksStatsDiv>
	);
};

export default SitesLinksStats;

SitesLinksStats.propTypes = {};
