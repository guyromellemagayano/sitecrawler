import { ChevronUpIcon } from "@heroicons/react/solid";
import PropTypes from "prop-types";
import { forwardRef, memo, useEffect } from "react";
import tw from "twin.macro";

/**
 * Custom function to render the `AscSorting` component
 *
 * @param {function} handleClickEvent
 * @param {boolean} isAscClicked
 * @param {function} setIsAscClicked
 */
export function AscSorting(props, ref) {
	// Props
	const { handleClickEvent, isAscClicked, setIsAscClicked } = props;

	useEffect(() => {
		document.addEventListener("click", handleClickEvent, true);

		return () => {
			document.removeEventListener("click", handleClickEvent, true);
		};
	});

	return (
		<button ref={ref} tw="focus:outline-none" onClick={() => setIsAscClicked(!isAscClicked)}>
			<ChevronUpIcon css={[tw`w-5 h-5 inline-block`, isAscClicked ? tw`text-gray-500` : tw`text-gray-300`]} />
		</button>
	);
}

AscSorting.propTypes = {
	handleClickEvent: PropTypes.func.isRequired,
	isAscClicked: PropTypes.bool,
	setIsAscClicked: PropTypes.func.isRequired
};

/**
 * Memoized custom `AscSorting` component
 */
export const ForwardRefAscSorting = forwardRef(AscSorting);
export const MemoizedAscSorting = memo(ForwardRefAscSorting);
