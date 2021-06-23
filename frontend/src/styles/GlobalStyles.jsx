// React
import * as React from "react";

// External
import { createGlobalStyle } from "styled-components";
import tw, { GlobalStyles as BaseStyles } from "twin.macro";

const CustomStyles = createGlobalStyle`
	body {
		${tw`antialiased`}
	}

	.truncate-profile-text {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		max-width: 12rem;
	}
`;

const GlobalStyles = () => (
	<>
		<BaseStyles />
		<CustomStyles />
	</>
);

export default GlobalStyles;
