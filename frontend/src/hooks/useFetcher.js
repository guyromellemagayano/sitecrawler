// External
import * as Sentry from "@sentry/nextjs";
import axios from "axios";
import Cookies from "js-cookie";

const sleep = (ms) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve;
		}, ms);
	});
};

const useFetcher = async (...args) => {
	return await axios
		.get(...args, {
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json",
				"X-CSRFToken": Cookies.get("csrftoken")
			}
		})
		.then(sleep(500))
		.then((response) => {
			if (Math.floor(response.status / 200) == 1) {
				return response.data;
			} else {
				Sentry.captureException(response.data);
				return false;
			}
		})
		.catch((error) => {
			if (error.response) {
				Sentry.captureException(error.response.data);
				Sentry.captureException(error.response.status);
				Sentry.captureException(error.response.headers);
			} else if (error.request) {
				Sentry.captureException(error.request);
			} else {
				Sentry.captureException(error.message);
			}
		});
};

export default useFetcher;
