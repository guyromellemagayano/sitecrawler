// React
import React from 'react';

// External
import 'core-js';
import axios from 'axios';
import Cookies from 'js-cookie';
import PropTypes from 'prop-types';

const sleep = async (ms) => await new Promise((r) => setTimeout(r, ms));

const useGetMethod = async ({ endpoint, method }) => {
	// Global axios defaults
	axios.defaults.headers.common['Accept'] = 'application/json';
	axios.defaults.headers.common['Content-Type'] =
		'application/x-www-form-urlencoded';
	axios.defaults.headers.common['X-CSRFToken'] = Cookies.get('csrftoken');

	// Promise timeout
	await sleep(500);

	// Axios GET method
	if (method === 'GET' || method === 'get') {
		await axios
			.get(endpoint)
			.then((response) => {
				// Debugging purpose only
				// console.log(response.data);
				// console.log(response.status);
				// console.log(response.statusText);
				// console.log(response.headers);
				// console.log(response.config);

				return response.data;
			})
			.catch((error) => {
				// Debugging purpose only
				// console.log('Error', error.config);

				if (error.response) {
					// Debugging purpose only
					// console.log('Error', error.response.data);
					// console.log('Error', error.response.headers);

					console.log('Error', error.response.status);
				} else if (error.request) {
					console.log('Error', error.request);
				} else {
					console.log('Error', error.message);
				}
			});
	} else {
		console.log('Error: Request method not recognized.');
	}
};

useGetMethod.propTypes = {
	endpoint: PropTypes.string.isRequired,
	method: PropTypes.string.isRequired
};

export default useGetMethod;
