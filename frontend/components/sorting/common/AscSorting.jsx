import { ChevronUpIcon } from "@heroicons/react/solid";
import { classnames } from "@utils/classnames";
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
			<ChevronUpIcon className={classnames("inline-block h-4 w-4", isAscClicked ? "text-gray-500" : "text-gray-300")} />
		</button>
	);
};

/**
 * Memoized custom `AscSorting` component
 */
const ForwardRefAscSorting = forwardRef(AscSorting);
export const MemoizedAscSorting = memo(ForwardRefAscSorting);
