const Chart = loadable(() => import('react-apexcharts'));
import { seoChartContents } from 'enum/chartContents';
// FIXME: Remove react-responsive package in favor of react-resize-detector
import { useMediaQuery } from 'react-responsive';
import Cookies from 'js-cookie';
import fetch from 'node-fetch';
import Link from 'next/link';
import loadable from '@loadable/component';
import PropTypes from 'prop-types';
import Router from 'next/router';
import SeoStatsLabel from 'public/label/components/sites/SeoStats.json';
import Skeleton from 'react-loading-skeleton';
import styled from 'styled-components';
import useSWR from 'swr';

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

const SitesSeoStatsDiv = styled.div`
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
		@media only screen and (min-width: 1281px) {
			max-width: 45%;
		}
		@media only screen and (min-width: 1400px) {
			max-width: 85%;
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
	.skeleton-wrapper {
		margin-bottom: 20px;
	}
`;

const SitesSeoStats = (props) => {
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

	const legendClickHandler = (label) => {
		let path = `/dashboard/site/${props.url.siteId}/seo`;

		seoChartContents.forEach((item, index) => {
			if (label === item.label && item.filter !== '')
				path += path.includes('?') ? `&${item.filter}` : `?${item.filter}`;
		});

		Router.push('/dashboard/site/[siteId]/seo', path);
	};

	const chartSeries = [
		stats && stats.num_pages_without_title !== undefined
			? stats && stats.num_pages_without_title
			: 0,
		stats && stats.num_pages_without_description !== undefined
			? stats && stats.num_pages_without_description
			: 0,
		stats && stats.num_pages_without_h1_first !== undefined
			? stats && stats.num_pages_without_h1_first
			: 0,
		stats && stats.num_pages_without_h2_first !== undefined
			? stats && stats.num_pages_without_h2_first
			: 0,
		stats && stats.num_pages_seo_ok !== undefined
			? stats && stats.num_pages_seo_ok
			: 0
	];

	const chartOptions = {
		chart: {
			id: 'seoStats',
			type: 'donut',
			events: {
				legendClick: function (chartContext, seriesIndex, config) {
					legendClickHandler(config.config.labels[seriesIndex]);
				}
			}
		},
		labels: seoChartContents.map((item) => item.label),
		colors: seoChartContents.map((item) => item.color),
		fill: {
			colors: seoChartContents.map((item) => item.color)
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
			position: 'bottom',
			horizontalAlign: 'center',
			height: 210,
			itemMargin: {
				horizontal: 15,
				vertical: 10
			},
			formatter: function (seriesName, opts) {
				return [
					`<span class='legend-text'>${seriesName}</span>`,
					'   ',
					`<span class='legend-val'>${
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
							label: 'SEO Errors',
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
				breakpoint: 1281,
				options: {
					chart: {
						width: 615,
						height: 'auto'
					},
					legend: {
						position: 'bottom',
						width: 315,
						height: 'auto',
						itemMargin: {
							horizontal: 25,
							vertical: 10
						}
					}
				}
			}
		]
	};

	{
		statsError && <Layout>{statsError.message}</Layout>;
	}
	{
		scanError && <Layout>{scanError.message}</Layout>;
	}

	return (
		<SitesSeoStatsDiv>
			<div className={`bg-white overflow-hidden shadow-xs rounded-lg`}>
				<div className={`flex justify-between py-8 px-5`}>
					<div className={`flex items-center`}>
						<svg
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							className={`search w-5 h-5 text-gray-900 mr-2`}
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
							></path>
						</svg>
						<h2 className={`text-lg font-bold leading-7 text-gray-900`}>
							{SeoStatsLabel[0].label}
						</h2>
					</div>
					<div>
						<Link
							href={`/dashboard/site/[siteId]/seo`}
							as={`/dashboard/site/${props.url.siteId}/seo`}
						>
							<a
								className={`text-sm leading-5 font-medium text-gray-500 hover:underline`}
							>
								{SeoStatsLabel[1].label}
							</a>
						</Link>
					</div>
				</div>
				<div className={`flex justify-center`}>
					{stats == undefined ? (
						<div className={`skeleton-wrapper`}>
							<Skeleton circle={true} duration={2} width={240} height={240} />
							<br />
							<br />
							<Skeleton duration={2} width={240} height={190} />
						</div>
					) : (
						<Chart
							options={chartOptions}
							series={chartSeries}
							type="donut"
							width={`${isMobileOrDesktop ? '400' : '600'}`}
							height={`${isMobileOrDesktop ? '530' : '530'}`}
						/>
					)}
				</div>
			</div>
		</SitesSeoStatsDiv>
	);
};

export default SitesSeoStats;

SitesSeoStats.propTypes = {};
