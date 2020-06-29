import styled from "styled-components"

const SiteDangerBadgeDiv = styled.span``

const SiteDangerBadge = props => {
  return (
    <SiteDangerBadgeDiv
      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800`}
    >
      {props.text}
    </SiteDangerBadgeDiv>
  )
}

export default SiteDangerBadge
