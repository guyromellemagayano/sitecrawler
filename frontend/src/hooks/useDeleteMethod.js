// React
import React from 'react';

// External
import axios from 'axios';
import Cookies from 'js-cookie';
import PropTypes from 'prop-types';

const sleep = async (ms) => await new Promise((r) => setTimeout(r, ms));

const useDeleteMethod = async (endpoint) => {
	// Global axios defaults
	axios.defaults.headers.common['Accept'] = 'application/json';
	axios.defaults.headers.common['Content-Type'] =
		'application/x-www-form-urlencoded';
	axios.defaults.headers.common['X-CSRFToken'] = Cookies.get('csrftoken');

	// Promise timeout
	await sleep(500);

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

useDeleteMethod.propTypes = {
	endpoint: PropTypes.string
};

export default useDeleteMethod;
