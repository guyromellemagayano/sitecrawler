import styled from "styled-components"

const SiteWarningBadgeDiv = styled.span``

const SiteWarningBadge = props => {
  return (
    <SiteWarningBadgeDiv
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800`}
    >
      {props.text}
    </SiteWarningBadgeDiv>
  )
}

export default SiteWarningBadge
