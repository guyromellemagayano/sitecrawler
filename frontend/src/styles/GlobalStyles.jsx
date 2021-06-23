// React
import * as React from "react";

// External
import { createGlobalStyle } from "styled-components";
import tw, { GlobalStyles as BaseStyles } from "twin.macro";

const CustomStyles = createGlobalStyle`
	body {
		${tw`antialiased`}
	}

	tr {
		a,
		div {
			max-width: 100%;
			display: inline-block;
			clear: both;
		}

		td {
			& > div {
				max-width: 100%;
				display: block;

				& > div {
					max-width: 100%;
					display: block;
				}
			}
		}
	}

	.truncate {
		&-link,
		&-profile-text,
		&-breadcrumbs {
			${tw`truncate`}
		}

		&-link {
			max-width: 18rem;
		}

		&-profile-text {
			max-width: 12rem;
		}

		&-breadcrumbs {
			max-width: 30rem;
		}
	}
`;

const GlobalStyles = () => (
	<>
		<BaseStyles />
		<CustomStyles />
	</>
);

export default GlobalStyles;
