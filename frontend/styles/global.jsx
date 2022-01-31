import { GlobalStyles as BaseGlobalStyles } from "twin.macro";
import { CustomGlobalStyles, CustomTransitionStyles, CustomVendorStyles } from "./custom";

const GlobalStyles = () => (
	<>
		<BaseGlobalStyles />
		<CustomGlobalStyles />
		<CustomVendorStyles />
		<CustomTransitionStyles />
	</>
);

export default GlobalStyles;
