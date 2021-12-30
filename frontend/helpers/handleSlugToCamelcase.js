/**
 * Helper function to convert a slug to uppercase
 *
 * @param {*} slug
 * @returns {string} slug
 */
export const handleSlugToCamelCase = (slug) => {
	return slug.replace(/(-\w)/g, function (m) {
		return m[1].toUpperCase();
	});
};
