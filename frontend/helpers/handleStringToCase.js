/**
 * Helper function to convert any `val` string to lowercase
 *
 * @param {string} val
 */
export const handleStringToLowerCase = (val) => {
	let convertedVal = "";

	if (typeof val !== "undefined" && val !== null && val !== "" && typeof val === "string") {
		convertedVal = val?.toLowerCase();
	}

	return convertedVal;
};

/**
 * Helper function to convert any `val` string to uppercase
 *
 * @param {string} val
 */
export const handleStringToUpperCase = (val) => {
	let convertedVal = "";

	if (typeof val !== "undefined" && val !== null && val !== "" && typeof val === "string") {
		convertedVal = val?.toUpperCase();
	}

	return convertedVal;
};

/**
 * Helper function to convert any `val` string to camelcase
 *
 * @param {string} val
 */
export const handleStringToCamelCase = (val) => {
	let convertedVal = "";

	if (typeof val !== "undefined" && val !== null && val !== "" && typeof val === "string") {
		convertedVal = val?.toCamelCase();
	}

	return convertedVal;
};
