import * as React from "react";

/**
 * Custom React hook that handles showing/hiding passwords
 *
 * @param {boolean} initialState
 * @returns {object} passwordRef, isPasswordShown, setIsPasswordShown
 */
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
