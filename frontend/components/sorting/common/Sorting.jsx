/* eslint-disable react-hooks/exhaustive-deps */
import { handleSlugFromSortKey } from "@helpers/handleSlugFromSortKey";
import { handleConversionStringToCamelCase } from "@utils/convertCase";
import PropTypes from "prop-types";
import { memo, useEffect, useRef, useState } from "react";
import { MemoizedAscSorting } from "./AscSorting";
import { MemoizedDescSorting } from "./DescSorting";

/**
 * Custom function to render the `Sorting` common component
 *
 * @param {any} sortOrder
 * @param {function} setSortOrder'
 * @param {array} tableContent
 * @param {array} ordering
 * @param {function} handleSort
 * @param {string} slug
 */
const Sorting = ({ sortOrder = null, setSortOrder, tableContent = null, ordering = null, handleSort, slug = null }) => {
	const [isAscClicked, setIsAscClicked] = useState(false);
	const [isDescClicked, setIsDescClicked] = useState(false);

	const sortAscRef = useRef(null);
	const sortDescRef = useRef(null);
	const resultSlug = useRef(null);
	const orderItem = useRef(null);

	// Handle sort and ordering
	useEffect(() => {
		if (ordering !== null) {
			resultSlug.current = handleSlugFromSortKey(tableContent, ordering.replace("-", ""));
			orderItem.current = handleConversionStringToCamelCase(resultSlug);

			if (ordering.includes("-")) setSortOrder((prevState) => ({ ...prevState, [orderItem]: "desc" }));
			else setSortOrder((prevState) => ({ ...prevState, [orderItem]: "asc" }));
		}
	}, [ordering]);

	// Handle ascending and descending onClick states
	useEffect(() => {
		if (ordering !== null) {
			if (resultSlug == slug) {
				if (ordering.includes("-")) {
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
	}, [ordering]);

	// Handle click event
	const handleClickEvent = async (e) => {
		if (sortAscRef?.current && sortAscRef?.current?.contains(e.target)) {
			setIsDescClicked(false);

			if (!isAscClicked) {
				handleSort(slug, "asc");
			} else {
				handleSort(slug, "default");
			}
		}

		if (sortDescRef?.current && sortDescRef?.current?.contains(e.target)) {
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
	ordering: PropTypes.any,
	sortOrder: PropTypes.any,
	setSortOrder: PropTypes.func,
	slug: PropTypes.string,
	tableContent: PropTypes.any
};

/**
 * Memoized custom `Sorting` component
 */
export const MemoizedSorting = memo(Sorting);
