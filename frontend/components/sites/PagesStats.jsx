import Link from 'next/link'
import fetch from 'node-fetch'
import useSWR from 'swr'
import Cookies from 'js-cookie'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Skeleton from 'react-loading-skeleton'

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
`

const SitesPagesStats = props => {
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
      "count": stats && stats.num_pages,
      "class": `error-1`,
		},
		{
      "title": "Large Page Size",
      "count": stats && stats.num_pages_big,
      "class": `error-2`,
		},
		{
      "title": "Broken Security",
      "count": 0,
      "class": `error-3`,
		},
		{
      "title": "Not on Google",
      "count": 0,
      "class": `error-4`,
		},
	]

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
        <div className={`flex justify-center`}>
					<div className={`w-full grid gap-4 grid-cols-1 p-5`}>
						<div className={`stats-graph`}>
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
    </SitesPagesStatsDiv>
  )
}

export default SitesPagesStats