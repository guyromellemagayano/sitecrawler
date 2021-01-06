// External
import axios from 'axios';

const sleep = async (ms) => await new Promise((r) => setTimeout(r, ms));

const useFetcher = async (...args) => {
	// Promise timeout
	await sleep(500);

	await axios
		.get(...args)
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
};

export default useFetcher;
