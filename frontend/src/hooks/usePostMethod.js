// React
import React from 'react';

// External
import 'core-js';
import axios from 'axios';
import Cookies from 'js-cookie';
import PropTypes from 'prop-types';

const sleep = async (ms) => await new Promise((r) => setTimeout(r, ms));

const usePostMethod = async (endpoint, method, data) => {
	// Global axios defaults
	axios.defaults.headers.common['Accept'] = 'application/json';
	axios.defaults.headers.common['Content-Type'] =
		'application/x-www-form-urlencoded';
	axios.defaults.headers.common['X-CSRFToken'] = Cookies.get('csrftoken');

	// Promise timeout
	await sleep(500);

	// Axios POST method
	if (method === 'POST' || method === 'post') {
		return await axios
			.post(endpoint, data)
			.then((response) => {
				// Debugging purpose only
				// console.log(response.data);
				// console.log(response.status);
				// console.log(response.statusText);
				// console.log(response.headers);
				// console.log(response.config);

				return response;
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

usePostMethod.propTypes = {
	endpoint: PropTypes.string.isRequired,
	method: PropTypes.string.isRequired,
	data: PropTypes.array.isRequired
};

usePostMethod.defaultProps = {
	data: {}
};

export default usePostMethod;
