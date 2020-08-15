import Link from 'next/link'
import fetch from 'node-fetch'
import useSWR from 'swr'
import Cookies from 'js-cookie'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import Skeleton from 'react-loading-skeleton'

const SitesSeoStatsDiv = styled.div``

const SitesSeoStats = props => {
	return (
		<SitesSeoStatsDiv>
			<div className={`bg-white overflow-hidden shadow-xs rounded-lg`}>
				<div className={`flex justify-between px-4 py-5 mb-5 sm:p-6`}>
					<div className="flex items-center">
						<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" class="search w-5 h-5 text-gray-900 mr-2">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
						</svg>
						<h2 className={`text-lg font-bold leading-7 text-gray-900`}>SEO</h2>
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
		</SitesSeoStatsDiv>
	)
}

export default SitesSeoStats

