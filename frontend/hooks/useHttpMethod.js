import { AppAxiosInstance } from "@utils/axios";

/**
 * Axios callback function to be used for deleting data
 *
 * @param {string} endpoint
 * @returns {object} Promise object representing the DELETE response
 */
export const useDeleteMethod = async (endpoint) => {
	return await AppAxiosInstance.delete(endpoint ?? null);
};

/**
 * Axios callback function to be used for getting data
 *
 * @param {string} endpoint
 * @returns {object} Promise object representing the GET response
 */
export const useGetMethod = async (endpoint) => {
	return await AppAxiosInstance.get(endpoint ?? null);
};

/**
 * Axios callback function to be used for patching data
 *
 * @param {string} endpoint
 * @param {object} data
 * @returns {object} Promise object representing the PATCH response
 */
export const usePatchMethod = async (endpoint, data) => {
	return await AppAxiosInstance.patch(endpoint ?? null, data ?? null);
};

/**
 * Axios callback function to be used for posting data
 *
 * @param {string} endpoint
 * @param {object} data
 * @returns {object} Promise object representing the POST response
 */
export const usePostMethod = async (endpoint, data) => {
	return await AppAxiosInstance.post(endpoint ?? null, data ?? null);
};

/**
 * Axios callback function to be used for putting data
 *
 * @param {string} endpoint
 * @param {object} data
 * @returns {object} Promise object representing the PUT response
 */
export const usePutMethod = async (endpoint, data) => {
	return await AppAxiosInstance.put(endpoint ?? null, data ?? null);
};
