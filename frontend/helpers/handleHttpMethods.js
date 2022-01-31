import AppAxiosInstance from "@utils/axios";

/**
 * Axios callback function to be used for deleting data
 *
 * @param {string} endpoint
 * @param {object} options
 * @returns {object} Promise object representing the DELETE response
 */
export const handleDeleteMethod = async (endpoint = null, options = null) => {
	if (endpoint == null) {
		const errMessage = new Error("Endpoint is required to make a DELETE request.");
		throw errMessage;
	}

	return await AppAxiosInstance.delete(endpoint, options);
};

/**
 * Axios callback function to be used for getting data
 *
 * @param {string} endpoint
 * @param {object} options
 * @returns {object} Promise object representing the GET response
 */
export const handleGetMethod = async (endpoint = null, options = null) => {
	if (endpoint == null) {
		const errMessage = new Error("Endpoint is required to make a GET request.");
		throw errMessage;
	}

	return await AppAxiosInstance.get(endpoint, options);
};

/**
 * Axios callback function to be used for patching data
 *
 * @param {string} endpoint
 * @param {object} data
 * @param {object} options
 * @returns {object} Promise object representing the PATCH response
 */
export const handlePatchMethod = async (endpoint = null, data = null, options = null) => {
	if (endpoint == null && data == null) {
		const errMessage = new Error("Endpoint and data are required to make a PATCH request.");
		throw errMessage;
	}

	return await AppAxiosInstance.patch(endpoint, data, options);
};

/**
 * Axios callback function to be used for posting data
 *
 * @param {string} endpoint
 * @param {object} data
 * @param {object} options
 * @returns {object} Promise object representing the POST response
 */
export const handlePostMethod = async (endpoint = null, data = null, options = null) => {
	if (endpoint == null && data == null) {
		const errMessage = new Error("Endpoint and data are required to make a POST request.");
		throw errMessage;
	}

	return await AppAxiosInstance.post(endpoint, data, options);
};

/**
 * Axios callback function to be used for putting data
 *
 * @param {string} endpoint
 * @param {object} data
 * @param {object} options
 * @returns {object} Promise object representing the PUT response
 */
export const handlePutMethod = async (endpoint = null, data = null, options = null) => {
	if (endpoint == null && data == null) {
		const errMessage = new Error("Endpoint and data are required to make a PUT request.");
		throw errMessage;
	}

	return await AppAxiosInstance.put(endpoint, data, options);
};
