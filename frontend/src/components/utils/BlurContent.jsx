import { useEffect, useState } from 'react';
import styled from 'styled-components';

const BlurContentDiv = styled.span`
	&.blur-active {
		filter: blur(8px);
	}
	&.blur-inactive {
		filter: blur(0);
	}
`;

const BlurContent = (props) => {
	return (
		<BlurContentDiv
			className={props.enableBlur ? 'blur-active' : 'blur-inactive'}
		>
			{props.content}
		</BlurContentDiv>
	);
};

export default BlurContent;
