import { ChevronUpIcon } from "@heroicons/react/solid";
import { classNames } from "@utils/classNames";
import { forwardRef, memo, useEffect } from "react";

/**
 * Custom function to render the `AscSorting` component
 *
 * @param {function} handleClickEvent
 * @param {boolean} isAscClicked
 * @param {function} setIsAscClicked
 */
const AscSorting = ({ handleClickEvent, isAscClicked, setIsAscClicked }, ref) => {
	useEffect(() => {
		document.addEventListener("click", handleClickEvent, true);

		return () => {
			document.removeEventListener("click", handleClickEvent, true);
		};
	}, [isAscClicked]);

	return (
		<button ref={ref} className="focus:outline-none" onClick={() => setIsAscClicked(!isAscClicked)}>
			<ChevronUpIcon className={classNames("inline-block h-5 w-5", isAscClicked ? "text-gray-500" : "text-gray-300")} />
		</button>
	);
};

/**
 * Memoized custom `AscSorting` component
 */
const ForwardRefAscSorting = forwardRef(AscSorting);
export const MemoizedAscSorting = memo(ForwardRefAscSorting);
