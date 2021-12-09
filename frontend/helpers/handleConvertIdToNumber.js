/**
 * Helper function to convert any given `id` to number
 *
 * @param {string} id
 */
export const handleConvertIdToNumber = (id = null) => {
	let sanitizedId = "";

	if (typeof id !== "undefined" && id !== null && id !== 0) {
		if (typeof id == "string") {
			sanitizedId = parseInt(id);
		} else {
			sanitizedId = id;
		}
	}

	return sanitizedId;
};
