// React
import { useState, useRef, useEffect } from "react";

// External
import PropTypes from "prop-types";

// Components
import AscSorting from "./AscSorting";
import DescSorting from "./DescSorting";

// Utils
import { slugToCamelcase, getSlugFromSortKey } from "src/utils/functions";

const Sorting = ({ setSortOrder, tableContent, ordering, direction, onSortHandler, slug }) => {
	const [isAscClicked, setIsAscClicked] = useState(false);
	const [isDescClicked, setIsDescClicked] = useState(false);

	const sortAscRef = useRef(null);
	const sortDescRef = useRef(null);

	let resultSlug = "";
	let orderItem = "";

	useEffect(() => {
		if (ordering !== undefined) {
			resultSlug = getSlugFromSortKey(tableContent, ordering.replace("-", ""));
			orderItem = slugToCamelcase(resultSlug);

			if (ordering.includes("-"))
				setSortOrder((prevState) => ({ ...prevState, [orderItem]: "desc" }));
			else setSortOrder((prevState) => ({ ...prevState, [orderItem]: "asc" }));
		}
	}, [ordering]);

	useEffect(() => {
		if (ordering !== undefined) {
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

	const handleClickEvent = (event) => {
		if (sortAscRef.current && sortAscRef.current.contains(event.target)) {
			setIsDescClicked(false);

			if (!isAscClicked) {
				onSortHandler(slug, "asc");
			} else {
				onSortHandler(slug, "default");
			}
		}

		if (sortDescRef.current && sortDescRef.current.contains(event.target)) {
			setIsAscClicked(false);

			if (!isDescClicked) {
				onSortHandler(slug, "desc");
			} else {
				onSortHandler(slug, "default");
			}
		}
	};

	return (
		<>
			<AscSorting
				ref={sortAscRef}
				handleClickEvent={handleClickEvent}
				isAscClicked={isAscClicked}
				setIsAscClicked={setIsAscClicked}
			/>
			<DescSorting
				ref={sortDescRef}
				handleClickEvent={handleClickEvent}
				isDescClicked={isDescClicked}
				setIsDescClicked={setIsDescClicked}
			/>
		</>
	);
};

Sorting.propTypes = {};

export default Sorting;
