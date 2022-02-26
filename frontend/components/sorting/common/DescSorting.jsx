import { ChevronDownIcon } from "@heroicons/react/solid";
import { classnames } from "@utils/classnames";
import { forwardRef, memo, useEffect } from "react";

/**
 * Custom function to render the "DescSorting" component
 *
 * @param {function} handleClickEvent
 * @param {boolean} isDescClicked
 * @param {function} setIsDescClicked
 */
const DescSorting = ({ handleClickEvent, isDescClicked, setIsDescClicked }, ref) => {
	useEffect(() => {
		document.addEventListener("click", handleClickEvent, true);

		return () => {
			document.removeEventListener("click", handleClickEvent, true);
		};
	}, [isDescClicked]);

	return (
		<button ref={ref} className="focus:outline-none" onClick={() => setIsDescClicked(!isDescClicked)}>
			<ChevronDownIcon
				className={classnames("inline-block h-5 w-5", isDescClicked ? "text-gray-500" : "text-gray-300")}
			/>
		</button>
	);
};

/**
 * Memoized custom "DescSorting" component
 */
const ForwardRefDescSorting = forwardRef(DescSorting);
export const MemoizedDescSorting = memo(ForwardRefDescSorting);
