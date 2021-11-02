import { customAxiosHeaders } from "@configs/CustomAxiosHeaders";
import { FormSubmissionInterval } from "@enums/GlobalValues";
import { sleep } from "@utils/sleep";
import axios from "axios";

/**
 * Axios callback function to be used for deleting data
 *
 * @param {string} endpoint
 * @returns {object} response
 * @return {object} error
 */
export const useDeleteMethod = async (endpoint) => {
	return await axios
		.delete(endpoint, {
			headers: customAxiosHeaders,
			validateStatus: (status) => {
				return status < 500;
			}
		})
		.then(sleep(FormSubmissionInterval))
		.then((response) => {
			return response;
		})
		.catch((error) => {
			if (error.response) {
				// The request was made and the server responsded with a status code
				// that falls out of the the range of 2xx
				console.log(error.response.data.toJSON());
				console.log(error.response.status);
				console.log(error.response.headers.toJSON());
			} else if (error.request) {
				// The request was made but no response was received
				// `error.request` is an instance of XMLHttpRequest in the browser and an instance of
				// http.ClientRequest in node.js
				console.log(error.request);
			} else {
				// Something happened in setting up the request that triggered an Error
				console.log("Error: ", error.message);
			}

			return error.config;
		});
};

/**
 * Axios callback function to be used for getting data
 *
 * @param {string} endpoint
 * @returns {object} response
 * @return {object} error
 */
export const useGetMethod = async (endpoint) => {
	return await axios
		.get(endpoint, {
			headers: customAxiosHeaders,
			validateStatus: (status) => {
				return status < 500;
			}
		})
		.then(sleep(FormSubmissionInterval))
		.then((response) => {
			return response;
		})
		.catch((error) => {
			if (error.response) {
				// The request was made and the server responsded with a status code
				// that falls out of the the range of 2xx
				console.log(error.response.data.toJSON());
				console.log(error.response.status);
				console.log(error.response.headers.toJSON());
			} else if (error.request) {
				// The request was made but no response was received
				// `error.request` is an instance of XMLHttpRequest in the browser and an instance of
				// http.ClientRequest in node.js
				console.log(error.request);
			} else {
				// Something happened in setting up the request that triggered an Error
				console.log("Error: ", error.message);
			}

			return error.config;
		});
};

/**
 * Axios callback function to be used for patching data
 *
 * @param {string} endpoint
 * @param {object} data
 * @returns {object} response
 * @returns {object} error
 */
export const usePatchMethod = async (endpoint, data) => {
	return await axios
		.patch(endpoint, data, {
			headers: customAxiosHeaders,
			validateStatus: (status) => {
				return status < 500;
			}
		})
		.then(sleep(FormSubmissionInterval))
		.then((response) => {
			return response;
		})
		.catch((error) => {
			if (error.response) {
				// The request was made and the server responsded with a status code
				// that falls out of the the range of 2xx
				console.log(error.response.data.toJSON());
				console.log(error.response.status);
				console.log(error.response.headers.toJSON());
			} else if (error.request) {
				// The request was made but no response was received
				// `error.request` is an instance of XMLHttpRequest in the browser and an instance of
				// http.ClientRequest in node.js
				console.log(error.request);
			} else {
				// Something happened in setting up the request that triggered an Error
				console.log("Error: ", error.message);
			}

			return error.config;
		});
};

/**
 * Axios callback function to be used for posting data
 *
 * @param {string} endpoint
 * @param {object} data
 * @returns {object} response
 * @returns {object} error
 */
export const usePostMethod = async (endpoint, data) => {
	return await axios
		.post(endpoint, data, {
			headers: customAxiosHeaders,
			validateStatus: (status) => {
				return status < 500;
			}
		})
		.then(sleep(FormSubmissionInterval))
		.then((response) => {
			return response;
		})
		.catch((error) => {
			if (error.response) {
				// The request was made and the server responsded with a status code
				// that falls out of the the range of 2xx
				console.log(error.response.data.toJSON());
				console.log(error.response.status);
				console.log(error.response.headers.toJSON());
			} else if (error.request) {
				// The request was made but no response was received
				// `error.request` is an instance of XMLHttpRequest in the browser and an instance of
				// http.ClientRequest in node.js
				console.log(error.request);
			} else {
				// Something happened in setting up the request that triggered an Error
				console.log("Error: ", error.message);
			}

			return error.config;
		});
};

/**
 * Axios callback function to be used for putting data
 *
 * @param {string} endpoint
 * @param {object} data
 * @returns {object} response
 * @returns {object} error
 */
export const usePutMethod = async (endpoint, data) => {
	return await axios
		.put(endpoint, data, {
			headers: customAxiosHeaders,
			validateStatus: (status) => {
				return status < 500;
			}
		})
		.then(sleep(FormSubmissionInterval))
		.then((response) => {
			return response;
		})
		.catch((error) => {
			if (error.response) {
				// The request was made and the server responsded with a status code
				// that falls out of the the range of 2xx
				console.log(error.response.data.toJSON());
				console.log(error.response.status);
				console.log(error.response.headers.toJSON());
			} else if (error.request) {
				// The request was made but no response was received
				// `error.request` is an instance of XMLHttpRequest in the browser and an instance of
				// http.ClientRequest in node.js
				console.log(error.request);
			} else {
				// Something happened in setting up the request that triggered an Error
				console.log("Error: ", error.message);
			}

			return error.config;
		});
};
