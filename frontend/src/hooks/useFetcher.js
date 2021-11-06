import axios from "axios";

/**
 * SWR fetcher callback function to be used for fetching data
 *
 * @param  {string} url
 * @returns {object} response
 * @returns {object} error
 */
const useFetcher = (url = null) =>
	axios
		.get(url ?? null)
		.then(async (response) => response)
		.catch(async (error) => error);

export default useFetcher;
