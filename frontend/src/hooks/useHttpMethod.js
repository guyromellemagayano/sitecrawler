import { customAxiosHeaders } from "@configs/CustomAxiosHeaders";
import * as Sentry from "@sentry/nextjs";
import axios from "axios";

// Use `axios` interceptors for all HTTP methods (GET, POST, PUT, DELETE, etc.)
axios.interceptors.request.use((req) => {
	req.headers = {
		...req.headers,
		...customAxiosHeaders
	};

	return req;
});

axios.interceptors.response.use(
	(res) => res,
	(err) => {
		if (err.response) {
			// The request was made and the server responsded with a status code
			// that falls out of the the range of 2xx
			Sentry.captureException(err.response);

			return err.response;
		} else if (err.request) {
			// The request was made but no response was received
			// `err.request` is an instance of XMLHttpRequest in the browser and an instance of
			// http.ClientRequest in node.js
			Sentry.captureException(err.request);

			return err.request;
		} else {
			// Something happened in setting up the request that triggered an Error
			return new Promise((resolve) => {
				resolve(axios(err.config));
			});
		}
	}
);

/**
 * Axios callback function to be used for deleting data
 *
 * @param {string} endpoint
 * @param {object} headers
 * @returns {object} Promise object representing the DELETE response
 */
export const useDeleteMethod = async (endpoint = null, headers = null) => {
	return await axios.delete(endpoint ?? null, {
		headers: headers ?? customAxiosHeaders
	});
};

/**
 * Axios callback function to be used for getting data
 *
 * @param {string} endpoint
 * @param {object} headers
 * @returns {object} Promise object representing the GET response
 */
export const useGetMethod = async (endpoint = null, headers = null) => {
	return await axios.get(endpoint ?? null, {
		headers: headers ?? customAxiosHeaders
	});
};

/**
 * Axios callback function to be used for patching data
 *
 * @param {string} endpoint
 * @param {object} data
 * @param {object} headers
 * @returns {object} Promise object representing the PATCH response
 */
export const usePatchMethod = async (endpoint = null, data = null, headers = null) => {
	return await axios.patch(endpoint ?? null, data ?? null, {
		headers: headers ?? customAxiosHeaders
	});
};

/**
 * Axios callback function to be used for posting data
 *
 * @param {string} endpoint
 * @param {object} data
 * @param {object} headers
 * @returns {object} Promise object representing the POST response
 */
export const usePostMethod = async (endpoint = null, data = null, headers = null) => {
	return await axios.post(endpoint ?? null, data ?? null, {
		headers: headers ?? customAxiosHeaders
	});
};

/**
 * Axios callback function to be used for putting data
 *
 * @param {string} endpoint
 * @param {object} data
 * @param {object} headers
 * @returns {object} Promise object representing the PUT response
 */
export const usePutMethod = async (endpoint = null, data = null, headers = null) => {
	return await axios.put(endpoint ?? null, data ?? null, {
		headers: headers ?? customAxiosHeaders
	});
};
