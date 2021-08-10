// External
import axios from "axios";
import Cookies from "js-cookie";

// Enums
import { ComponentReadyInterval } from "@enums/GlobalValues";

// Global axios defaults
axios.defaults.headers.common["Accept"] = "application/json";
axios.defaults.headers.common["Content-Type"] = "application/json";
axios.defaults.headers.common["X-CSRFToken"] = Cookies.get("csrftoken");

const sleep = async (ms) => await new Promise((r) => setTimeout(r, ms));

export const useDeleteMethod = async (endpoint) => {
	// Promise timeout
	await sleep(ComponentReadyInterval);

	// Axios DELETE method
	return await axios
		.delete(endpoint)
		.then((response) => {
			/**
			 * Debugging purpose only
			 *
			 * console.log(response.data);
			 * console.log(response.status);
			 * console.log(response.statusText);
			 * console.log(response.headers);
			 * console.log(response.config);
			 */

			return response;
		})
		.catch((error) => {
			/**
			 * Debugging purpose only
			 *
			 * console.log('Error:', error.config);
			 * console.log('Error:', error.request);
			 * console.log('Error:', error.message);
			 * console.log('Error:', error.response.data);
			 * console.log('Error', error.response.headers);
			 * console.log('Error', error.response.status);
			 */

			return error.response;
		});
};

export const useGetMethod = async (endpoint) => {
	// Promise timeout
	await sleep(ComponentReadyInterval);

	// Axios GET method
	return await axios
		.get(endpoint)
		.then((response) => {
			/**
			 * Debugging purpose only
			 *
			 * console.log(response.data);
			 * console.log(response.status);
			 * console.log(response.statusText);
			 * console.log(response.headers);
			 * console.log(response.config);
			 */

			return response;
		})
		.catch((error) => {
			/**
			 * Debugging purpose only
			 *
			 * console.log('Error:', error.config);
			 * console.log('Error:', error.request);
			 * console.log('Error:', error.message);
			 * console.log('Error:', error.response.data);
			 * console.log('Error', error.response.headers);
			 * console.log('Error', error.response.status);
			 */

			return error.message;
		});
};

export const usePatchMethod = async (endpoint, data) => {
	// Promise timeout
	await sleep(ComponentReadyInterval);

	// Axios PATCH method
	return await axios
		.patch(endpoint, data)
		.then((response) => {
			/**
			 * Debugging purpose only
			 *
			 * console.log(response.data);
			 * console.log(response.status);
			 * console.log(response.statusText);
			 * console.log(response.headers);
			 * console.log(response.config);
			 */

			return response;
		})
		.catch((error) => {
			/**
			 * Debugging purpose only
			 *
			 * console.log('Error:', error.config);
			 * console.log('Error:', error.request);
			 * console.log('Error:', error.message);
			 * console.log('Error:', error.response.data);
			 * console.log('Error', error.response.headers);
			 * console.log('Error', error.response.status);
			 */

			return error.message;
		});
};

export const usePostMethod = async (endpoint, data) => {
	// Promise timeout
	await sleep(ComponentReadyInterval);

	// Axios POST method
	return await axios
		.post(endpoint, data)
		.then((response) => {
			/**
			 * Debugging purpose only
			 *
			 * console.log(response.data);
			 * console.log(response.status);
			 * console.log(response.statusText);
			 * console.log(response.headers);
			 * console.log(response.config);
			 */

			return response;
		})
		.catch((error) => {
			/**
			 * Debugging purpose only
			 *
			 * console.log('Error:', error.config);
			 * console.log('Error:', error.request);
			 * console.log('Error:', error.message);
			 * console.log('Error:', error.response.data);
			 * console.log('Error', error.response.headers);
			 * console.log('Error', error.response.status);
			 */

			return error.message;
		});
};

export const usePutMethod = async (endpoint, data) => {
	// Promise timeout
	await sleep(ComponentReadyInterval);

	// Axios PUT method
	return await axios
		.put(endpoint, data)
		.then((response) => {
			/**
			 * Debugging purpose only
			 *
			 * console.log(response.data);
			 * console.log(response.status);
			 * console.log(response.statusText);
			 * console.log(response.headers);
			 * console.log(response.config);
			 */

			return response;
		})
		.catch((error) => {
			/**
			 * Debugging purpose only
			 *
			 * console.log('Error:', error.config);
			 * console.log('Error:', error.request);
			 * console.log('Error:', error.message);
			 * console.log('Error:', error.response.data);
			 * console.log('Error', error.response.headers);
			 * console.log('Error', error.response.status);
			 */

			return error.message;
		});
};
