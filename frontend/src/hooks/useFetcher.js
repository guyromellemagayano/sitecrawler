// External
import axios from 'axios';

const useFetcher = async (...args) => {
	try {
		const response = await axios.get(...args);
		const data = await response.data;

		return data;
	} catch (error) {
		throw error.message;
	}
};

export default useFetcher;
