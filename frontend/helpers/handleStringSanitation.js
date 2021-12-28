/**
 * Helper function to convert any given `val` to number
 *
 * @param {string} val
 */
export const handleStringToNumberSanitation = (val) => {
	let sanitizedVal = "";

	if (typeof val !== "undefined" && val !== null && val !== "" && typeof val === "string") {
		sanitizedVal = parseInt(val);
	}

	return sanitizedVal;
};

/**
 * Helper function to convert any given `val` to boolean
 *
 * @param {string} val
 */
export const handleStringToBooleanSanitation = (val) => {
	let sanitizedVal = "";

	if (typeof val !== "undefined" && val !== null && val !== "" && typeof val === "string") {
		sanitizedVal = val === "true" ? true : false;
	}

	return sanitizedVal;
};

/**
 * Helper function to convert any given `val` to bigint
 *
 * @param {string} val
 */
export const handleStringToBigIntSanitation = (val) => {
	let sanitizedVal = "";

	if (typeof val !== "undefined" && val !== null && val !== "" && typeof val === "string") {
		sanitizedVal = BigInt(val);
	}

	return sanitizedVal;
};
