import { handleGetSortKeyFromSlug } from "@helpers/handleGetSortKeyFromSlug";
import { handleSlugToCamelCase } from "@helpers/handleSlugToCamelcase";
import { memo, useEffect, useRef, useState } from "react";
import AscSorting from "./AscSorting";
import DescSorting from "./DescSorting";

const Sorting = memo(({ setSortOrder, tableContent, ordering, direction, onSortHandler, slug }) => {
	const [isAscClicked, setIsAscClicked] = useState(false);
	const [isDescClicked, setIsDescClicked] = useState(false);

	const sortAscRef = useRef(null);
	const sortDescRef = useRef(null);

	let resultSlug = "";
	let orderItem = "";

	useEffect(() => {
		if (typeof ordering !== undefined) {
			resultSlug = handleGetSortKeyFromSlug(tableContent, ordering.replace("-", ""));
			orderItem = handleSlugToCamelCase(resultSlug);

			if (ordering.includes("-")) setSortOrder((prevState) => ({ ...prevState, [orderItem]: "desc" }));
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
});

export default Sorting;
