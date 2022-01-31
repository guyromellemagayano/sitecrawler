/**
 * Strings conversion
 */

// Handle conversion of string to lowercase
export const handleConversionStringToLowercase = (e = null) => {
	let sanitizedVal = "";

	sanitizedVal = e !== null && e !== "" && typeof e === "string" ? e.toLowerCase() : e;

	return sanitizedVal;
};

// Handle conversion of string to uppercase
export const handleConversionStringToUppercase = (e = null) => {
	let sanitizedVal = "";

	sanitizedVal = e !== null && e !== "" && typeof e === "string" ? e.toUpperCase() : e;

	return sanitizedVal;
};

// Handle conversion of string to title case
export const handleConversionStringToTitleCase = (e = null) => {
	let sanitizedVal = "";

	sanitizedVal =
		e !== null && e !== "" && typeof e === "string"
			? e.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
			: e;

	return sanitizedVal;
};

// Handle conversion of string to camel case
export const handleConversionStringToCamelCase = (e = null) => {
	let sanitizedVal = "";

	sanitizedVal =
		e !== null && e !== "" && typeof e === "string"
			? e.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())
			: e;

	return sanitizedVal;
};

// Handle conversion of string to snake case
export const handleConversionStringToSnakeCase = (e = null) => {
	let sanitizedVal = "";

	sanitizedVal = e !== null && e !== "" && typeof e === "string" ? e.replace(/\s/g, "_").toLowerCase() : e;

	return sanitizedVal;
};

// Handle conversion of string to kebab case
export const handleConversionStringToKebabCase = (e = null) => {
	let sanitizedVal = "";

	sanitizedVal = e !== null && e !== "" && typeof e === "string" ? e.replace(/\s/g, "-").toLowerCase() : e;

	return sanitizedVal;
};

// Handle conversion of string to constant case
export const handleConversionStringToConstantCase = (e = null) => {
	let sanitizedVal = "";

	sanitizedVal = e !== null && e !== "" && typeof e === "string" ? e.replace(/\s/g, "_").toUpperCase() : e;

	return sanitizedVal;
};

// Handle conversion of string to sentence case
export const handleConversionStringToSentenceCase = (e = null) => {
	let sanitizedVal = "";

	sanitizedVal =
		e !== null && e !== "" && typeof e === "string"
			? e.replace(/\s/g, " ").replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
			: e;

	return sanitizedVal;
};

// Handle conversion of string to number
export const handleConversionStringToNumber = (e = null) => {
	let sanitizedVal = "";

	sanitizedVal = e !== null && e !== "" && typeof e === "string" ? Number(e) : e;

	return sanitizedVal;
};

// Handle conversion of string to boolean
export const handleConversionStringToBoolean = (e = null) => {
	let sanitizedVal = "";

	sanitizedVal = e !== null && e !== "" && typeof e === "string" ? e === "true" : e;

	return sanitizedVal;
};

// Handle conversion of string to array
export const handleConversionStringToArray = (e = null) => {
	let sanitizedVal = "";

	sanitizedVal = e !== null && e !== "" && typeof e === "string" ? e.split(",") : e;

	return sanitizedVal;
};

// Handle conversion of string to object
export const handleConversionStringToObject = (e = null) => {
	let sanitizedVal = "";

	sanitizedVal = e !== null && e !== "" && typeof e === "string" ? JSON.parse(e) : e;

	return sanitizedVal;
};

/**
 * Objects conversion
 */

// Handle conversion of object to string
export const handleConversionObjectToString = (e = null) => {
	let sanitizedVal = "";

	sanitizedVal = e !== null && e !== "" && typeof e === "object" ? JSON.stringify(e) : e;

	return sanitizedVal;
};
