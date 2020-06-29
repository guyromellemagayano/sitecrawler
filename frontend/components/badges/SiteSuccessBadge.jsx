import styled from "styled-components"

const SiteSuccessBadgeDiv = styled.span``

const SiteSuccessBadge = props => {
  return (
    <SiteSuccessBadgeDiv
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800`}
    >
      {props.text}
    </SiteSuccessBadgeDiv>
  )
}

export default SiteSuccessBadge
