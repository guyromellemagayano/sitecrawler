/**
 * Strings conversion
 */

/**
 * Handle conversion of string to lowercase
 * @param {string} e
 **/
export const handleConversionStringToLowercase = (e = null) => {
	let sanitizedVal = "";

	sanitizedVal = e !== null && e !== "" && typeof e === "string" ? e.toLowerCase() : e;

	return sanitizedVal;
};

/**
 * Handle conversion of string to uppercase
 * @param {string} e
 **/
export const handleConversionStringToUppercase = (e = null) => {
	let sanitizedVal = "";

	sanitizedVal = e !== null && e !== "" && typeof e === "string" ? e.toUpperCase() : e;

	return sanitizedVal;
};

/**
 * Handle conversion of string to title case
 * @param {string} e
 **/
export const handleConversionStringToTitleCase = (e = null) => {
	let sanitizedVal = "";

	sanitizedVal =
		e !== null && e !== "" && typeof e === "string"
			? e.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
			: e;

	return sanitizedVal;
};

/**
 * Handle conversion of string to camel case
 * @param {string} e
 **/
export const handleConversionStringToCamelCase = (e = null) => {
	let sanitizedVal = "";

	sanitizedVal =
		e !== null && e !== "" && typeof e === "string"
			? e.replace(/(-\w)/g, (m) => {
					return m[1].toUpperCase();
			  })
			: e;

	return sanitizedVal;
};

/**
 * Handle conversion of string to snake case
 * @param {string} e
 **/
export const handleConversionStringToSnakeCase = (e = null) => {
	let sanitizedVal = "";

	sanitizedVal = e !== null && e !== "" && typeof e === "string" ? e.replace(/\s/g, "_").toLowerCase() : e;

	return sanitizedVal;
};

/**
 * Handle conversion of string to kebab case
 * @param {string} e
 **/
export const handleConversionStringToKebabCase = (e = null) => {
	let sanitizedVal = "";

	sanitizedVal = e !== null && e !== "" && typeof e === "string" ? e.replace(/\s/g, "-").toLowerCase() : e;

	return sanitizedVal;
};

/**
 * Handle conversion of string to constant case
 * @param {string} e
 **/
export const handleConversionStringToConstantCase = (e = null) => {
	let sanitizedVal = "";

	sanitizedVal = e !== null && e !== "" && typeof e === "string" ? e.replace(/\s/g, "_").toUpperCase() : e;

	return sanitizedVal;
};

/**
 * Handle conversion of string to sentence case
 * @param {string} e
 **/
export const handleConversionStringToSentenceCase = (e = null) => {
	let sanitizedVal = "";

	sanitizedVal =
		e !== null && e !== "" && typeof e === "string"
			? e.replace(/\s/g, " ").replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
			: e;

	return sanitizedVal;
};

/**
 * Handle conversion of string to number
 * @param {string} e
 **/
export const handleConversionStringToNumber = (e = null) => {
	let sanitizedVal = "";

	sanitizedVal = e !== null && e !== "" && typeof e === "string" ? Number(e) : e;

	return sanitizedVal;
};

/**
 * Handle conversion of string to boolean
 * @param {string} e
 **/
export const handleConversionStringToBoolean = (e = null) => {
	let sanitizedVal = "";

	sanitizedVal = e !== null && e !== "" && typeof e === "string" ? e === "true" : e;

	return sanitizedVal;
};

/**
 * Handle conversion of string to array
 * @param {string} e
 **/
export const handleConversionStringToArray = (e = null) => {
	let sanitizedVal = "";

	sanitizedVal = e !== null && e !== "" && typeof e === "string" ? e.split(",") : e;

	return sanitizedVal;
};

/**
 * Handle conversion of string to object
 * @param {string} e
 **/
export const handleConversionStringToObject = (e = null) => {
	let sanitizedVal = "";

	sanitizedVal = e !== null && e !== "" && typeof e === "string" ? JSON.parse(e) : e;

	return sanitizedVal;
};

/**
 * Objects conversion
 */

/**
 * Handle conversion of object to string
 * @param {string} e
 **/
export const handleConversionObjectToString = (e = null) => {
	let sanitizedVal = "";

	sanitizedVal = e !== null && e !== "" && typeof e === "object" ? JSON.stringify(e) : e;

	return sanitizedVal;
};
