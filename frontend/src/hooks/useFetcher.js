// External
import * as Sentry from "@sentry/nextjs";
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
				Sentry.captureException(response);
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
