import Link from 'next/link'
import fetch from 'node-fetch'
import useSWR from 'swr'
import Cookies from 'js-cookie'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Skeleton from 'react-loading-skeleton'

const SitesLinksStatsDiv = styled.div``

const SitesLinksStats = props => {
	return (
		<SitesLinksStatsDiv>
			<div className={`bg-white overflow-hidden shadow-xs rounded-lg`}>
				<div className={`flex justify-between px-4 py-5 mb-5 sm:p-6`}>
					<div className="flex items-center">
						<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" class="search w-5 h-5 text-gray-900 mr-2">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
						</svg>
						<h2 className={`text-lg font-bold leading-7 text-gray-900`}>Links</h2>
					</div>
					<div>
						<Link href={``} as={``}>
							<a className={`text-sm leading-5 font-medium text-gray-500 hover:underline`}>
								Details
							</a>
						</Link>
					</div>
				</div>
				<div className="flex justify-center">
				</div>
			</div>
		</SitesLinksStatsDiv>
	)
}

export default SitesLinksStats