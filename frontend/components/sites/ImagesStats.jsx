import Link from 'next/link'
import fetch from 'node-fetch'
import useSWR from 'swr'
import Cookies from 'js-cookie'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Skeleton from 'react-loading-skeleton'

const SitesImagesStatsDiv = styled.div``

const SitesImagesStats = props => {
	return (
		<SitesImagesStatsDiv>
			<div className={`bg-white overflow-hidden shadow-xs rounded-lg`}>
				<div className={`flex justify-between px-4 py-5 mb-5 sm:p-6`}>
					<div className="flex items-center">
						<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" class="search w-5 h-5 text-gray-900 mr-2">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
						</svg>
						<h2 className={`text-lg font-bold leading-7 text-gray-900`}>Images</h2>
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
		</SitesImagesStatsDiv>
	)
}

export default SitesImagesStats