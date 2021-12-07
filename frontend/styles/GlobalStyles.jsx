import { GlobalStyles as BaseStyles } from "twin.macro";
import { CustomStyles } from "./CustomStyles";
import { CustomTransitions } from "./CustomTransitions";

const GlobalStyles = () => (
	<>
		<BaseStyles />
		<CustomStyles />
		<CustomTransitions />
	</>
);

export default GlobalStyles;
