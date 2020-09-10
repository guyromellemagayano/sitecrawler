import Link from 'next/link'
import fetch from 'node-fetch'
import useSWR from 'swr'
import Cookies from 'js-cookie'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Skeleton from 'react-loading-skeleton'
import loadable from '@loadable/component'
const Chart = loadable(() => import('react-apexcharts'));
import Router, { useRouter } from "next/router";
import { seoChartContents } from '../../enum/chartContents';
// const ApexCharts = loadable(() => import('apexcharts'));

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

const SitesSeoStatsDiv = styled.div`
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
  .skeleton-wrapper {
    margin-bottom: 20px;
  }
`

const SitesSeoStats = props => {
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

  const legendClickHandler = (label) => {
    console.log('[label]', label)
    let path = `/dashboard/site/${props.url.siteId}/seo`

    seoChartContents.forEach((item, index) => {
      if(label === item.label && item.filter !== '')
        path += path.includes('?') ? `&${item.filter}=false` : `?${item.filter}=false`
    })

    Router.push("/dashboard/site/[siteId]/seo", path);
  }

  const chartSeries = [
    (stats && stats.num_pages_without_title) !== undefined ? stats && stats.num_pages_without_title : 0,
    (stats && stats.num_pages_without_description) !== undefined ? stats && stats.num_pages_without_description : 0,
    (stats && stats.num_pages_without_h1_first) !== undefined ? stats && (stats.num_pages_without_h1_first) : 0,
    (stats && stats.num_pages_without_h2_first) !== undefined ? stats && (stats.num_pages_without_h2_first) : 0,
    (stats && stats.num_pages_seo_ok) !== undefined ? stats && stats.num_pages_seo_ok : 0
  ]

  const chartOptions = {
    chart: {
      id: 'seoStatus',
      type: 'donut',
      events: {
        legendClick: function(chartContext, seriesIndex, config) {
          legendClickHandler(config.config.labels[seriesIndex])
        }
      }
    },
    labels: seoChartContents.map((item) => {
      return item.label
    }),
    colors: ['#f56565', '#e53e3e', '#c53030', '#9b2c2c', '#48bb78'],
    fill: {
      colors: ['#f56565', '#e53e3e', '#c53030', '#9b2c2c', '#48bb78']
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
                for(let i=0; i<val.config.series.slice(0, -1).length; i++) {
                  num_errs += val.config.series[i]
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

  { statsError && <Layout>{statsError.message}</Layout> }
  { scanError && <Layout>{scanError.message}</Layout> }

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
            <h2 className={`text-lg font-bold leading-7 text-gray-900`}>SEO</h2>
          </div>
          <div>
            <Link
              href={`/dashboard/site/[siteId]/seo`}
              as={`/dashboard/site/${props.url.siteId}/seo`}
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
    </SitesSeoStatsDiv>
  )
}

export default SitesSeoStats

