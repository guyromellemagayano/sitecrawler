import { handleGetSortKeyFromSlug } from "@helpers/handleGetSortKeyFromSlug";
import { handleConversionStringToCamelCase } from "@utils/convertCase";
import PropTypes from "prop-types";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { MemoizedAscSorting } from "./AscSorting";
import { MemoizedDescSorting } from "./DescSorting";

/**
 * Custom function to render the `Sorting` common component
 *
 * @param {function} setSortOrder'
 * @param {array} tableContent
 * @param {array} ordering
 * @param {function} handleSort
 * @param {string} slug
 */
const Sorting = ({ setSortOrder, tableContent = null, ordering = null, handleSort, slug = null }) => {
	const [isAscClicked, setIsAscClicked] = useState(false);
	const [isDescClicked, setIsDescClicked] = useState(false);
	const [resultSlug, setResultSlug] = useState(null);
	const [orderItem, setOrderItem] = useState(null);

	const sortAscRef = useRef(null);
	const sortDescRef = useRef(null);

	// Handle sort and ordering
	const handleSortOrdering = useCallback(async () => {
		if (ordering !== null) {
			setResultSlug(handleGetSortKeyFromSlug(tableContent, ordering?.replace("-", "")));
			setOrderItem(handleConversionStringToCamelCase(resultSlug));

			if (ordering?.includes("-")) setSortOrder((prevState) => ({ ...prevState, [orderItem]: "desc" }));
			else setSortOrder((prevState) => ({ ...prevState, [orderItem]: "asc" }));
		}
	}, [orderItem, ordering, resultSlug, setSortOrder, tableContent]);

	useEffect(() => {
		handleSortOrdering();
	}, [handleSortOrdering]);

	// Handle ascending and descending onClick states
	const handleAscDescOnClickStates = useCallback(async () => {
		if (ordering !== null) {
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
};

Sorting.propTypes = {
	handleSort: PropTypes.func,
	ordering: PropTypes.array,
	setSortOrder: PropTypes.func,
	slug: PropTypes.string,
	tableContent: PropTypes.string
};

/**
 * Memoized custom `Sorting` component
 */
export const MemoizedSorting = memo(Sorting);
