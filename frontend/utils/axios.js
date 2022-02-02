import { SITE_URL } from "@constants/ServerEnv";
import * as Sentry from "@sentry/nextjs";
import axios from "axios";
import Cookies from "js-cookie";

// Custom `axios` instance
const AppAxiosInstance = axios.create({
	baseURL: SITE_URL,
	headers: {
		"Accept": "application/json",
		"Content-Type": "application/json",
		"X-CSRFToken": Cookies.get("csrftoken") ?? null
	},
	validateStatus: function (status) {
		return status >= 200 && status < 600;
	}
});

// Use `axios` interceptors for all HTTP methods (GET, POST, PUT, DELETE, etc.)
AppAxiosInstance.interceptors.request.use(
	(req) => req,
	(err) => Promise.reject(err)
);

AppAxiosInstance.interceptors.response.use(
	(res) => res,
	(err) => {
		if (err.response) {
			// Capture `response` errors and send to Sentry
			Sentry.captureException(err.response);

			return err.response;
		} else if (err.request) {
			// Capture `request` errors and send to Sentry
			Sentry.captureException(err.request);

			return err.request;
		} else {
			// Capture other errors and send to Sentry
			Sentry.captureException(err);

			return Promise.reject(err);
		}
	}
);

export default AppAxiosInstance;
