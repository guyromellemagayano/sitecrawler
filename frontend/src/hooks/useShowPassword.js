// React
import * as React from "react";

export const useShowPassword = (initialState) => {
	const [isPasswordShown, setIsPasswordShown] = React.useState(initialState);
	const passwordRef = React.useRef(null);

	const handleShowHidePassword = (props) => {
		if (props.current) {
			props.current.type = isPasswordShown ? "text" : "password";
		}
	};

	React.useEffect(() => {
		document.addEventListener("toggle", handleShowHidePassword(passwordRef), true);

		return () => {
			document.removeEventListener("toggle", handleShowHidePassword(passwordRef), true);
		};
	});

	return { passwordRef, isPasswordShown, setIsPasswordShown };
};
