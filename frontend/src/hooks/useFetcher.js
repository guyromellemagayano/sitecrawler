// External
import axios from "axios";

const useFetcher = async (...args) => {
	try {
		const response = await axios.get(...args);
		const data = await response.data;

		return data;
	} catch (error) {
		// Debugging purpose only
		// console.log('Error', error.config);
		// console.log('Error', error.response.data);
		// console.log('Error', error.response.headers);
		// console.log('Error', error.response.status);
		// console.log('Error', error.request);

		throw error.message;
	}
};

export default useFetcher;
