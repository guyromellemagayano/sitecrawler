import Link from 'next/link'
import fetch from 'node-fetch'
import useSWR from 'swr'
import Cookies from 'js-cookie'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Skeleton from 'react-loading-skeleton'
import loadable from '@loadable/component'
const Chart = loadable(() => import('react-apexcharts'));

const fetcher = async (url) => {
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'X-CSRFToken': Cookies.get('csrftoken'),
    },
  })

  const data = await res.json()

  if (res.status !== 200) {
    throw new Error(data.message)
  }

  return data
}

const SitesLinksStatsDiv = styled.div`
	.status-indicator {
		display: block;
		flex: 0 0 0.85rem;
		max-width: 0.85rem;
		height: 0.85rem;
		border-radius: 50%;

		&.error {
			&-1 {
				background-color: #19B080;
			}
			&-2 {
				background-color: #EF2917;
			}
			&-3 {
				background-color: #ED5244;
			}
			&-4 {
				background-color: #BB4338;
			}
		}
	}
	.apexcharts-legend {
		display: block;
	}
	.apexcharts-legend-series {
		display: flex;
		align-items: center;
		border-bottom: 1px solid #E7EFEF;
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
		color: #1D2626;
		font-weight: 600;
	}
	.legend-text {
		margin-right: 10px;
	}
`

const SitesLinksStats = props => {
	const {
		data: scan,
		error: scanError,
	} = useSWR(() => (props.url.siteId ? `/api/site/${props.url.siteId}/scan/?ordering=-finished_at` : null), fetcher, {
		refreshInterval: 1000,
	})

	let scanObjId = ""

  	if (scan) {
		let scanObj = []

		scan.results.map((val) => {
			scanObj.push(val)
			return scanObj
		})

		scanObj.map((val, index) => {
			if(index == 0) scanObjId = val.id
			
			return scanObjId
		})
	}
	
	const { data: stats, error: statsError } = useSWR(
    () =>
      props.url.siteId && scanObjId
        ? `/api/site/${props.url.siteId}/scan/${scanObjId}/`
        : null,
    fetcher, {
      refreshInterval: 1000,
    }
	)

	const { data: links, error: linksError } = useSWR(
		() => 
			props.url.siteId && scanObjId
				? `/api/site/${props.url.siteId}/scan/${scanObjId}/link/`
				: null,
		fetcher, {
			refreshInterval: 1000
		}
	)

	{statsError && <Layout>{statsError.message}</Layout>}
	{scanError && <Layout>{scanError.message}</Layout>}
	{linksError && <Layout>{linksError.message}</Layout>}

	const setBrokenLinks = type => {
		let valLength = 0

		if (links) {
			links.results.map((val, key) => {
				if ((val.status === 'HTTP_ERROR' || val.status === 'TIMEOUT' || val.status === 'OTHER_ERROR') && val.type === type) {
					valLength++
				}
			})
		}

		return valLength
	}

	const chartSeries = [
		(stats && stats.num_ok_links) !== undefined ? stats && stats.num_ok_links : 0,
		setBrokenLinks('INTERNAL'),
		setBrokenLinks('EXTERNAL')
	]
	
	const chartOptions = {
		chart: {
			type: 'donut'
		},
		labels: ['No Issues', 'Broken Internal Links', 'Broken External Links'],
		colors: ['#19B080', '#EF2917', '#ED5244'],
		fill: {
			colors: ['#19B080', '#EF2917', '#ED5244']
		},
		stroke: {
			width: 0
		},
		dataLabels: {
			enabled: true,
			formatter: function (val, opts) {
				return opts.w.config.series[opts.seriesIndex]
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
			formatter: function(seriesName, opts) {
				return [`<span class='legend-text'>${seriesName}</span>`, "   ", `<span class='legend-val'>${opts.w.globals.series[opts.seriesIndex]}</span>`]
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
					label: "Errors",
					fontSize: "15px",
					color: "#2A324B",
					formatter: function (val) {
						let num_errs = 0
						for(let i=0; i<val.config.series.length; i++) {
							if(i != 0) num_errs += val.config.series[i]
						}

						return num_errs
					}
				}
				}
			}
			}
		},
		responsive: [{
			breakpoint: 480,
			options: {
				chart: {
					width: 400
				},
				legend: {
					position: 'bottom'
				}
			}
		}]
	}
	
	return (
    <SitesLinksStatsDiv>
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
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              ></path>
            </svg>
            <h2 className={`text-lg font-bold leading-7 text-gray-900`}>Links</h2>
          </div>
          <div>
            <Link
              href={`/dashboard/site/[siteId]/links`}
              as={`/dashboard/site/${props.url.siteId}/links`}
            >
              <a
                className={`text-sm leading-5 font-medium text-gray-500 hover:underline`}
              >
                Details
              </a>
            </Link>
          </div>
        </div>
        <div className={`flex justify-center`}>
			<Chart options={chartOptions} series={chartSeries} type="donut" height="530" />
		</div>
      </div>
    </SitesLinksStatsDiv>
  )
}

export default SitesLinksStats