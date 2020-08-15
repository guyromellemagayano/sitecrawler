import styled from 'styled-components'

const SiteSuccessStatusDiv = styled.span``

const SiteSuccessStatus = props => {
	return (
		<SiteSuccessStatusDiv
      className={`inline-flex items-center text-sm leading-5 font-semibold rounded-full text-yellow-800`}
    >
			<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" class="check-circle w-6 h-6 mr-2">
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
			</svg>
      {props.text}
    </SiteSuccessStatusDiv>
	)
}

export default SiteSuccessStatus