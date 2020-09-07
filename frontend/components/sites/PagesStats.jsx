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

const SitesPagesStatsDiv = styled.div`
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
  .legent-text {
    margin-right: 10px;
  }
  .skeleton-wrapper {
    margin-bottom: 20px;
  }
`

const SitesPagesStats = props => {
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
  
  // const chartSeries = [
  //   (stats && stats.num_pages) !== undefined ? stats && stats.num_pages : 0,
  //   (stats && stats.num_pages_big) !== undefined ? stats && stats.num_pages_big : 0,
  //   0,
  //   0
  // ]

  const chartSeries = [
    (stats && stats.num_pages) !== undefined ? stats && stats.num_pages : 0,
    (stats && stats.num_pages_big) !== undefined ? stats && stats.num_pages_big : 0,
    0
  ]

  const chartOptions = {
    chart: {
      type: 'donut',
    },
    // labels: ['No Issues', 'Large Page Size', 'Broken Security', 'Not on Google'],
    // colors: ['#19B080', '#EF2917', '#ED5244', '#BB4338'],
    // fill: {
    //   colors: ['#19B080', '#EF2917', '#ED5244', '#BB4338']
    // },
    labels: ['Large Page Size', 'Broken Security', 'No Issues'],
    colors: ['#EF2917', '#ED5244', '#19B080'],
    fill: {
      colors: ['#EF2917', '#ED5244', '#19B080']
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

	{statsError && <Layout>{statsError.message}</Layout>}
  {scanError && <Layout>{scanError.message}</Layout>}
	
	return (
    <SitesPagesStatsDiv>
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
                d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
              ></path>
            </svg>
            <h2 className={`text-lg font-bold leading-7 text-gray-900`}>Pages</h2>
          </div>
          <div>
            <Link
              href={`/dashboard/site/[siteId]/pages`}
              as={`/dashboard/site/${props.url.siteId}/pages`}
            >
              <a
                className={`text-sm leading-5 font-medium text-gray-500 hover:underline`}
              >
                Details
              </a>
            </Link>
          </div>
        </div>
        <div className={`flex justify-center items-center flex-col`}>
          {
            stats == undefined ? (
              <div className={`skeleton-wrapper`}>
                <Skeleton circle={true} duration={2} width={240} height={240} />
                <br />
                <br />
                <Skeleton duration={2} width={240} height={190} />
              </div>
            ) : <Chart options={chartOptions} series={chartSeries} type="donut" height="530" />
          }
				</div>
      </div>
    </SitesPagesStatsDiv>
  )
}

export default SitesPagesStats