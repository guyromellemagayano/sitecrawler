import Link from 'next/link'
import fetch from 'node-fetch'
import useSWR from 'swr'
import Cookies from 'js-cookie'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Skeleton from 'react-loading-skeleton'

const SitesPagesStatsDiv = styled.div``

const SitesPagesStats = props => {
	return (
		<SitesPagesStatsDiv>
			<div className={`bg-white overflow-hidden shadow-xs rounded-lg`}>
				<div className={`flex justify-between px-4 py-5 mb-5 sm:p-6`}>
					<div className="flex items-center">
						<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={`search w-5 h-5 text-gray-900 mr-2`}>
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"></path>
						</svg>
						<h2 className={`text-lg font-bold leading-7 text-gray-900`}>Pages</h2>
					</div>
					<div>
						<Link href={`/dashboard/site/[siteId]/pages`} as={`/dashboard/site/${props.url.siteId}/pages`}>
							<a className={`text-sm leading-5 font-medium text-gray-500 hover:underline`}>
								Details
							</a>
						</Link>
					</div>
				</div>
				<div className="flex justify-center">
				</div>
			</div>
		</SitesPagesStatsDiv>
	)
}

export default SitesPagesStats

