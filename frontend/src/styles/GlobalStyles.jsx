import * as React from "react";
import { GlobalStyles as BaseStyles } from "twin.macro";
import { CustomStyles } from "./CustomStyles";

export const GlobalStyles = () => (
	<React.Fragment>
		<BaseStyles />
		<CustomStyles />
	</React.Fragment>
);
