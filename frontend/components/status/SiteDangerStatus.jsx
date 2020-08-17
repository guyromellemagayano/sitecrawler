import styled from 'styled-components'

const SiteSuccessStatusDiv = styled.span``

const SiteSuccessStatus = props => {
	return (
		<SiteSuccessStatusDiv
      className={`inline-flex items-center text-sm leading-5 font-semibold rounded-full text-red-800`}
    >
			<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className={`check-circle w-6 h-6 mr-2`}>
				<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
			</svg>
      {props.text}
    </SiteSuccessStatusDiv>
	)
}

export default SiteSuccessStatus