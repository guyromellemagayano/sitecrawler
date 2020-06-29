import styled from 'styled-components'
import NotApplicableSvgIcon from './external/not-applicable.svg'

const SiteDangerIconDiv = styled.span``

const SiteDangerIcon = () => {
	return (
    <SiteDangerIconDiv
			className={`inline-block mt-2 h-5 w-5`}
		>
			<NotApplicableSvgIcon />
    </SiteDangerIconDiv>
  );
}

export default SiteDangerIcon