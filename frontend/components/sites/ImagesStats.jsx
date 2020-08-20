import Link from 'next/link'
import fetch from 'node-fetch'
import useSWR from 'swr'
import Cookies from 'js-cookie'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Skeleton from 'react-loading-skeleton'
import { RadialChart, makeVisFlexible } from 'react-vis';

const FlexRadialChart=makeVisFlexible(RadialChart)

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

const SitesImagesStatsDiv = styled.div`
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
			&-5 {
				background-color: #D8E7E9;
			}
		}
  }
  .stats-graph {
		height: 220px;
  }
  .rv-xy-plot__series--label {
    fill: #fff;
  }
`

const SitesImagesStats = props => {
	const {
		data: scan,
		error: scanError,
	} = useSWR(() => (props.url.siteId ? `/api/site/${props.url.siteId}/scan/` : null), fetcher, {
		refreshInterval: 1000,
	})

	let scanObjId = ""

  if (scan) {
    let scanObj = []

    scan.results.map((val) => {
      scanObj.push(val)
      return scanObj
    })

    scanObj.map((val) => {
      scanObjId = val.id
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

	const data = [
    {
      "title": "No Issues",
      "count": stats && stats.num_ok_images,
      "class": `error-1`,
		},
		{
      "title": "Broken Images",
      "count": stats && stats.num_non_ok_images,
      "class": `error-2`,
		},
		{
      "title": "Broken Image Links",
      "count": stats && stats.num_non_ok_images,
      "class": `error-3`,
		},
		{
      "title": "Unlinked Images",
      "count": 0,
      "class": `error-4`,
		},
		{
      "title": "No Alt Text",
      "count": 0,
      "class": `error-5`,
		},
  ]
  
	const chartData = [
		{
		  angle: stats && stats.num_ok_images,
		  label: (stats && stats.num_ok_images) !== undefined ? (stats && stats.num_ok_images).toString() : 0,
		  color: "#19B080",
		  radius: 1
		},
		{
		  angle: stats && stats.num_non_ok_images,
		  label: (stats && stats.num_non_ok_images) !== undefined ? (stats && stats.num_non_ok_images).toString() : 0,
		  color: "#EF2917",
		  radius: 1
		},
		{
		  angle: stats && stats.num_non_ok_images,
		  label: (stats && stats.num_non_ok_images) !== undefined ? (stats && stats.num_non_ok_images).toString() : 0,
		  color: "#ED5244",
		  radius: 1.3
		},
		{
		  angle: 0,
		  label: "0",
		  color: "#BB4338",
		  radius: 1.3
		},
		{
		  angle: 0,
		  label: "0",
		  color: "#D8E7E9",
		  radius: 1.3
		}
	]

  const totalErrors = (stats && stats.num_non_ok_images) +
                      (stats && stats.num_non_ok_images) +
                      0 +
                      0

	{statsError && <Layout>{statsError.message}</Layout>}
  {scanError && <Layout>{scanError.message}</Layout>}
	
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
            <h2 className={`text-lg font-bold leading-7 text-gray-900`}>Images</h2>
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
					<div className={`w-full grid gap-4 grid-cols-1 p-5`}>
            <div className={`stats-graph flex items-center justify-center`}>
							<FlexRadialChart
                animation={true}
								innerRadius={60}
								radius={95}
								showLabels={true}
								data={chartData}
								colorType="literal"
								style={
								{color: '#fff'}
								}
							/>
							<div className={`absolute p-1 text-center`}>
								<h3 className={`text-2xl font-semibold`}>{totalErrors}</h3>
								<p className={`text-sm font-semibold`}>Errors</p>
							</div>
						</div>
						<div className={`stats-details flex items-start justify-between`}>
							<ul className={`w-full block divide-y divide-gray-400`}>
								{data.map((val, key) => {
									return (
										<li key={key} className={`flex flex-row flex-wrap justify-between items-center py-3`}>
											<div className="flex flex-grow items-center">
												<span className={`status-indicator ${val.class} mr-3`}></span>
												<span className={`status-label text-sm`}>{val.title}</span>
											</div>
											<span className="status-count font-medium">{val.count}</span>
										</li>
									)
								})}
							</ul>
						</div>
					</div>
				</div>
      </div>
    </SitesImagesStatsDiv>
  )
}

export default SitesImagesStats