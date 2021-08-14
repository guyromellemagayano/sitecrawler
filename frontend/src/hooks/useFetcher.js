// External
import axios from "axios";
import Cookies from "js-cookie";

// Enums
import { ComponentReadyInterval } from "@enums/GlobalValues";

const useFetcher = async (...args) => {
	const sleep = (ms) => {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve;
			}, ms);
		});
	};

	return await axios
		.get(...args, {
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
				"X-CSRFToken": Cookies.get("csrftoken")
			}
		})
		.then(sleep(ComponentReadyInterval))
		.then((response) => {
			if (Math.floor(response.status / 200) == 1) {
				return response.data;
			} else {
				return false;
			}
		})
		.catch((error) => {
			return error.message;
		});
};

export default useFetcher;
