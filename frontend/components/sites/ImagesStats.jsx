import Link from "next/link";
import fetch from "node-fetch";
import useSWR from "swr";
import Cookies from "js-cookie";
import styled from "styled-components";
import PropTypes from "prop-types";
import Layout from "components/Layout";
import Skeleton from "react-loading-skeleton";
import loadable from "@loadable/component";
const Chart = loadable(() => import("react-apexcharts"));
import Router from "next/router";
import { imagesChartContents } from "enum/chartContents";

const fetcher = async (url) => {
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRFToken": Cookies.get("csrftoken"),
    },
  });

  const data = await res.json();

  if (res.status !== 200) {
    throw new Error(data.message);
  }

  return data;
};

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
        background-color: #d8e7e9;
      }
    }
  }
  .apexcharts-legend {
    display: block;
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
  .legent-text {
    margin-right: 10px;
  }
  .skeleton-wrapper {
    margin-bottom: 20px;
  }
`;

const SitesImagesStats = (props) => {
  const { data: scan, error: scanError } = useSWR(
    () =>
      props.url.siteId
        ? `/api/site/${props.url.siteId}/scan/?ordering=-finished_at`
        : null,
    fetcher,
    {
      refreshInterval: 1000,
    }
  );

  let scanObjId = "";

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
    fetcher,
    {
      refreshInterval: 1000,
    }
  );

  const { data: images, error: imagesError } = useSWR(
    () =>
      props.url.siteId && scanObjId
        ? `/api/site/${props.url.siteId}/scan/${scanObjId}/image/?tls_status=NONE&tls_status=ERROR`
        : null,
    fetcher,
    {
      refreshInterval: 1000,
    }
  );

  const legendClickHandler = (label) => {
    let path = `/dashboard/site/${props.url.siteId}/images`;

    imagesChartContents.forEach((item, index) => {
      if (label === item.label && item.filter !== "")
        path += path.includes("?") ? `&${item.filter}` : `?${item.filter}`;
    });

    Router.push("/dashboard/site/[siteId]/images", path);
  };

  const chartSeries = [
    stats && stats.num_non_ok_images !== undefined
      ? stats && stats.num_non_ok_images
      : 0,
    images && images.count !== undefined 
      ? images && images.count
      : 0,
    stats && stats.num_ok_images !== undefined
      ? stats && stats.num_ok_images
      : 0
  ];

  const chartOptions = {
    chart: {
      type: "donut",
      events: {
        legendClick: function (chartContext, seriesIndex, config) {
          legendClickHandler(config.config.labels[seriesIndex]);
        },
      },
    },
    // labels: ['No Issues', 'Broken Images', 'Broken Image Links', 'Unlinked Images', 'No Alt Text'],
    // colors: ['#19B080', '#EF2917', '#ED5244', '#BB4338', '#D8E7E9'],
    // fill: {
    //   colors: ['#19B080', '#EF2917', '#ED5244', '#BB4338', '#D8E7E9']
    // },
    labels: imagesChartContents.map((item) => item.label),
    colors: imagesChartContents.map((item) => item.color),
    fill: {
      colors: imagesChartContents.map((item) => item.color),
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
          `<span class='legend-text'>${seriesName}</span>`,
          "   ",
          `<span class='legend-val'>${
            opts.w.globals.series[opts.seriesIndex]
          }</span>`,
        ];
      },
    },
    plotOptions: {
      pie: {
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
                let num_errs = 0;
                for (
                  let i = 0;
                  i < val.config.series.slice(0, -1).length;
                  i++
                ) {
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
        breakpoint: 480,
        options: {
          chart: {
            width: 400,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };

  {
    statsError && <Layout>{statsError.message}</Layout>;
  }
  {
    scanError && <Layout>{scanError.message}</Layout>;
  }
  {
    imagesError && <Layout>{imagesError.message}</Layout>;
  }

  return (
    <SitesImagesStatsDiv>
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
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              ></path>
            </svg>
            <h2 className={`text-lg font-bold leading-7 text-gray-900`}>
              Images
            </h2>
          </div>
          <div>
            <Link
              href={`/dashboard/site/[siteId]/images`}
              as={`/dashboard/site/${props.url.siteId}/images`}
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
              height="530"
            />
          )}
        </div>
      </div>
    </SitesImagesStatsDiv>
  );
};

export default SitesImagesStats;
