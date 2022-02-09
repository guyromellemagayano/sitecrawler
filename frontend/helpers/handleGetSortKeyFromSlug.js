/**
 * Helper function to get the sort key from a slug
 *
 * @param {array} content
 * @param {string} slug
 * @returns {string} sortKey
 */
export const handleGetSortKeyFromSlug = (content = null, slug = null) => {
	let sortKey = "";

	content.forEach((val) => {
		if (val?.slug == slug) sortKey = val.key;
	});

	return sortKey;
};
