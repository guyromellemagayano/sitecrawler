/**
 * Helper function to get the sort key from a slug
 *
 * @param {array} content
 * @param {string} sortKey
 * @returns {string} slug
 */
export const handleSlugFromSortKey = (content = null, sortKey = null) => {
	let slug = "";

	content.forEach((val) => {
		if (val?.key == sortKey) slug = val.slug;
	});

	return slug;
};
