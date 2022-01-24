/**
 * Strings conversion
 */

// Handle conversion of string to lowercase
export const handleConversionStringToLowercase = (e) => {
	return typeof e === "string" ? e.toLowerCase() : e;
};

// Handle conversion of string to uppercase
export const handleConversionStringToUppercase = (e) => {
	return typeof e === "string" ? e.toUpperCase() : e;
};

// Handle conversion of string to title case
export const handleConversionStringToTitleCase = (e) => {
	return typeof e === "string"
		? e.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
		: e;
};

// Handle conversion of string to camel case
export const handleConversionStringToCamelCase = (e) => {
	return typeof e === "string" ? e.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase()) : e;
};

// Handle conversion of string to snake case
export const handleConversionStringToSnakeCase = (e) => {
	return typeof e === "string" ? e.replace(/\s/g, "_").toLowerCase() : e;
};

// Handle conversion of string to kebab case
export const handleConversionStringToKebabCase = (e) => {
	return typeof e === "string" ? e.replace(/\s/g, "-").toLowerCase() : e;
};

// Handle conversion of string to constant case
export const handleConversionStringToConstantCase = (e) => {
	return typeof e === "string" ? e.replace(/\s/g, "_").toUpperCase() : e;
};

// Handle conversion of string to sentence case
export const handleConversionStringToSentenceCase = (e) => {
	return typeof e === "string"
		? e.replace(/\s/g, " ").replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase())
		: e;
};

// Handle conversion of string to number
export const handleConversionStringToNumber = (e) => {
	return typeof e === "string" ? Number(e) : e;
};

// Handle conversion of string to boolean
export const handleConversionStringToBoolean = (e) => {
	return typeof e === "string" ? e === "true" : e;
};

// Handle conversion of string to array
export const handleConversionStringToArray = (e) => {
	return typeof e === "string" ? e.split(",") : e;
};

// Handle conversion of string to object
export const handleConversionStringToObject = (e) => {
	return typeof e === "string" ? JSON.parse(e) : e;
};

/**
 * Objects conversion
 */

// Handle conversion of object to string
export const handleConversionObjectToString = (e) => {
	return typeof e === "object" ? JSON.stringify(e) : e;
};
