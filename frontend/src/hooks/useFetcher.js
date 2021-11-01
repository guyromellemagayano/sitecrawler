import axios from "axios";

/**
 * SWR fetcher callback function to be used for fetching data
 *
 * @param  {string} url
 * @returns {object} response
 * @returns {object} error
 */
const useFetcher = (url) =>
	axios.get(url).then((response) => (Math.round(response?.status / 200) === 1 ? response?.data : null));

export default useFetcher;
