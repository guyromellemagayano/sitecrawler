import { useEffect, useRef, useState } from "react";

/**
 * Custom React hook that handles showing/hiding <Transition> components.
 * It can hide those components either by pressing the `ESC` buttom or by clicking
 * outside the component DOM
 *
 * @param {boolean} initialIsVisible
 * @returns {object} ref, isComponentVisible, setIsComponentVisible
 */
export const useComponentVisible = (initialIsVisible) => {
	const [isComponentVisible, setIsComponentVisible] = useState(initialIsVisible);

	const ref = useRef(null);

	const handleHideComponent = (event) => {
		if (event?.key === "Escape" && ref?.current) {
			setIsComponentVisible(false);
		}
	};

	const handleClickOutsideComponent = (event) => {
		if (ref?.current && !Object.values(ref?.current).includes(event?.target)) {
			setIsComponentVisible(false);
		}
	};

	useEffect(() => {
		document.addEventListener("keydown", handleHideComponent, true);
		document.addEventListener("click", handleClickOutsideComponent, true);

		return () => {
			document.removeEventListener("keydown", handleHideComponent, true);
			document.removeEventListener("click", handleClickOutsideComponent, true);
		};
	});

	return { ref, isComponentVisible, setIsComponentVisible };
};
