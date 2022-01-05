import { handleGetSortKeyFromSlug } from "@helpers/handleGetSortKeyFromSlug";
import { handleSlugToCamelCase } from "@helpers/handleSlugToCamelcase";
import PropTypes from "prop-types";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { MemoizedAscSorting } from "./AscSorting";
import { MemoizedDescSorting } from "./DescSorting";

/**
 * Custom function to render the `Sorting` common component
 *
 * @param {string} filterQueryString
 * @param {string} scanApiEndpoint
 * @param {function} setPagePath
 */
export function Sorting(props) {
	const [isAscClicked, setIsAscClicked] = useState(false);
	const [isDescClicked, setIsDescClicked] = useState(false);
	const [resultSlug, setResultSlug] = useState(null);
	const [orderItem, setOrderItem] = useState(null);

	// Props
	const { setSortOrder, tableContent, direction, ordering, handleSort, slug } = props;

	const sortAscRef = useRef(null);
	const sortDescRef = useRef(null);

	// Handle sort and ordering
	const handleSortOrdering = useCallback(async () => {
		if (typeof ordering !== undefined && ordering !== null) {
			setResultSlug(handleGetSortKeyFromSlug(tableContent, ordering?.replace("-", "")));
			setOrderItem(handleSlugToCamelCase(resultSlug));

			if (ordering?.includes("-")) setSortOrder((prevState) => ({ ...prevState, [orderItem]: "desc" }));
			else setSortOrder((prevState) => ({ ...prevState, [orderItem]: "asc" }));
		}
	}, [orderItem, ordering, resultSlug, setSortOrder, tableContent]);

	useEffect(() => {
		handleSortOrdering();
	}, [handleSortOrdering]);

	// Handle ascending and descending onClick states
	const handleAscDescOnClickStates = useCallback(async () => {
		if (typeof ordering !== undefined && ordering !== null) {
			if (resultSlug === slug) {
				if (ordering?.includes("-")) {
					setIsDescClicked(true);
					setIsAscClicked(false);
				} else {
					setIsAscClicked(true);
					setIsDescClicked(false);
				}
			} else {
				setIsDescClicked(false);
				setIsAscClicked(false);
			}
		}
	}, [ordering, resultSlug, slug]);

	useEffect(() => {
		handleAscDescOnClickStates();
	}, [handleAscDescOnClickStates]);

	// Handle click event
	const handleClickEvent = (event) => {
		if (sortAscRef?.current && sortAscRef?.current?.contains(event.target)) {
			setIsDescClicked(false);

			if (!isAscClicked) {
				handleSort(slug, "asc");
			} else {
				handleSort(slug, "default");
			}
		}

		if (sortDescRef?.current && sortDescRef?.current?.contains(event.target)) {
			setIsAscClicked(false);

			if (!isDescClicked) {
				handleSort(slug, "desc");
			} else {
				handleSort(slug, "default");
			}
		}
	};

	return (
		<>
			<MemoizedAscSorting
				ref={sortAscRef}
				handleClickEvent={handleClickEvent}
				isAscClicked={isAscClicked}
				setIsAscClicked={setIsAscClicked}
			/>
			<MemoizedDescSorting
				ref={sortDescRef}
				handleClickEvent={handleClickEvent}
				isDescClicked={isDescClicked}
				setIsDescClicked={setIsDescClicked}
			/>
		</>
	);
}

Sorting.propTypes = {
	direction: PropTypes.string,
	handleSort: PropTypes.func.isRequired,
	ordering: PropTypes.shape({
		includes: PropTypes.func.isRequired,
		replace: PropTypes.func.isRequired
	}),
	setSortOrder: PropTypes.func.isRequired,
	slug: PropTypes.string,
	tableContent: PropTypes.array
};

/**
 * Memoized custom `Sorting` component
 */
export const MemoizedSorting = memo(Sorting);
